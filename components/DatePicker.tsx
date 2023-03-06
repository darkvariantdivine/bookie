import React, {useContext} from "react";
import {DatePicker} from "@mantine/dates";
import {IconCalendar} from "@tabler/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {BookingContext} from "@/contexts/BookingContext";

dayjs.extend(utc);

export function BookieDatePicker() {

  const { selectedDate, setDate } = useContext(BookingContext);

  function handleDateChanges(dateToSet: Date | dayjs.Dayjs): dayjs.Dayjs {
    let newDate: dayjs.Dayjs;
    if (
      dateToSet === null ||
      dayjs(dateToSet).isSame(selectedDate, 'day')
    ) {
      newDate = dayjs();
    } else {
      newDate = dayjs(dateToSet);
    }
    setDate(newDate);
    return newDate;
  }

  return (
    <DatePicker
      label={"Select Booking Date"}
      description={"View available slots for chosen date"}
      placeholder={selectedDate.toString()}
      variant={'filled'}
      withAsterisk
      value={selectedDate}
      onChange={handleDateChanges}
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

