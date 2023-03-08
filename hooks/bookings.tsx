import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";
import {
  AxiosError,
  AxiosResponse
} from "axios";

import {IBooking} from "@/constants";
import {API} from "@/libs/rest";
import handleApiError from "@/hooks/errors";

export const useBookings = (
  handleBookingChanges?: (bookings: IBooking[]) => void,
  refetchInterval: number = 30000
): UseQueryResult<IBooking[], AxiosError> => {
  return useQuery<IBooking[], AxiosError>(
    ['bookings'],
    () => API.get(`/bookings`).then(
      (response: AxiosResponse) => response.data),
    {
      onSuccess: (data: IBooking[]) => {
        console.log(`Successfully retrieved bookings ${JSON.stringify(data)}`)
        if (handleBookingChanges) handleBookingChanges(data);
      },
      onError: (error: AxiosError) => handleApiError(error),
      refetchInterval: refetchInterval,
      refetchIntervalInBackground: true
    }
  )
}

interface UpdateBookingProps {
  booking_id: string;
  updates: { start?: string, duration?: number };
  token: string;
}

export const useUpdateBooking = (): UseMutationResult<null, AxiosError, UpdateBookingProps> => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({booking_id, updates, token}: UpdateBookingProps) => API.put(
      `/bookings/${booking_id}`,
      updates,
      {headers: {Authorization: `Bearer ${token}`}}
    ).then(() => null),
    onSuccess: async (_, variables: UpdateBookingProps) => {
      console.log(
        `Successfully updated booking ${variables.booking_id} 
        with data ${JSON.stringify(variables.updates)}`
      );
      await queryClient.invalidateQueries(['bookings']);
    },
    onError: (error: AxiosError) => handleApiError(error)
  })
}

interface DeleteBookingProps {
  bookings: string[];
  token: string;
}

export const useDeleteBookings = (): UseMutationResult<null, AxiosError, DeleteBookingProps> => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({bookings, token}: DeleteBookingProps) => API.delete(
      `/bookings`,
      {
        headers: {Authorization: `Bearer ${token}`},
        params: {booking: bookings},
        paramsSerializer: {indexes: null}
      }
    ).then(() => null),
    onSuccess: async (_, variables) => {
      console.log(`Successfully deleted bookings ${JSON.stringify(variables.bookings)}`);
      await queryClient.invalidateQueries(['bookings']);
    },
    onError: (error: AxiosError) => handleApiError(error)
  })
}