import {useQuery} from "@tanstack/react-query";
import {
  AxiosError,
  AxiosResponse
} from "axios";
import {UseQueryResult} from "@tanstack/react-query";

import {API} from "@/libs/rest";
import handleApiError from "@/hooks/errors";
import {IRoom} from "@/constants";

export const useRooms = (): UseQueryResult<IRoom[], AxiosError> => {
  return useQuery<IRoom[], AxiosError>(
    ['rooms'],
    () => API.get(`/rooms`).then(
      (response: AxiosResponse) => response.data),
    {
      onSuccess: (data: IRoom[]) =>
        console.log(`Successfully retrieved rooms ${JSON.stringify(data)}`),
      onError: (error: AxiosError) => handleApiError(error)
    }
  )
}

export const useRoomsMap = (): UseQueryResult<{ [p: string]: IRoom }, AxiosError> => {
  return useQuery<IRoom[], AxiosError, {[p: string]: IRoom}>(
    ['rooms'],
    () => API.get(`/rooms`).then(
      (response: AxiosResponse) => response.data),
    {
      onSuccess: (data) =>
        console.log(`Successfully retrieved rooms ${JSON.stringify(data)}`),
      onError: (error: AxiosError) => handleApiError(error),
      select: (data: IRoom[]) => Object.fromEntries(
        data.map((item: IRoom) => [item.id, item])
      )
    }
  )
}

export const useRoom = (roomId: string): UseQueryResult<IRoom, AxiosError> => {
  return useQuery<IRoom, AxiosError>(
    ['room', roomId],
    () => API.get(`/rooms/${roomId}`).then(
      (response: AxiosResponse) => response.data),
    {
      onSuccess: (data: IRoom) =>
        console.log(`Successfully retrieved room ${JSON.stringify(data)}`),
      onError: (error: AxiosError) => handleApiError(error)
    }
  )
}
