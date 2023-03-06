import {
  ActionIcon,
  createStyles,
  Timeline
} from "@mantine/core";
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

import {BookingContext} from "@/contexts/BookingContext";
import {slotToString} from "@/libs/bookings";
import {SLOT_INTERVAL} from "@/constants";

const useStyles = createStyles((theme, _params, getRef) => ({
  timelineItem: {
    display: 'table',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },

  timelineItemActive: {
    display: 'table-cell',
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
    display: 'table-cell',
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

interface BookieTimelineItemProps {
  slot: number
  slotStr: string
}

export default function BookieTimelineItem(
  {
    slot,
    slotStr
  }: BookieTimelineItemProps
) {
  const { classes } = useStyles();

  const {
    timeSlots,
    availableTimeSlots,
    selectedTimeSlots,
    setSelectedTimeSlots
  } = useContext(BookingContext);

  const [active, setActive] = useState<boolean>(availableTimeSlots.includes(slot));
  const [selected, setSelected] = useState<boolean>(selectedTimeSlots.includes(slot));

  function handleSelectedSlot(slot: number) {
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
    showNotification({
      message: `Successfully selected 
        ${slotToString(newSelectedSlots[0])} - 
        ${slotToString(newSelectedSlots[newSelectedSlots.length - 1] + SLOT_INTERVAL)}
      `,
      icon: <IconCircleCheck />,
      color: 'green',
      autoClose: 5000,
    });
  }

  function handleClearedSlot(slot: number) {
    let newSelectedSlots: number[] = selectedTimeSlots.length > 0 ?
      selectedTimeSlots.splice(0, selectedTimeSlots.indexOf(slot)) : [];

    setSelectedTimeSlots(newSelectedSlots);
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
  }

  useEffect(
    () => {setSelected(selectedTimeSlots.includes(slot));},
    [JSON.stringify(selectedTimeSlots)]
  );

  useEffect(
    () => {setActive(availableTimeSlots.includes(slot));},
    [JSON.stringify(timeSlots), JSON.stringify(availableTimeSlots)]
  );

  return (
    <Timeline.Item
      className={classes.timelineItem}
      key={slotStr}
      title={
        selected ? `${slotStr} is selected` :
          active ? `${slotStr} slot is available` :
            `${slotStr} is booked`
      }
      active={active || selected}
      color={selected ? 'cyan' : active ? 'teal' : 'gray'}
      lineActive={active || selected}
      lineVariant={selected ? 'dashed' : active ? "dotted" : 'solid'}
      bullet={
        selected ?
          <ActionIcon
            className={classes.timelineItemSelected}
            variant={"transparent"}
            onClick={
              () => {
                setSelected(!selected);
                handleClearedSlot(slot);
              }
            }
          >
            <IconCircleCheck />
          </ActionIcon> :
          active ?
            <ActionIcon
              className={classes.timelineItemActive}
              variant={'transparent'}
              onClick={
                () => {
                  setSelected(true);
                  handleSelectedSlot(slot);
                }
              }
            >
              <IconCircleDotted />
            </ActionIcon> :
            <ActionIcon
              disabled={!active}
              variant={"transparent"}
            >
              <IconCircleX />
            </ActionIcon>
      }
    />
  )
}
