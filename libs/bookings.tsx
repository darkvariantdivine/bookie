
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {IBooking, SLOT_INTERVAL} from "@/constants";

dayjs.extend(utc);

export function isDateEqual(
  date1: dayjs.Dayjs, date2: dayjs.Dayjs
): boolean {
  return date1.utc().local().isSame(date2.utc().local(), 'day');
}

export function getUserBookings(
  user: string, bookings: IBooking[]
): IBooking[] {
  return bookings.filter(
    (booking: IBooking) => {
      return booking.user === user;
    }
  );
}

export function getRoomBookings(
  room: string, bookings: IBooking[]
): IBooking[] {
  return bookings.filter(
    (booking: IBooking) => {
      return booking.room === room;
    }
  );
}

export function getDateBookings(
  date: dayjs.Dayjs, bookings: IBooking[]
): IBooking[] {
  return bookings.filter(
    (booking: IBooking) => {
      return isDateEqual(dayjs(booking.start), date)
    }
  )
}

export function getTimeSlotsFromDuration(
  date: dayjs.Dayjs, duration: number
): number[] {
  let start: number = date.utc().local().hour();
  if (date.utc().local().minute() > 0) {
    start += date.utc().local().minute() / 60;
  }
  let slots: number = Math.floor(duration / SLOT_INTERVAL);
  return Array.from(Array(slots).keys()).map(
    (i: number) => {return start + (i * SLOT_INTERVAL)}
  );
}

export function getTimeline(
  bookings: IBooking[], timeSlots: number[]
): number[] {
  // Assumes all bookings here are for the same room
  // and on the same day
  let takenTimeslots: number[] = bookings.flatMap(
    (booking: IBooking) => {
      return getTimeSlotsFromDuration(
        dayjs(booking.start).utc().local(), booking.duration
      );
    }
  ).sort();
  return timeSlots.filter((slot: number) => !takenTimeslots.includes(slot))
}

export function getCurrentTimeSlots(
  date: dayjs.Dayjs, timeslots: number[]
): number[] {
  let currentDateTime: dayjs.Dayjs = dayjs.utc().local().second(0).millisecond(0)
  return timeslots.filter(
    (slot) => {
      return (
        date
        .hour(Math.trunc(slot))
        .minute((slot % 1) * 60)
        .isAfter(currentDateTime, 'minute')
      );
    }
  );
}

export function slotToString(slot: number) {
  return `${String(Math.trunc(slot)).padStart(2, '0')}${String((slot % 1) * 60).padStart(2, '0')}`;
}
