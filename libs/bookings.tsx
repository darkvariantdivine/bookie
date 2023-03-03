
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {Booking, SLOT_INTERVAL} from "@/constants";

dayjs.extend(utc);

export function isDateEqual(
  date1: dayjs.Dayjs, date2: dayjs.Dayjs
): boolean {
  return date1.utc(true).isSame(date2.utc(true), 'day')
}

export function getUserBookings(
  user: string, bookings: Booking[]
): Booking[] {
  return bookings.filter(
    (booking: Booking) => {
      return booking.user === user
    }
  )
}

export function getRoomBookings(
  room: string, bookings: Booking[]
): Booking[] {
  return bookings.filter(
    (booking: Booking) => {
      return booking.room === room
    }
  )
}

export function getDateBookings(
  date: dayjs.Dayjs, bookings: Booking[]
): Booking[] {
  return bookings.filter(
    (booking: Booking) => {
      return isDateEqual(dayjs(booking.start), date)
    }
  )
}

export function getTimeSlotsFromDuration(
  date: dayjs.Dayjs, duration: number
): number[] {
  let start: number = date.utc(true).local().hour();
  if (date.utc(true).local().minute() > 0) {
    start += date.utc(true).local().minute() / 60;
  }
  let slots: number = duration / SLOT_INTERVAL
  return Array.from(Array(slots).keys()).map(
    (i: number) => {return start + (i * SLOT_INTERVAL)}
  )
}

export function getTimeline(
  bookings: Booking[], timeSlots: number[]
): number[] {
  // Assumes all bookings here are for the same room
  // and on the same day
  let takenTimeslots: number[] = bookings.flatMap(
    (booking: Booking) => {
      return getTimeSlotsFromDuration(
        dayjs(booking.start), booking.duration
      );
    }
  ).sort();
  return timeSlots.filter((slot: number) => !takenTimeslots.includes(slot))
}

export function getCurrentTimeSlots(
  date: dayjs.Dayjs, timeslots: number[]
): number[] {
  let currentDateTime: dayjs.Dayjs = dayjs().utc(true).local().second(0).millisecond(0)
  return timeslots.filter(
    (slot) => {
      return (
        date
        .hour(Math.trunc(slot))
        .minute((slot % 1) * 60)
        .isAfter(currentDateTime, 'minute')
      )
    }
  )
}

export function slotToString(slot: number) {
  return `${String(Math.trunc(slot)).padStart(2, '0')}${String((slot % 1) * 60).padStart(2, '0')}`
}
