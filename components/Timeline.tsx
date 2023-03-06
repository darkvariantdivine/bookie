
import React, {
  useContext,
} from "react";
import {
  createStyles,
  Timeline
} from "@mantine/core";

import {TIMESLOTS} from "@/constants";
import {slotToString} from "@/libs/bookings";
import {BookingContext} from "@/contexts/BookingContext";
import BookieTimelineItem from "@/components/TimelineItem";

const useStyles = createStyles((theme, _params, getRef) => ({

  timeline: {
    display: "table",
  },
}));

export function BookieTimeline() {
  const { classes } = useStyles();

  const {timeSlots} = useContext(BookingContext);

  return (
    <Timeline
      className={classes.timeline}
    >
      {
        TIMESLOTS
          .filter((slot: number) => {return timeSlots.includes(slot)})
          .map(
            (slot: number) => {
              let slotStr: string = slotToString(slot)
              return <BookieTimelineItem key={slotStr} slot={slot} slotStr={slotStr} />
            }
          )
      }
    </Timeline>
  );
}