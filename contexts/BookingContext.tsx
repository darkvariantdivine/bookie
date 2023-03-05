
import React, {
  createContext,
  useEffect,
  useState
} from 'react';
import dayjs from "dayjs";

import {IBooking, IRestApiResponse, TIMESLOTS} from "@/constants";
import {
  getCurrentTimeSlots,
  getDateBookings,
  getTimeline
} from "@/libs/bookings";
import {fetchBookings} from "@/libs/rest";

const BookingContext = createContext([]);

function BookingContextProvider({ children }) {
  const [ bookings, setBookings ] = useState<IBooking[]>([]);

  const [ selectedDate, setDate ] = useState<dayjs.Dayjs | undefined>(dayjs());
  const [ currentBookings, setCurrentBookings ] = useState<IBooking[]>(getDateBookings(selectedDate, bookings));

  const [ timeSlots, setTimeSlots ] = useState<number[]>(getCurrentTimeSlots(selectedDate, TIMESLOTS));
  const [ availableTimeSlots, setAvailableTimeSlots ] = useState<number[]>(getTimeline(currentBookings, timeSlots));
  const [ selectedTimeSlots, setSelectedTimeSlots ] = useState<number[]>([]);

  const [ duration, setDuration ] = useState<[Date | null, Date | null]>([null, null]);

  const retrieveBookings = async () => {
    let data: IRestApiResponse = await fetchBookings();
    if (data.status < 300) {
      setBookings(data['data']);
    }
    return data['data'];
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