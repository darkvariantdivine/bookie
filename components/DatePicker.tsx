import React from "react";
import {DatePicker} from "@mantine/dates";
import {IconCalendar} from "@tabler/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface BookieDatePickerProps {
  selectedDate: dayjs.Dayjs
  updateDateChanges: (date: Date | dayjs.Dayjs) => void
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

