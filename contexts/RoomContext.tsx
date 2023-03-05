
import React, {
  createContext,
  useState
} from 'react';

import {IRestApiResponse, IRoom} from "@/constants";
import {fetchRooms} from "@/libs/rest";

const RoomContext = createContext([]);

function RoomContextProvider({ children }) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [roomsMap, setRoomsMap] = useState<{[id: string]: IRoom}>(
    generateRoomsMap(rooms)
  );

  function generateRoomsMap(toUpdate: IRoom[]): {[id: string]: IRoom} {
    return Object.fromEntries(toUpdate.map((item: IRoom) => [item.id, item]))
  }

  const retrieveRooms = async () => {
    let data: IRestApiResponse = await fetchRooms();
    setRooms(data['data']);
    setRoomsMap(generateRoomsMap(data['data']));
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