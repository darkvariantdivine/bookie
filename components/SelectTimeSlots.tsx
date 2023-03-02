import {
  Timeline,
  ActionIcon,
  ScrollArea,
  Container, Button, createStyles
} from "@mantine/core";
import React, {FormEvent, useContext, useEffect, useState} from "react";
import {
  IconCalendar,
  IconCircleCheck,
  IconCircleDotted,
  IconCircleX,
  IconX
} from "@tabler/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/navigation";
import {useForm} from "@mantine/form";
import {DatePicker} from "@mantine/dates";

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
import {
  populateArray,
  resetArray
} from "@/libs/utils";
import {UserContext} from "@/contexts/UserContext";

dayjs.extend(utc);

const useStyles = createStyles((theme, _params, getRef) => ({

  scrollBar: {
    width: 300,
    height: 400,
    alignContent: 'center',
    justifyContent: 'center'
  },

  scrollBarRotated: {
    width: 600,
    height: 200
  },

  timeline: {
    paddingLeft: '4%',
    margin: "4%"
  },

  timelineRotated: {
    position: 'relative',
    rotate: '-90deg',
  },

  timelineItemActive: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.teal[5],
      border: 'solid',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3],
      borderWidth: '1px',
      borderRadius: '50%',
      justifyContent: 'center'
    },
  },

  timelineItemSelected: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.cyan[3],
      border: 'solid',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
      borderWidth: '1px',
      borderRadius: '50%',
      justifyContent: 'center'
    },
  },

  timelineBulletRotated: {
    rotate: '-90deg',
  }
}));

interface BookieDatePickerProps {
  selectedDate: dayjs.Dayjs
  updateDateChanges: (date: Date | dayjs.Dayjs) => void
}

interface BookieTimelineProps {
  timeSlots: number[]
  availableTimeSlots: number[]
  selectedTimeSlots: number[]
  setSelectedTimeSlots: (selectedTimeSlots: number[]) => void
}

interface SelectTimeSlotProps {
  room: Room
}

interface TimelineState {
  slotStr: string
  slot: number
  hidden: boolean
  active: boolean
  selected: boolean
  setHidden: (hidden: boolean) => void
  setActive: (active: boolean) => void
  setSelected: (selected: boolean) => void
}

export function handleDateChanges(
  dateToSet: Date | dayjs.Dayjs,
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

export function BookieDatePicker(
  {
    selectedDate,
    updateDateChanges,
  }: BookieDatePickerProps
) {
  return (
    <DatePicker
      label={"Select Booking Date"}
      description={"View available slots for chosen date"}
      placeholder={selectedDate.utc(true).local().toString()}
      variant={'filled'}
      withAsterisk
      value={selectedDate}
      onChange={updateDateChanges}
      clearable
      dropdownPosition={"bottom-start"}
      dropdownType={'popover'}
      icon={<IconCalendar />}
      transition={'slide-down'}
      transitionDuration={200}
      excludeDate={(date: Date) => dayjs(date).isBefore(dayjs(), 'day')}
    />
  );
}

export function BookieTimeline(
  {
    timeSlots,
    availableTimeSlots,
    selectedTimeSlots,
    setSelectedTimeSlots,
  }: BookieTimelineProps
) {
  const { classes, theme, cx } = useStyles();

  let timelineStates: TimelineState[] = TIMESLOTS.map(
    (slot: number) => {
      const [hidden, setHidden] = useState<boolean>(!timeSlots.includes(slot))
      const [active, setActive] = useState<boolean>(availableTimeSlots.includes(slot));
      const [selected, setSelected] = useState<boolean>(selectedTimeSlots.includes(slot));
      return {
        slotStr: slotToString(slot),
        slot: slot,
        hidden,
        active,
        selected,
        setHidden,
        setActive,
        setSelected
      }
    }
  );

  function handleSelected() {
    console.log("Is called")
    timelineStates.forEach(
      (state: TimelineState) => {
        state.setSelected(selectedTimeSlots.includes(state.slot));
      }
    );
  }

  function updateTimeSlots() {
    timelineStates.forEach(
      (state: TimelineState) => {
        state.setHidden(!timeSlots.includes(state.slot));
        state.setActive(availableTimeSlots.includes(state.slot));
      }
    )
  }

  function handleSelectedSlot(slot: number): number[] {
    let newSelectedSlots: number[];
    if (selectedTimeSlots.length === 0) {
      newSelectedSlots = [slot];
    } else {
      let earlierSlot: number = selectedTimeSlots[0] > slot ? slot : selectedTimeSlots[0];
      let laterSlot: number = selectedTimeSlots[0] < slot ? slot : selectedTimeSlots[0];
      newSelectedSlots = timeSlots.slice(
        timeSlots.indexOf(earlierSlot),
        timeSlots.indexOf(laterSlot) + 1
      ).sort();
    }
    if (
      newSelectedSlots.some(
        (slot: number) => !availableTimeSlots.includes(slot)
      )
    ) {
      showNotification({
        message: "Attempting to add an invalid set of slot(s)",
        icon: <IconCircleX />,
        color: 'red',
        autoClose: 5000,
      });
      return selectedTimeSlots;
    }
    setSelectedTimeSlots(populateArray(selectedTimeSlots, newSelectedSlots));
    handleSelected();
    showNotification({
      message: `Successfully selected 
        ${slotToString(selectedTimeSlots[0])} - 
        ${slotToString(selectedTimeSlots[selectedTimeSlots.length - 1] + SLOT_INTERVAL)}
      `,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });
    return selectedTimeSlots;
  }

  function handleClearedSlot(slot: number): number[] {
    let newSelectedSlots: number[] = selectedTimeSlots.length > 0 ?
      selectedTimeSlots.splice(0, selectedTimeSlots.indexOf(slot)) : [];

    setSelectedTimeSlots(populateArray(selectedTimeSlots, newSelectedSlots));
    handleSelected();
    showNotification({
      message: selectedTimeSlots.length >= 1 ?
        `Successfully updated selected slots to 
          ${slotToString(selectedTimeSlots[0])} - 
          ${slotToString(selectedTimeSlots[selectedTimeSlots.length - 1] + SLOT_INTERVAL)}
        ` : `Successfully cleared all slots`,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });
    return selectedTimeSlots;
  }

  useEffect(
    () => handleSelected(),
    [JSON.stringify(selectedTimeSlots)]
  )

  useEffect(
    () => updateTimeSlots(),
    [timeSlots.length, availableTimeSlots.length]
  )

  return (
    <Timeline>
      {
        timelineStates.filter(
          (state: TimelineState) => {
            return !state.hidden
          }
        ).map((state: TimelineState) => {
          return (
            <Timeline.Item
              key={state.slotStr}
              title={
                state.selected ? `${state.slotStr} is selected` :
                  state.active ? `${state.slotStr} slot is available` :
                    `${state.slotStr} is booked`
              }
              active={state.active || state.selected}
              color={state.selected ? 'cyan' : state.active ? 'teal' : 'gray'}
              lineActive={state.active || state.selected}
              lineVariant={state.selected ? 'dashed' : state.active ? "dotted" : 'solid'}
              bullet={
                state.selected ?
                  <ActionIcon
                    className={classes.timelineItemSelected}
                    variant={"transparent"}
                    onClick={
                      () => {
                        state.setSelected(!state.selected);
                        handleClearedSlot(state.slot);
                      }
                    }
                  >
                    <IconCircleCheck />
                  </ActionIcon> :
                  state.active ?
                    <ActionIcon
                      className={classes.timelineItemActive}
                      variant={'transparent'}
                      onClick={
                        () => {
                          state.setSelected(true);
                          handleSelectedSlot(state.slot);
                        }
                      }
                    >
                      <IconCircleDotted />
                    </ActionIcon> :
                    <ActionIcon
                      disabled={!state.active}
                      variant={"transparent"}
                    >
                      <IconCircleX />
                    </ActionIcon>
              }
            />
          )
        })
      }
    </Timeline>
  );
}

export default function SelectTimeSlots(
  {
    room,
  }: SelectTimeSlotProps
) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { bookings, retrieveBookings } = useContext(BookingContext);
  const { classes, theme, cx } = useStyles();

  const [ selectedDate, setDate ] = useState<dayjs.Dayjs>(dayjs());
  const [ currentBookings, setCurrentBookings ] = useState<Booking[]>(getDateBookings(selectedDate, bookings));
  const [ timeSlots, setTimeSlots ] = useState<number[]>(getCurrentTimeSlots(selectedDate, TIMESLOTS));
  const [ availableTimeSlots, setAvailableTimeSlots ] = useState<number[]>(getTimeline(currentBookings, timeSlots));
  const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<number[]>([]);

  function handleClearAllSlots(message?: string) {
    showNotification({
      message: message ? message : `Successfully cleared all slots`,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });

    setSelectedTimeSlots(resetArray(selectedTimeSlots));
  }

  function handleTimeSlotChanges(newBookings: Booking[]) {
    setTimeSlots(
      populateArray(
        timeSlots,
        getCurrentTimeSlots(selectedDate, TIMESLOTS)
      )
    );
    setAvailableTimeSlots(
      populateArray(
        availableTimeSlots,
        getTimeline(newBookings, timeSlots)
      )
    );
    if (
      selectedTimeSlots.some(
        (slot: number) => !availableTimeSlots.includes(slot)
      )
    ) {
      handleClearAllSlots("Selection time has lapsed, clearing all slots")
    }
  }

  function handleCurrentBookingChanges(newBookings: Booking[]): Booking[] {
    setCurrentBookings(populateArray(currentBookings, newBookings));
    handleTimeSlotChanges(newBookings);
    return newBookings;
  }

  function handleBookingChanges(): Booking[] {
    let roomBookings: Booking[] = getRoomBookings(room.id, retrieveBookings());
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
    const id = setInterval(() => {handleBookingChanges()}, 300000);
    return () => clearInterval(id)
  },[]);

  useEffect(
    () => {
      handleTimeSlotChanges(currentBookings);
    },
    [selectedDate]
  );

  useEffect(
    () => {
      if (!user) {
        router.push('/login')
      }
    },
    [user]
  );

  useEffect(
    () => {
      if (selectedTimeSlots.length === 0) {
        form.setFieldValue('duration', 0);
      } else {
        form.setFieldValue(
          'duration',
          selectedTimeSlots[selectedTimeSlots.length - 1] - selectedTimeSlots[0] + SLOT_INTERVAL
        );
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
        <BookieTimeline
          timeSlots={timeSlots}
          availableTimeSlots={availableTimeSlots}
          selectedTimeSlots={selectedTimeSlots}
          setSelectedTimeSlots={setSelectedTimeSlots}
        />
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