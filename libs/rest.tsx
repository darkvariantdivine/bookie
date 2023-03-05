
import axios, {Axios} from 'axios';
import * as qs from 'qs';
import {
  IBooking,
  IRestApiError,
  IRestApiResponse,
  IRoom,
  IUser,
  IUserAuth,
  HOST,
} from "@/constants";

const API: Axios = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
  }
})

class RestApiError extends Error implements IRestApiError {
  message!: string;
  code: number;
  request?: {[prop: string]: any};
  details?: {[prop: string]: any};

  constructor(
    message: string,
    code: number,
    request?: {[prop: string]: any},
    details?: {[prop: string]: any},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.request = request;
    this.details = details;
  }
}

export { API, RestApiError };

export async function loginUser(
  auth: IUserAuth
): Promise<IRestApiResponse> {
  try {
    const {data, status, headers} = await API.post<IRestApiError>(
      "/login", auth,
    );

    let token: string = headers!.getAuthorization().split(' ')[1];
    console.log(`Retrieved token ${token}`);
    return {
      data: {'token': token, 'user': data},
      'status': status
    };

  } catch (error) {
    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}


export async function logoutUser(
  token: string
): Promise<IRestApiResponse> {
  try {
    const {status} = await API.delete<IRestApiError>(
      "/login",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(`Successfully logged out user`);
    return {
      data: null,
      'status': status
    };

  } catch (error) {
    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function fetchUser(
  user: string
): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.get<IUser | IRestApiError>(
      `/users/${user}`
    );

    console.log(`Retrieved user ${JSON.stringify(data)}`);
    return {
      data: data,
      'status': status
    };

  } catch (error) {
    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function fetchRooms(): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.get<IRoom[] | IRestApiError>("/rooms");

    console.log(`Retrieved rooms ${JSON.stringify(data)}`);
    return {
      data: data,
      'status': status
    };

  } catch (error) {

    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function fetchRoom(
  room: string
): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.get<IRoom[] | IRestApiError>(
      `/rooms/${room}`
    );

    console.log(`Retrieved room ${JSON.stringify(data)}`);
    return {
      data: data,
      'status': status
    };

  } catch (error) {

    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function fetchBookings(): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.get<IBooking[] | IRestApiError>("/bookings");

    console.log(`Retrieved bookings ${JSON.stringify(data)}`);
    return {
      data: data,
      'status': status
    };

  } catch (error) {

    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function createBooking(
  booking: IBooking,
  token: string
): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.post<{ [id: string]: string } | IRestApiError>(
      "/bookings", booking,
      {
        'headers': {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(`Created booking ${JSON.stringify(data)}`);
    return {
      data: data,
      'status': status
    };

  } catch (error) {

    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function updateBooking(
  booking_id: string,
  booking: {
    start?: string;
    duration?: number;
  },
  token: string
): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.put<undefined | IRestApiError>(
      `/bookings/${booking_id}`,
      booking,
      {
        'headers': {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(`Updated booking ${JSON.stringify(booking)}`);
    return {
      'data': null,
      'status': status
    };

  } catch (error) {

    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}

export async function deleteBookings(
  bookings: string[],
  token: string
): Promise<IRestApiResponse> {
  try {
    const {data, status} = await API.delete<undefined | IRestApiError>(
      "/bookings",
      {
        params: bookings,
        paramsSerializer: {
          encode: (params: string[]) => {
            return qs.stringify({'booking': params}, {arrayFormat: 'repeat'});
          }
        },
        'headers': {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(`Deleted bookings ${JSON.stringify(bookings)}`);
    return {
      'data': null,
      'status': status
    };

  } catch (error) {

    console.log(error);
    if (
      axios.isAxiosError(error) &&
      'code' in error.response!.data &&
      'message' in error.response!.data
    ) {
      throw new RestApiError(
        error.response!.data.message,
        error.response!.data.code,
        error.response!.data.request,
        error.response!.data.details
      );
    } else {
      throw new RestApiError(
        error!.toString(),
        500
      );
    }
  }
}