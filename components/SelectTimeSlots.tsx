"use client";

import {
  ScrollArea,
  Container,
  Button,
  createStyles
} from "@mantine/core";
import React, {
  FormEvent,
  useContext,
  useEffect,
} from "react";
import {
  IconCircleCheck,
  IconX,
} from "@tabler/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/navigation";
import {useForm} from "@mantine/form";
import {
  QueryClient,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import {
  AxiosError,
  AxiosResponse
} from "axios";

import {BookingContext} from "@/contexts/BookingContext";
import {
  getCurrentTimeSlots,
  getDateBookings,
  getRoomBookings,
  getTimeline,
} from "@/libs/bookings";
import {
  IBooking,
  IRoom,
  SLOT_INTERVAL,
  TIMESLOTS
} from "@/constants";
import BookieDatePicker from "@/components/DatePicker";
import BookieTimeline from "@/components/Timeline";
import {API} from "@/libs/rest";
import handleApiError from "@/hooks/errors";
import {useBookings} from "@/hooks/bookings";
import Loading from "@/components/Loading";
import {UserContext} from "@/contexts/UserContext";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const useStyles = createStyles((theme, _params, getRef) => ({

  scrollBar: {
    width: 300,
    height: 400,
    alignContent: 'center',
    justifyContent: 'center'
  },

}));

interface SelectTimeSlotProps {
  room: IRoom;
}

interface CreateBookingProps {
  booking: IBooking;
  token: string;
}

export default function SelectTimeSlots(
  {
    room,
  }: SelectTimeSlotProps
) {
  const router = useRouter();
  const {
    setBookings,
    selectedDate, setDate,
    setCurrentBookings,
    setTimeSlots,
    setAvailableTimeSlots,
    selectedTimeSlots, setSelectedTimeSlots
  } = useContext(BookingContext);
  const { classes } = useStyles();

  const queryClient: QueryClient = useQueryClient();
  const {user, token} = useContext(UserContext);

  const {mutate: createBooking} = useMutation({
    mutationFn: ({booking, token}: CreateBookingProps) => API.post(
      `/bookings`, booking, {headers: {Authorization: `Bearer ${token}`}}
    ).then((response: AxiosResponse) => response.data),
    onSuccess: (_, variables: CreateBookingProps) => {
      console.log(`Successfully created booking ${JSON.stringify(variables.booking)}`);
      setDate(dayjs());
      setSelectedTimeSlots([]);
      showNotification({
        message: "Booking submitted, clearing all selected slots",
        icon: <IconCircleCheck />,
        color: 'green',
        autoClose: 5000,
      });
      return queryClient.invalidateQueries(['bookings']);
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
    }
  })

  const handleTimeSlotChanges = (newBookings: IBooking[]) => {
    let newTimeSlots: number[] = getCurrentTimeSlots(selectedDate, TIMESLOTS);
    setTimeSlots(newTimeSlots);
    let newAvailableTimeSlots: number[] = getTimeline(newBookings, newTimeSlots);
    setAvailableTimeSlots(newAvailableTimeSlots);
    if (
      selectedTimeSlots.some(
        (slot: number) => !newAvailableTimeSlots.includes(slot)
      )
    ) {
      showNotification({
        message: "Selection time has lapsed, clearing all slots",
        icon: <IconCircleCheck />,
        color: 'green',
        autoClose: 5000,
      });
      setSelectedTimeSlots([]);
    }
  }

  const handleBookingChanges = (newBookings: IBooking[]) => {
    let roomBookings: IBooking[] = getDateBookings(
      selectedDate, getRoomBookings(room.id, newBookings)
    );
    setBookings(newBookings);
    setCurrentBookings(roomBookings);
    handleTimeSlotChanges(roomBookings);
  }

  const {isLoading} = useBookings(handleBookingChanges);
  const form = useForm<IBooking>({
    initialValues: {
      user: user ? user.id : 'default',
      room: room.id,
      start: selectedDate.utc().toISOString(),
      duration: 0,
    },
    validate: {
      start: (value: string) => (
        dayjs(value).isBefore(dayjs().utc()) ?
          "Selected date has to be greater than the current date" :
          null
      ),
      duration: (value: number) => (
        value <= 0 ? "Selected duration has to be greater than 0" : null
      )
    },
  });

  const handleErrors = (errors: typeof form.errors, values: typeof form.values) => {
    console.log(`Errors ${JSON.stringify(errors)} occurred when 
                 submitting form with values ${JSON.stringify(values)}`)
    if (errors.start) {
      showNotification({
        icon: <IconX />,
        message: errors.start,
        color: 'red',
        autoClose: 5000,
      });
    } else if (errors.duration) {
      showNotification({
        icon: <IconX />,
        message: errors.duration,
        color: 'red',
        autoClose: 5000,
      });
    }
  }

  const handleSubmit = (values: typeof form.values, event: FormEvent) => {
    console.log(`Submitting booking with values ${JSON.stringify(values)}`);
    event.preventDefault();
    createBooking({booking: values, token: token!});
    form.reset();
  }

  useEffect(
    () => {
      console.log(`Selected Date changed to ${selectedDate.format('llll')}`);
      console.log("Updating timeslots and setting forms");
      showNotification({
        message: "Selected date has changed, clearing all selected slots",
        icon: <IconCircleCheck />,
        color: 'green',
        autoClose: 5000,
      });
      form.setFieldValue('start', selectedDate.utc().toISOString());
      queryClient.invalidateQueries(['bookings']);
    },
    [selectedDate]
  );

  useEffect(
    () => {
      if (!user) {
        console.log("User has logged out, redirecting to home page");
        router.push('/');
      }
    },
    [user]
  );

  useEffect(
    () => {
      if (selectedTimeSlots.length === 0) {
        console.log("Selected time slots have been cleared, updating form");
        form.setFieldValue('duration', 0);
        form.setFieldValue('start', selectedDate.hour(0).minute(0).utc().toISOString())
      } else {
        let duration: number = selectedTimeSlots[selectedTimeSlots.length - 1] - selectedTimeSlots[0] + SLOT_INTERVAL;
        let date: dayjs.Dayjs = selectedDate.hour(selectedTimeSlots[0], 'hour').minute(0).second(0);
        console.log(
          `Selected time slots have been updated to 
          ${date.format('llll')} with duration ${duration} hours, updating form`
        );
        form.setFieldValue('duration', duration);
        form.setFieldValue('start', date.utc().toISOString())
      }
    },
    [JSON.stringify(selectedTimeSlots)]
  )

  if (isLoading) return <Loading />

  return (
    <Container>
      <BookieDatePicker />
      <ScrollArea
        className={classes.scrollBar}
        type={'hover'}
        offsetScrollbars
      >
        <BookieTimeline />
      </ScrollArea>
      <Button.Group>
        <form
          onSubmit={form.onSubmit(handleSubmit, handleErrors)}
        >
          <Button
            onClick={
              () => {
                showNotification({
                  message: "Clearing selected time slots",
                  icon: <IconCircleCheck />,
                  color: 'green',
                  autoClose: 5000,
                });
                setSelectedTimeSlots([]);
              }
            }
          >
            Clear Selection
          </Button>
          <Button
            type={"submit"}
          >
            Submit Booking
          </Button>
        </form>
      </Button.Group>
    </Container>
  )
}