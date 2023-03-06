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
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/navigation";
import {useForm} from "@mantine/form";

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
import {UserContext} from "@/contexts/UserContext";
import {BookieDatePicker} from "@/components/DatePicker";
import {BookieTimeline} from "@/components/Timeline";
import {createBooking} from "@/libs/rest";
import {handleApiError} from "@/components/Errors";

dayjs.extend(utc);

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

export default function SelectTimeSlots(
  {
    room,
  }: SelectTimeSlotProps
) {
  const router = useRouter();
  const { user, token } = useContext(UserContext);
  const {
    retrieveBookings,
    selectedDate, setDate,
    setCurrentBookings,
    timeSlots, setTimeSlots,
    availableTimeSlots, setAvailableTimeSlots,
    selectedTimeSlots, setSelectedTimeSlots
  } = useContext(BookingContext);
  const { classes } = useStyles();

  function handleTimeSlotChanges(newBookings: IBooking[]) {
    console.log("Current timeslots", getCurrentTimeSlots(selectedDate, TIMESLOTS))
    setTimeSlots(getCurrentTimeSlots(selectedDate, TIMESLOTS));
    console.log("Available time slots", getCurrentTimeSlots(selectedDate, TIMESLOTS))
    setAvailableTimeSlots(getTimeline(newBookings, timeSlots));
    if (
      selectedTimeSlots.some(
        (slot: number) => !availableTimeSlots.includes(slot)
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

  function handleCurrentBookingChanges(newBookings: IBooking[]): IBooking[] {
    setCurrentBookings(newBookings);
    handleTimeSlotChanges(newBookings);
    return newBookings;
  }

  const handleBookingChanges = async () => {
    let roomBookings: IBooking[] = getDateBookings(
      selectedDate, getRoomBookings(room.id, await retrieveBookings())
    );
    return handleCurrentBookingChanges(roomBookings);
  }

  const form = useForm<IBooking>({
    initialValues: {
      user: user ? user.id : 'default',
      room: room.id,
      start: selectedDate.utc().toISOString(),
      duration: 0,
    },
    validate: {
      start: (value: string) => (
        dayjs(value).isBefore(dayjs()) ?
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

  const handleSubmit = async (values: typeof form.values, event: FormEvent) => {
    console.log(`Submitting booking with values ${JSON.stringify(values)}`)
    event.preventDefault();
    try {
      await createBooking(values, token);
      form.reset();
      setDate(dayjs());
      setSelectedTimeSlots([]);
      showNotification({
        message: "Booking submitted, clearing all selected slots",
        icon: <IconCircleCheck />,
        color: 'green',
        autoClose: 5000,
      });
      await handleBookingChanges();
    } catch (e) {
      handleApiError(e);
      form.reset();
    }
  }

  useEffect(
    () => {handleBookingChanges();},
    []
  );

  useEffect(
    () => {
      console.log(`Selected Date changed to ${selectedDate.toString()}`);
      console.log("Updating timeslots and setting forms");
      showNotification({
        message: "Selected date has changed, clearing all selected slots",
        icon: <IconCircleCheck />,
        color: 'green',
        autoClose: 5000,
      });
      form.setFieldValue('start', selectedDate.utc().toISOString());
      handleBookingChanges();
    },
    [selectedDate]
  );

  useEffect(
    () => {
      if (!user) {
        console.log("User has logged out, redirecting to login page");
        router.push('/login');
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
          ${date.toString()} with duration ${duration} hours, updating form`
        );
        form.setFieldValue('duration', duration);
        form.setFieldValue('start', date.utc().toISOString())
      }
    },
    [JSON.stringify(selectedTimeSlots)]
  )

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