"use client";

import {
  ActionIcon,
  Box,
  Text,
  Avatar,
  createStyles, Tooltip
} from "@mantine/core";
import {
  IconCircleX, IconDeviceFloppy,
  IconEditCircle
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
  MRT_ColumnDef
} from "mantine-react-table";
import {useRouter} from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {openConfirmModal} from "@mantine/modals";

import {RoomContext} from "@/contexts/RoomContext";
import {
  Booking,
  Room,
  UserBooking
} from "@/constants";
import {BookingContext} from "@/contexts/BookingContext";
import {getUserBookings} from "@/libs/bookings";
import {UserContext} from "@/contexts/UserContext";
import {populateArray} from "@/libs/utils";
import {NavBar} from "@/components/NavBar";

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

export default function UserBookingsPage() {
  const router = useRouter();
  const { classes, theme, cx } = useStyles();

  const { rooms } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const { bookings, retrieveBookings } = useContext(BookingContext);

  const [opened, setOpened] = useState<boolean>(false);
  const [modifyBooking, setModifyBooking] = useState<UserBooking>(undefined);
  const [roomsMap, setRoomsMap] = useState<{[id: string]: Room}>(
    Object.fromEntries(rooms.map((item: Room) => [item.id, item]))
  );
  const [userBookings, setUserBookings] = useState<UserBooking[]>(
    transformUserBookings(getUserBookings(user ? user.id : "default", bookings))
  );

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

    let newBookings: UserBooking[] = transformUserBookings(
      getUserBookings(user.id, retrieveBookings())
    );
    setUserBookings(populateArray(userBookings, newBookings));
    return newBookings;
  }

  function handleBookingCancellation(booking: UserBooking) {
    console.log(`Cancelling booking ${booking.id}`)
    // TODO: API call to cancel changes
    handleBookingChanges();
  }

  const handleSaveRow: MantineReactTableProps<UserBooking>['onEditingRowSave'] =
    async ({ exitEditingMode, row,  }) => {
      // TODO: send/receive api updates here
      handleBookingChanges()
      setOpened(false);
      setModifyBooking(undefined);
      exitEditingMode();
    }

  function handleEditRowCancel({ row, table }) {
    setModifyBooking(undefined);
    setOpened(false);
  }

  useEffect(
    () => {
      if (!user) {
        router.push('/')
      }
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
      },
      {
        accessorKey: 'duration',
        id: "duration",
        header: 'Duration (Hours)',
      },
      {
        accessorFn: (row:  UserBooking) =>
          dayjs(row.start).hour(row.duration).utc(true).local(),
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
        renderRowActions={
          ({row, table}) => (
            <Box
              className={classes.cellBox}
            >
              {
                opened ? <>
                    <Tooltip label={"Save edits"}>
                      <ActionIcon
                        className={classes.cellBoxActionIcon}
                        onClick={
                          () => {
                            table.options.onEditingRowSave?.({
                              exitEditingMode: () => table.setEditingRow(null),
                              row: row,
                              table,
                              values: row._valuesCache ?? { ...row.original }
                            });
                          }
                        }
                      >
                        <IconDeviceFloppy />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={"Cancel edits"}>
                      <ActionIcon
                        className={classes.cellBoxActionIcon}
                        onClick={
                          () => {
                            table.options.onEditingRowCancel?.({ row, table });
                            table.setEditingRow(null);
                          }
                        }
                      >
                        <IconCircleX />
                      </ActionIcon>
                    </Tooltip>
                  </>
                  : <ActionIcon
                    className={classes.cellBoxActionIcon}
                    disabled={dayjs().isAfter(dayjs(row.original.start))}
                    onClick={
                      () => {
                        setOpened(true);
                        setModifyBooking(row.original);
                        table.setEditingRow(row);
                      }
                    }
                  >
                    <IconEditCircle/>
                  </ActionIcon>
              }
              {/*<ActionIcon*/}
              {/*  className={classes.cellBoxActionIcon}*/}
              {/*  disabled={dayjs().isAfter(dayjs(row.original.start))}*/}
              {/*  onClick={*/}
              {/*    () => openConfirmModal({*/}
              {/*      title: 'Cancel Booking',*/}
              {/*      children: (*/}
              {/*        <Text size="sm">*/}
              {/*          Click confirm to cancel the booking*/}
              {/*        </Text>*/}
              {/*      ),*/}
              {/*      labels: { confirm: 'Confirm', cancel: 'Cancel' },*/}
              {/*      closeOnConfirm: true,*/}
              {/*      closeOnCancel: true,*/}
              {/*      onConfirm: () => handleBookingCancellation(row.original),*/}
              {/*    })*/}
              {/*  }*/}
              {/*>*/}
              {/*  <IconCircleX />*/}
              {/*</ActionIcon>*/}
            </Box>
          )
        }
        onEditingRowSave={handleSaveRow}
        onEditingRowCancel={handleEditRowCancel}
        // state={{ isLoading: true }}
      />
    </main>
  )
}