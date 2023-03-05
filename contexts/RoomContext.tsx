
import React, {
  createContext,
  useState
} from 'react';

import ROOMS from "@/mocks/rooms.json"
import {RestApiResponse, Room} from "@/constants";
import {fetchRooms} from "@/libs/rest";

const RoomContext = createContext([]);

function RoomContextProvider({ children }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsMap, setRoomsMap] = useState<{[id: string]: Room}>(
    generateRoomsMap(rooms)
  );

  function generateRoomsMap(toUpdate: Room[]): {[id: string]: Room} {
    return Object.fromEntries(toUpdate.map((item: Room) => [item.id, item]))
  }

  const retrieveRooms = async () => {
    let data: RestApiResponse = await fetchRooms();
    if (data.status < 300) {
      setRooms(data['data']);
      setRoomsMap(generateRoomsMap(data['data']));
    }
  }

  return (
    <RoomContext.Provider value={{
      rooms, roomsMap, retrieveRooms,
    }}>
      {children}
    </RoomContext.Provider>
  )
}

export {
  RoomContext,
  RoomContextProvider,
}