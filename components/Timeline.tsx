
import React, {
  useContext,
  useEffect,
  useState
} from "react";
import {showNotification} from "@mantine/notifications";
import {
  IconCircleCheck,
  IconCircleDotted,
  IconCircleX
} from "@tabler/icons";
import {
  ActionIcon,
  createStyles,
  Timeline
} from "@mantine/core";

import {
  SLOT_INTERVAL,
  TIMESLOTS
} from "@/constants";
import {slotToString} from "@/libs/bookings";
import {BookingContext} from "@/contexts/BookingContext";

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
}));

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

export function BookieTimeline() {
  const { classes, theme, cx } = useStyles();

  const {
    timeSlots,
    availableTimeSlots,
    selectedTimeSlots,
    setSelectedTimeSlots
  } = useContext(BookingContext);

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
    setSelectedTimeSlots(newSelectedSlots);
    handleSelected();
    showNotification({
      message: `Successfully selected 
        ${slotToString(newSelectedSlots[0])} - 
        ${slotToString(newSelectedSlots[newSelectedSlots.length - 1] + SLOT_INTERVAL)}
      `,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });
    return newSelectedSlots;
  }

  function handleClearedSlot(slot: number): number[] {
    let newSelectedSlots: number[] = selectedTimeSlots.length > 0 ?
      selectedTimeSlots.splice(0, selectedTimeSlots.indexOf(slot)) : [];

    setSelectedTimeSlots(newSelectedSlots);
    handleSelected();
    showNotification({
      message: newSelectedSlots.length >= 1 ?
        `Successfully updated selected slots to 
          ${slotToString(newSelectedSlots[0])} - 
          ${slotToString(newSelectedSlots[newSelectedSlots.length - 1] + SLOT_INTERVAL)}
        ` : `Successfully cleared all slots`,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });
    return newSelectedSlots;
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