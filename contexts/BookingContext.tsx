
import React, {
  createContext,
  useState
} from 'react';
import dayjs from "dayjs";

import {
  IBooking,
  TIMESLOTS
} from "@/constants";
import {
  getCurrentTimeSlots,
  getTimeline
} from "@/libs/bookings";

const BookingContext = createContext({} as any);

function BookingContextProvider({ children }: { children: React.ReactNode }) {
  const [ bookings, setBookings ] = useState<IBooking[]>([] as any[]);

  const [ selectedDate, setDate ] = useState<dayjs.Dayjs>(dayjs());
  const [ currentBookings, setCurrentBookings ] = useState<IBooking[]>([] as any[]);

  const [ timeSlots, setTimeSlots ] = useState<number[]>(getCurrentTimeSlots(selectedDate, TIMESLOTS));
  const [ availableTimeSlots, setAvailableTimeSlots ] = useState<number[]>(getTimeline(currentBookings, timeSlots));
  const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<number[]>([] as any[]);

  let start: Date = new Date();
  let end: Date = new Date();
  end.setHours(start.getHours() + 1)
  const [ duration, setDuration ] = useState<[Date, Date]>([start, end]);

  return (
    <BookingContext.Provider value={{
      bookings, setBookings,
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