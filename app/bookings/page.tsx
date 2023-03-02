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
  MRT_ColumnDef, MRT_RowSelectionState
} from "mantine-react-table";
import {useRouter} from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import {RoomContext} from "@/contexts/RoomContext";
import {
  Booking,
  Room,
  UserBooking
} from "@/constants";
import {BookingContext} from "@/contexts/BookingContext";
import {
  getDateBookings,
  getRoomBookings,
  getUserBookings
} from "@/libs/bookings";
import {UserContext} from "@/contexts/UserContext";
import {NavBar} from "@/components/NavBar";
import {TimeRangeInput} from "@mantine/dates";
import {BookieDatePicker} from "@/components/DatePicker";
import {openConfirmModal} from "@mantine/modals";

dayjs.extend(utc);

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

interface ModifyStartDateProps {
  userBooking: UserBooking
}

export function ModifyStartDate(
  {
    userBooking,
  }: ModifyStartDateProps
) {

  const { selectedDate, setDate } = useContext(BookingContext);

  useEffect(
    () => setDate(dayjs(userBooking.start).utc(true).local()),
    []
  );

  return (
    <BookieDatePicker
      selectedDate={selectedDate}
      updateDateChanges={setDate}
    />
  )
}

interface ModifyDurationProps {
  userBooking: UserBooking
}

export function ModifyDuration(
  {
    userBooking,
  }: ModifyDurationProps
) {

  const {
    currentBookings,
    selectedDate, setSelectedDate,
    duration, setDuration
  } = useContext(BookingContext);

  function updateDuration() {
    let first: Date = duration[0] ? duration[0] : dayjs(selectedDate).toDate();
    let second: Date = duration[1] ? duration[1] : dayjs(selectedDate).add(userBooking.duration, 'hour').toDate();

    console.log([first, second]);
    setDuration([first, second]);
    console.log(duration)
  }

  function handleBookingChanges(newDate: dayjs.Dayjs, newBookings: Booking[]) {
    setRoomBookings(getRoomBookings(userBooking.room.id, getDateBookings(selectedDate, newBookings)));
  }

  useEffect(
    () => {

      setSelectedDate(
        !selectedDate.isSame(dayjs(userBooking.start), 'minute') ?
          dayjs(selectedDate) :
          dayjs(userBooking.start).utc(true).local()
      );
      updateDuration();
    },
    []
  );

  useEffect(
    () => {console.log(duration)},
    [JSON.stringify(duration)]
  );

  return (
    <TimeRangeInput
      label={"Select Booking Duration"}
      error={"Invalid time selection, the time slots have either been taken or elapsed"}
      value={duration}
      defaultValue={duration}
      onChange={setDuration}
      icon={<IconClock />}
      required
    />
  )
}

export default function UserBookingsPage() {
  const router = useRouter();
  const { classes, theme, cx } = useStyles();

  const { rooms, roomsMap } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const {
    bookings, retrieveBookings,
    setCurrentBookings,
    selectedDate, setDate,
    selectedDuration, setSelectedDuration
  } = useContext(BookingContext);

  const [userBookings, setUserBookings] = useState<UserBooking[]>(
    transformUserBookings(getUserBookings(user ? user.id : "default", bookings))
  );

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  function transformUserBookings(toTransform: Booking[]): UserBooking[] {
    let transformedBookings: UserBooking[] = [];
    toTransform.forEach(
      (booking: Booking) => {
        const userBooking: UserBooking = {
          ...booking,
          room: roomsMap[booking.room],
        };
        transformedBookings.push(userBooking);
      }
    );
    return transformedBookings
  }

  function handleBookingChanges(): UserBooking[] {
    if (!user) {
      router.push("/login")
      return [];
    }

    let newBookings: Booking[] = getUserBookings(user.id, retrieveBookings());
    setCurrentBookings(newBookings);

    let newUserBookings: UserBooking[] = transformUserBookings(newBookings);
    setUserBookings(newUserBookings);
    return newUserBookings;
  }

  function handleBookingCancellation(
    rowSelection: MRT_RowSelectionState
  ) {
    console.log(`Cancelling bookings ${rowSelection}`)
    setUserBookings(userBookings.filter((booking: UserBooking) => !(booking.id in rowSelection)));
    // TODO: API call to cancel changes
    // handleBookingChanges();
  }

  const handleSaveRow: MantineReactTableProps<UserBooking>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values}) => {
      let first: dayjs.Dayjs = dayjs(selectedDuration[0]).utc();
      let second: dayjs.Dayjs = dayjs(selectedDuration[1]).utc();
      userBookings[row.index]["start"] = selectedDate?.toISOString()
      userBookings[row.index]["duration"] = second.diff(first, 'minute');
      setUserBookings([...userBookings]);
      // TODO: send/receive api updates here
      // handleBookingChanges()
      exitEditingMode();
    }

  function handleEditRowCancel() {
    setDate(undefined);
    setSelectedDuration([null, null]);
  }

  useEffect(() => {
    //do something when the row selection changes...
    console.info({ rowSelection });
  }, [rowSelection]);

  useEffect(
    () => {
      if (!user) {
        router.push('/')
      }
      handleBookingChanges();
    },
    []
  )

  useEffect(
    () => {handleBookingChanges()},
    [bookings]
  )

  const columns = useMemo<MRT_ColumnDef<UserBooking>[]>(
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
        accessorFn: (row: UserBooking) =>
          dayjs(row.start).utc(true).local(),
        id: "start",
        header: 'Start Date Time',
        Cell: ({ cell }) => (
          <span>{cell.getValue<dayjs.Dayjs>().utc(true).local().toString()}</span>
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
        accessorFn: (row:  UserBooking) =>
          dayjs(row.start).add(row.duration, 'hour').utc(true).local(),
        id: "end",
        header: 'End Date Time',
        Cell: ({ cell }) => (
          <span>{cell.getValue<dayjs.Dayjs>().utc(true).local().toString()}</span>
        ),
        enableEditing: false,
      },
      {
        accessorFn: (row: UserBooking) =>
          dayjs(row.lastModified).utc(true).local(),
        id: "lastModified",
        header: 'Last Modified',
        Cell: ({ cell }) => (
          <span>{cell.getValue<dayjs.Dayjs>().utc(true).local().toString()}</span>
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
        onEditingRowCancel={handleEditRowCancel}

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
                onConfirm: () => handleBookingCancellation(rowSelection)
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