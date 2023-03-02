import {
  Timeline,
  ActionIcon,
  ScrollArea,
  Container,
  Button,
  createStyles
} from "@mantine/core";
import React, {
  FormEvent,
  useContext,
  useEffect,
  useState
} from "react";
import {
  IconCalendar,
  IconCircleCheck,
  IconCircleDotted,
  IconCircleX,
  IconX,
  IconClock
} from "@tabler/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/navigation";
import {useForm} from "@mantine/form";
import {
  DatePicker,
  TimeRangeInput
} from "@mantine/dates";

import {BookingContext} from "@/contexts/BookingContext";
import {
  getCurrentTimeSlots,
  getDateBookings,
  getRoomBookings,
  getTimeline,
  slotToString
} from "@/libs/bookings";
import {
  Booking,
  Room, SLOT_INTERVAL,
  TIMESLOTS
} from "@/constants";
import {UserContext} from "@/contexts/UserContext";
import {BookieDatePicker} from "@/components/DatePicker";
import {BookieTimeline} from "@/components/Timeline";

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
  room: Room
}

export default function SelectTimeSlots(
  {
    room,
  }: SelectTimeSlotProps
) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const {
    bookings, retrieveBookings,
    selectedDate, setDate,
    currentBookings, setCurrentBookings,
    timeSlots, setTimeSlots,
    availableTimeSlots, setAvailableTimeSlots,
    selectedTimeSlots, setSelectedTimeSlots
  } = useContext(BookingContext);
  const { classes, theme, cx } = useStyles();

  function handleClearAllSlots(message?: string) {
    showNotification({
      message: message ? message : `Successfully cleared all slots`,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });

    setSelectedTimeSlots([]);
  }

  function handleDateChanges(
    dateToSet: Date | dayjs.Dayjs | null,
    selectedDate: dayjs.Dayjs,
    setDate: (date: dayjs.Dayjs) => void
  ): dayjs.Dayjs {
    let newDate: dayjs.Dayjs;
    if (
      dateToSet === null ||
      dayjs(dateToSet).isSame(selectedDate, 'day')
    ) {
      newDate = dayjs.utc().local();
    } else {
      newDate = dayjs(dateToSet).utc().local();
    }
    setDate(newDate);
    return newDate;
  }

  function handleTimeSlotChanges(newBookings: Booking[]) {

    setTimeSlots(getCurrentTimeSlots(selectedDate, TIMESLOTS));
    setAvailableTimeSlots(getTimeline(newBookings, timeSlots));
    if (
      selectedTimeSlots.some(
        (slot: number) => !availableTimeSlots.includes(slot)
      )
    ) {
      handleClearAllSlots("Selection time has lapsed, clearing all slots")
    }
  }

  function handleCurrentBookingChanges(newBookings: Booking[]): Booking[] {
    setCurrentBookings(newBookings);
    handleTimeSlotChanges(newBookings);
    return newBookings;
  }

  function handleBookingChanges(): Booking[] {
    let roomBookings: Booking[] = getDateBookings(
      selectedDate,
      getRoomBookings(room.id, retrieveBookings())
    );
    return handleCurrentBookingChanges(roomBookings);
  }

  function updateDateChanges(date: Date | dayjs.Dayjs) {
    let newDate: dayjs.Dayjs = handleDateChanges(date, selectedDate, setDate);
    handleBookingChanges();
    handleClearAllSlots("Selected date has changed, clearing all selected slots");
    form.setFieldValue('start', newDate.utc().toISOString());
  }

  const form = useForm<Booking>({
    initialValues: {
      user: user.id,
      room: room.id,
      start: selectedDate.utc().toISOString(),
      duration: 0,
    },
    validate: {
      start: (value: string) => (
        !dayjs(value).isBefore(dayjs()) ?
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
    form.reset();
  }

  const handleSubmit = (values: typeof form.values, event: FormEvent) => {
    console.log(`Submitting booking with values ${JSON.stringify(values)}`)
    event.preventDefault();
    // TODO: API call to submit booking form
    form.reset();
    handleDateChanges(dayjs(), selectedDate, setDate);
    handleClearAllSlots("Booking submitted, clearing all selected slots");
    handleBookingChanges();
  }

  useEffect(() => {
    const id: NodeJS.Timer = setInterval(() => {handleBookingChanges()}, 300000);
    return () => clearInterval(id)
  },[]);

  useEffect(
    () => {
      console.log(`Selected Date changed to ${selectedDate.utc(true).local().toString()}`)
      console.log("Updating timeslots and setting forms")
      handleBookingChanges();
      form.setFieldValue('start', selectedDate.utc().toISOString());
    },
    [selectedDate]
  );

  useEffect(
    () => {
      if (!user) {
        console.log("User has logged out, redirecting to login page")
        router.push('/login')
      }
    },
    [user]
  );

  useEffect(
    () => {
      if (selectedTimeSlots.length === 0) {
        console.log("Selected time slots have been cleared, updating form")
        form.setFieldValue('duration', 0);
        form.setFieldValue('start', selectedDate.hour(0).minute(0).utc().toISOString())
      } else {
        console.log("Selected time slots have been updated, updating form")
        form.setFieldValue(
          'duration',
          selectedTimeSlots[selectedTimeSlots.length - 1] - selectedTimeSlots[0] + SLOT_INTERVAL
        );
        form.setFieldValue('start', selectedDate.add(selectedTimeSlots[0], 'hour').utc().toISOString())
      }
    },
    [JSON.stringify(selectedTimeSlots)]
  )

  return (
    <Container>
      <BookieDatePicker
        selectedDate={selectedDate}
        updateDateChanges={updateDateChanges}
      />
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
            onClick={() => handleClearAllSlots()}
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