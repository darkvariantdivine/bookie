
import React, {createContext, useState} from 'react';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import {Booking} from "@/constants";
import BOOKINGS from "@/mocks/bookingsTimeSensitive.json"

const BookingContext = createContext([]);

function BookingContextProvider({ children }) {
  const [ bookings, setBookings ] = useState(BOOKINGS);

  function retrieveBookings(): Booking[] {
    // TODO: API call to retrieve new bookings
    let bookings: Booking[] = BOOKINGS;
    setBookings(bookings);
    return bookings;
  }

  return (
    <BookingContext.Provider value={{bookings, retrieveBookings}}>
      {children}
    </BookingContext.Provider>
  )
}

export {
  BookingContext,
  BookingContextProvider,
}