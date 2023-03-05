
import axios from 'axios';
import * as qs from 'qs';
import {
  Booking,
  RestApiError,
  RestApiResponse,
  Room,
  User,
  UserAuth,
  HOST,
} from "@/constants";

export async function loginUser(
  auth: UserAuth
): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status, headers} = await axios.post<RestApiError>(
      `${HOST}/login`, auth,
      {
        'headers': {
          'Content-Type': 'application/json'
        }
      }
    );

    if (200 <= status && status < 300) {
      let token: string = headers['Authorization'].split(' ')[1];
      console.log(`Retrieved token ${token}`);
      response = {
        data: {'token': token},
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}


export async function logoutUser(
  token: string
): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status, headers} = await axios.delete<RestApiError>(
      `${HOST}/login`,
      {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Successfully logged out user`);
      response = {
        data: {'token': token},
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}

export async function fetchUser(
  user: string
): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status} = await axios.get<User | RestApiError>(
      `${HOST}/users/${user}`,
      {
        'headers': {
          'Content-Type': 'application/json'
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Retrieved user ${JSON.stringify(data)}`);
      response = {
        data: data,
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}

export async function fetchRooms(): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status} = await axios.get<Room[] | RestApiError>(
      `${HOST}/rooms`,
      {
        'headers': {
          'Content-Type': 'application/json'
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Retrieved rooms ${JSON.stringify(data)}`);
      response = {
        data: data,
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}

export async function fetchBookings(): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status} = await axios.get<Booking[] | RestApiError>(
      `${HOST}/bookings`,
      {
        'headers': {
          'Content-Type': 'application/json'
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Retrieved bookings ${JSON.stringify(data)}`);
      response = {
        data: data,
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}

export async function createBooking(
  booking: Booking,
  token: string
): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status} = await axios.post<{ [id: string]: string } | RestApiError>(
      `${HOST}/bookings`, booking,
      {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Created booking ${JSON.stringify(data)}`);
      response = {
        data: data,
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
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
): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status} = await axios.put<undefined | RestApiError>(
      `${HOST}/bookings/${booking_id}`,
      booking,
      {
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Updated booking ${JSON.stringify(booking)}`);
      response = {
        'data': null,
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}

export async function deleteBookings(
  bookings: string[],
  token: string
): Promise<RestApiResponse> {
  let response: RestApiResponse;
  try {
    const {data, status} = await axios.delete<undefined | RestApiError>(
      `${HOST}/bookings`,
      {
        params: bookings,
        paramsSerializer: {
          encode: (params: string[]) => {
            return qs.stringify({'booking': params}, {arrayFormat: 'repeat'});
          }
        },
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (200 <= status && status < 300) {
      console.log(`Deleted bookings ${JSON.stringify(bookings)}`);
      response = {
        'data': null,
        'status': status
      };
    } else {
      response = {
        data: data,
        'status': status
      };
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return {
        data: {
          code: error.code,
          message: error.message
        },
        status: 500
      };
    } else {
      console.log(error);
      return {
        data: error,
        status: 500
      };
    }
  }
}