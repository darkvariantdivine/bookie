
import React, {
  createContext,
  useEffect,
  useState
} from 'react';
import dayjs from "dayjs";

import {Booking, TIMESLOTS} from "@/constants";
import BOOKINGS from "@/mocks/bookingsTimeSensitive.json"
import {
  getCurrentTimeSlots,
  getDateBookings,
  getTimeline
} from "@/libs/bookings";

const BookingContext = createContext([]);

function BookingContextProvider({ children }) {
  const [ bookings, setBookings ] = useState<Booking[]>(BOOKINGS);

  const [ selectedDate, setDate ] = useState<dayjs.Dayjs | undefined>(dayjs());
  const [ currentBookings, setCurrentBookings ] = useState<Booking[]>(getDateBookings(selectedDate, bookings));

  const [ timeSlots, setTimeSlots ] = useState<number[]>(getCurrentTimeSlots(selectedDate, TIMESLOTS));
  const [ availableTimeSlots, setAvailableTimeSlots ] = useState<number[]>(getTimeline(currentBookings, timeSlots));
  const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<number[]>([]);

  const [ duration, setDuration ] = useState<[Date | null, Date | null]>([null, null]);

  function retrieveBookings(): Booking[] {
    // TODO: API call to retrieve new bookings
    let bookings: Booking[] = BOOKINGS;
    setBookings(bookings);
    return bookings;
  }

  return (
    <BookingContext.Provider value={{
      bookings, setBookings, retrieveBookings,
      selectedDate, setDate,
      currentBookings, setCurrentBookings,
      timeSlots, setTimeSlots,
      availableTimeSlots, setAvailableTimeSlots,
      selectedTimeSlots, setSelectedTimeSlots,
      duration, setDuration
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export {
  BookingContext,
  BookingContextProvider,
}