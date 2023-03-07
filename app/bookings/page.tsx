"use client";

import {
  Box,
  Text,
  Avatar,
  createStyles,
  Button
} from "@mantine/core";
import {
  IconCircleX,
  IconClock
} from "@tabler/icons";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  MantineReactTable,
  MantineReactTableProps,
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowSelectionState
} from "mantine-react-table";
import {openConfirmModal} from "@mantine/modals";
import {useRouter} from "next/navigation";
import {TimeRangeInput} from "@mantine/dates";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

import {
  IBooking,
  IRoom
} from "@/constants";
import {BookingContext} from "@/contexts/BookingContext";
import {
  getUserBookings
} from "@/libs/bookings";
import NavBar from "@/components/NavBar";
import BookieDatePicker from "@/components/DatePicker";
import handleApiError from "@/hooks/errors";
import {roundInterval} from "@/libs/utils";
import Loading from "@/components/Loading";
import {useRoomsMap} from "@/hooks/rooms";
import {
  useBookings,
  useDeleteBookings,
  useUpdateBooking
} from "@/hooks/bookings";
import {UserContext} from "@/contexts/UserContext";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const useStyles = createStyles((theme, _params, getRef) => ({
  cellBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  cellBoxActionIcon: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      border: 'solid',
      borderWidth: '1px',
      borderRadius: '50%',
      justifyContent: 'center'
    },
  }
}));


interface IUserBooking {
  id: string;
  user: string;
  room: IRoom;
  start: dayjs.Dayjs;
  duration: number;
  end: dayjs.Dayjs;
  lastModified: dayjs.Dayjs;
}

interface ModifyStartDateProps {
  userBooking: IUserBooking;
}

const ModifyStartDate = (
  {
    userBooking,
  }: ModifyStartDateProps
): React.ReactElement => {

  const { setDate } = useContext(BookingContext);

  useEffect(
    () => {
      setDate(dayjs(userBooking.start))
    },
    []
  );

  return (
    <BookieDatePicker />
  )
}


interface ModifyDurationProps {
  userBooking: IUserBooking;
}

const ModifyDuration = (
  {
    userBooking,
  }: ModifyDurationProps
): React.ReactElement => {

  const {
    selectedDate, setDate,
    duration, setDuration
  } = useContext(BookingContext);

  function updateDuration(newDuration: [Date, Date]) {
    let first: Date = dayjs(selectedDate)
    .hour(newDuration[0]!.getHours())
    .minute(newDuration[0]!.getMinutes())
    .second(0)
    .toDate();
    let second: Date = dayjs(selectedDate)
    .hour(newDuration[1]!.getHours())
    .minute(newDuration[1]!.getMinutes())
    .second(0)
    .toDate();

    setDuration([first, second]);
  }

  useEffect(
    () => {
      let date: dayjs.Dayjs = !selectedDate.isSame(dayjs(userBooking.start), 'minute') ?
        dayjs(selectedDate) :
        dayjs(userBooking.start)
      setDate(date);
      updateDuration([
        dayjs(date).toDate(),
        dayjs(date).add(userBooking.duration, 'hour').toDate()
      ]);
    },
    []
  );

  useEffect(
    () => updateDuration(duration),
    [selectedDate]
  )

  return (
    <TimeRangeInput
      label={"Select Booking Duration"}
      value={duration}
      defaultValue={duration}
      onChange={setDuration}
      icon={<IconClock />}
      required
    />
  )
}

const UserBookingsPage = (): React.ReactElement => {
  const router = useRouter();
  const { classes, theme, cx } = useStyles();

  const {user, token} = useContext(UserContext);
  const { mutate: deleteBookings } = useDeleteBookings();
  const { mutate: updateBooking } = useUpdateBooking();

  const {
    setBookings,
    setCurrentBookings,
    selectedDate, setDate,
    duration, setDuration
  } = useContext(BookingContext);

  const [userBookings, setUserBookings] = useState<IUserBooking[]>([]);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const { isLoading, data: roomsMap } = useRoomsMap();
  const { data: bookings } = useBookings();

  const transformUserBookings = (toTransform: IBooking[]): IUserBooking[] => {
    let transformedBookings: IUserBooking[] = [];
    toTransform.forEach(
      (booking: IBooking) => {
        const userBooking: IUserBooking = {
          id: booking.id!,
          user: booking.user!,
          room: roomsMap![booking.room],
          start: dayjs(booking.start),
          duration: booking.duration,
          end: dayjs(booking.start).add(booking.duration, 'hours'),
          lastModified: dayjs(booking.lastModified)
        }
        transformedBookings.push(userBooking);
      }
    );
    return transformedBookings
  }

  const handleBookingChanges = () => {
    if (!user) {
      console.log("User has been logged out, redirecting to home page");
      router.push("/");
      return [];
    }

    try {

      let newBookings: IBooking[] = getUserBookings(user.id, bookings!);
      setBookings(bookings!);
      setCurrentBookings(newBookings);

      let newUserBookings: IUserBooking[] = transformUserBookings(newBookings);
      setUserBookings(newUserBookings);
      return newUserBookings;
    } catch (e) {
      handleApiError(e);
    }
  }

  const handleBookingCancellation = async (
    rowSelection: MRT_RowSelectionState
  ) => {
    console.log(`Cancelling bookings ${JSON.stringify(Object.keys(rowSelection))}`);
    setUserBookings(userBookings.filter((booking: IUserBooking) => !(booking.id in rowSelection)));

    await deleteBookings({bookings: Object.keys(rowSelection), token: token!});
    handleBookingChanges();
    setRowSelection({});
  }

  const handleSaveRow: MantineReactTableProps<IUserBooking>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values}) => {
      let firstRounded: {[k: string]: number} = roundInterval(duration[0]!.getMinutes());
      let secondRounded: {[k: string]: number} = roundInterval(duration[1]!.getMinutes());

      let first: dayjs.Dayjs = dayjs(selectedDate)
        .hour(duration[0].getHours() + firstRounded['hours'])
        .minute(firstRounded['minutes'])
        .utc();
      let second: dayjs.Dayjs = dayjs(selectedDate)
        .hour(duration[1].getHours() + secondRounded['hours'])
        .minute(secondRounded['minutes'])
        .utc();

      let updates: {[k: string]: string | number} = {
        start: first.toISOString(),
        duration: second.diff(first, 'minute') / 60
      }
      console.log(`Updating values ${JSON.stringify(updates)}`);

      await updateBooking({booking_id: row.original.id, updates: updates, token: token!});
      handleBookingChanges();
      exitEditingMode();
    }

  const handleEditCancel = ({ row }: { row: MRT_Row<IUserBooking>}) => {
    setDate(dayjs(row.original.start));
    setDuration([null, null])
  }

  useEffect(
    () => {handleBookingChanges();},
    [roomsMap, JSON.stringify(bookings)]
  )

  if (isLoading) return <Loading />

  const columns = useMemo<MRT_ColumnDef<IUserBooking>[]>(
    () => [
      {
        accessorKey: "room.name",
        id: "room",
        header: 'Room',
        Cell: ({ renderedCellValue, row }) => (
          <Box
            className={classes.cellBox}
          >
            <Link
              href={`/rooms/${row.original.room.id}`}
            >
              <Avatar
                src={row.original.room.images ? row.original.room.images[0] : "/Logo.png"}
                alt={"Meeting Room Image"}
                radius={"xl"}
              />
            </Link>
            <Text>{renderedCellValue}</Text>
          </Box>
        ),
        enableEditing: false,
      },
      {
        accessorKey: 'start',
        id: "start",
        header: 'Start Date Time',
        Cell: ({ cell }) => (
          <span>{cell.getValue<dayjs.Dayjs>().format("llll")}</span>
        ),
        Edit: ({cell, row, table}) => <ModifyStartDate userBooking={row.original} />,
      },
      {
        accessorKey: 'duration',
        id: "duration",
        header: 'Duration (Hours)',
        Edit: ({cell, row, table}) => <ModifyDuration userBooking={row.original} />,
      },
      {
        accessorKey: "end",
        id: "end",
        header: 'End Date Time',
        Cell: ({ cell }) => (
          <span>{cell.getValue<dayjs.Dayjs>().format("llll")}</span>
        ),
        enableEditing: false,
      },
      {
        accessorKey: 'lastModified',
        id: "lastModified",
        header: 'Last Modified',
        Cell: ({ cell }) => (
          <span>{cell.getValue<dayjs.Dayjs>().format("llll")}</span>
        ),
        enableEditing: false,
      },
    ],
    []
  );

  return (
    <main>
      <NavBar />
      <MantineReactTable
        columns={columns}
        data={userBookings}
        enableEditing
        editingMode={"row"}
        enableRowActions
        positionActionsColumn={"first"}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Edit',
          },
        }}
        onEditingRowSave={handleSaveRow}
        onEditingRowCancel={handleEditCancel}

        enableRowSelection
        enableSelectAll
        enableMultiRowSelection

        renderTopToolbarCustomActions={() => (
          <Button
            onClick={
              () => openConfirmModal({
                title: 'Cancel Booking',
                children: (
                  <Text size="sm">
                    Confirm to cancel the selected bookings
                  </Text>
                ),
                labels: { confirm: 'Confirm', cancel: 'Cancel' },
                closeOnConfirm: true,
                closeOnCancel: true,
                onConfirm: async () => await handleBookingCancellation(rowSelection)
              })
            }
            leftIcon={<IconCircleX />}
          >
            Cancel Bookings
          </Button>
        )}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        getRowId={(originalRow) => originalRow.id}
        // state={{ isLoading: true }}
      />
    </main>
  )
}

export default UserBookingsPage;
