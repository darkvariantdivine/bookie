
import React, {
  createContext,
  useState
} from 'react';

import ROOMS from "@/mocks/rooms.json"
import {Room} from "@/constants";

const RoomContext = createContext([]);

function RoomContextProvider({ children }) {
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [roomsMap, setRoomsMap] = useState<{[id: string]: Room}>(
    Object.fromEntries(rooms.map((item: Room) => [item.id, item]))
  );

  // TODO: Fetch all room data here

  return (
    <RoomContext.Provider value={{
      rooms, roomsMap, setRooms,
    }}>
      {children}
    </RoomContext.Provider>
  )
}

export {
  RoomContext,
  RoomContextProvider,
}