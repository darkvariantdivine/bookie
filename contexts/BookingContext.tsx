
import React, {
  createContext,
  useEffect,
  useState
} from 'react';
import dayjs from "dayjs";

import {
  IBooking,
  IRestApiResponse,
  TIMESLOTS
} from "@/constants";
import {
  getCurrentTimeSlots,
  getDateBookings,
  getTimeline
} from "@/libs/bookings";
import {fetchBookings} from "@/libs/rest";

const BookingContext = createContext({} as any);

function BookingContextProvider({ children }: { children: React.ReactNode }) {
  const [ bookings, setBookings ] = useState<IBooking[]>([] as any[]);

  const [ selectedDate, setDate ] = useState<dayjs.Dayjs>(dayjs());
  const [ currentBookings, setCurrentBookings ] = useState<IBooking[]>(getDateBookings(selectedDate, bookings));

  const [ timeSlots, setTimeSlots ] = useState<number[]>(getCurrentTimeSlots(selectedDate, TIMESLOTS));
  const [ availableTimeSlots, setAvailableTimeSlots ] = useState<number[]>(getTimeline(currentBookings, timeSlots));
  const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<number[]>([] as any[]);

  let start: Date = new Date();
  let end: Date = new Date();
  end.setHours(start.getHours() + 1)
  const [ duration, setDuration ] = useState<[Date, Date]>([start, end]);

  const retrieveBookings = async () => {
    let data: IRestApiResponse = await fetchBookings();
    if (data.status < 300) {
      setBookings(data['data']);
    }
    return data['data'];
  }

  useEffect(
    () => {
      retrieveBookings();
      const id: NodeJS.Timer = setInterval(async () => {await retrieveBookings()}, 300000);
      return () => clearInterval(id);
    },
    []
  );


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