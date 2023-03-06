
import React, {
  createContext,
  useEffect,
  useState
} from 'react';

import {
  IRestApiResponse,
  IRoom
} from "@/constants";
import {fetchRooms} from "@/libs/rest";

const RoomContext = createContext({} as any);

function RoomContextProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<IRoom[]>([] as any[]);
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

  useEffect(
    () => {
      retrieveRooms();
      const id: NodeJS.Timer = setInterval(async () => {await retrieveRooms()}, 300000);
      return () => clearInterval(id);
    },
    []
  );

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