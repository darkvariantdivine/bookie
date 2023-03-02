
import React, {createContext, useState} from 'react';
import ROOMS from "@/mocks/rooms.json"

const RoomContext = createContext([]);

function RoomContextProvider({ children }) {
  const [rooms, setRooms] = useState(ROOMS);
  // TODO: Fetch all room data here

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  )
}

export {
  RoomContext,
  RoomContextProvider,
}