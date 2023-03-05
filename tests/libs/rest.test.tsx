
import {
  createBooking,
  deleteBookings,
  fetchBookings,
  fetchRooms,
  fetchUser,
  loginUser,
  logoutUser,
  updateBooking,
  API, RestApiError,
} from "@/libs/rest";
import {
  test,
  expect,
} from "@jest/globals";
import {
  IBooking,
  IRestApiError
} from "@/constants";
import USER from '@/mocks/user.json';
import ROOMS from '@/mocks/rooms.json';
import BOOKINGS from '@/mocks/bookings.json';
import {
  AxiosError,
  AxiosResponse
} from "axios";

describe("Mocking Login API calls", () => {

  test('Login user', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let testInput = {username: 'test', password: 'hello_world'};
    API.post = jest.fn();
    (API.post as jest.Mock).mockResolvedValue({
      data: USER,
      status: 204,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const output = await loginUser(testInput);
    expect(output['data']['token']).toEqual(token);
    expect(output['data']['user']).toEqual(USER);
    expect(output['status']).toEqual(204);
    expect((API.post as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.post as jest.Mock).mock.calls[0][0]).toEqual(`/login`);
    expect((API.post as jest.Mock).mock.calls[0][1]).toEqual(testInput);
  });

  test('User not authenticated', async () => {
    let mockError = {
      code: 401,
      message: 'Requesting user does not exist',
    };
    let testInput = {username: 'test', password: 'hello_world'};
    API.post = jest.fn();
    (API.post as jest.Mock).mockRejectedValue(new AxiosError(
      mockError.message,
      'test',
      undefined,
      undefined,
      {data: mockError, status: 401} as AxiosResponse
    ));

    await expect(loginUser(testInput)).rejects.toThrow(Error);
    await expect(loginUser(testInput)).rejects.toThrow('Requesting user does not exist');
    expect((API.post as jest.Mock).mock.calls[0][0]).toEqual(`/login`);
    expect((API.post as jest.Mock).mock.calls[0][1]).toEqual(testInput);
  });

  test('Logout user', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    API.delete = jest.fn();
    (API.delete as jest.Mock).mockResolvedValue({
      data: {},
      status: 204,
    });

    let output = await logoutUser(token);
    expect(output['status']).toEqual(204);
    expect((API.delete as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.delete as jest.Mock).mock.calls[0][0]).toEqual(`/login`);
    expect((API.delete as jest.Mock).mock.calls[0][1]).toEqual(
      {headers: {Authorization: `Bearer ${token}`}}
    );
  });

});

describe("Fetching data from APIs", () => {

  test('Retrieve user', async () => {
    API.get = jest.fn();
    (API.get as jest.Mock).mockResolvedValue({
      data: USER,
      status: 200
    });

    const output = await fetchUser(USER['id']);
    expect(output['data']).toEqual(USER);
    expect(output['status']).toEqual(200);
    expect((API.get as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.get as jest.Mock).mock.calls[0][0]).toEqual(`/users/${USER['id']}`);
  });

  test('Retrieve rooms', async () => {
    API.get = jest.fn();
    (API.get as jest.Mock).mockResolvedValue({
      data: ROOMS,
      status: 200
    });

    const output = await fetchRooms();
    expect(output['data']).toEqual(ROOMS);
    expect(output['status']).toEqual(200);
    expect((API.get as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.get as jest.Mock).mock.calls[0][0]).toEqual(`/rooms`);
  });

  test('Retrieve bookings', async () => {
    API.get = jest.fn();
    (API.get as jest.Mock).mockResolvedValue({
      data: BOOKINGS,
      status: 200
    });

    const output = await fetchBookings();
    expect(output['data']).toEqual(BOOKINGS);
    expect(output['status']).toEqual(200);
    expect((API.get as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.get as jest.Mock).mock.calls[0][0]).toEqual(`/bookings`);
  });

});

describe("CRUD bookings", () => {
  test('Create booking', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let { id, user, lastModified, ...booking} = BOOKINGS[0];
    API.post = jest.fn();
    (API.post as jest.Mock).mockResolvedValue({
      data: BOOKINGS[0],
      status: 201
    });

    const output = await createBooking(booking, token);
    expect(output['data']).toEqual(BOOKINGS[0]);
    expect(output['status']).toEqual(201);
    expect((API.post as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.post as jest.Mock).mock.calls[0][0]).toEqual(`/bookings`);
    expect((API.post as jest.Mock).mock.calls[0][1]).toEqual(booking);
    expect((API.post as jest.Mock).mock.calls[0][2]).toEqual(
      {headers: {Authorization: `Bearer ${token}`}}
    );
  });

  test('Create overlapping booking', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let { id, user, lastModified, ...booking} = BOOKINGS[0];
    let mockError: IRestApiError = {
      code: 400,
      message: "Booking overlaps with other Bookings",
    };
    API.post = jest.fn();
    (API.post as jest.Mock).mockRejectedValue(new AxiosError(
      mockError.message,
      'test',
      undefined,
      undefined,
      {data: mockError, status: 400} as AxiosResponse
    ));

    await expect(createBooking(booking, token)).rejects.toThrow(Error);
    await expect(createBooking(booking, token)).rejects.toThrow('Booking overlaps with other Bookings');
    expect((API.post as jest.Mock).mock.calls[0][0]).toEqual(`/bookings`);
    expect((API.post as jest.Mock).mock.calls[0][1]).toEqual(booking);
    expect((API.post as jest.Mock).mock.calls[0][2]).toEqual(
      {headers: {Authorization: `Bearer ${token}`}}
    );
  });

  test('Update booking', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let { id, start, duration, ..._} = BOOKINGS[0];
    API.put = jest.fn();
    (API.put as jest.Mock).mockResolvedValue({
      status: 204
    });

    const output = await updateBooking(id, {start: start, duration: duration}, token);
    expect(output['data']).toEqual(null);
    expect(output['status']).toEqual(204);
    expect((API.put as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.put as jest.Mock).mock.calls[0][0]).toEqual(`/bookings/${id}`);
    expect((API.put as jest.Mock).mock.calls[0][1]).toEqual({start: start, duration: duration});
    expect((API.put as jest.Mock).mock.calls[0][2]).toEqual(
      {headers: {Authorization: `Bearer ${token}`}}
    );
  });

  test('Update overlapping booking', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let { id, start, duration, ..._} = BOOKINGS[0];
    let mockError: IRestApiError = {
      code: 400,
      message: "Booking overlaps with other Bookings",
    };
    API.put = jest.fn();
    (API.put as jest.Mock).mockRejectedValue(new AxiosError(
      mockError.message,
      'test',
      undefined,
      undefined,
      {data: mockError, status: 400} as AxiosResponse
    ));


    await expect(updateBooking(id, {start: start, duration: duration}, token)).rejects.toThrow(Error);
    await expect(updateBooking(id, {start: start, duration: duration}, token)).rejects.toThrow('Booking overlaps with other Bookings');
    expect((API.put as jest.Mock).mock.calls[0][0]).toEqual(`/bookings/${id}`);
    expect((API.put as jest.Mock).mock.calls[0][1]).toEqual({start: start, duration: duration});
    expect((API.put as jest.Mock).mock.calls[0][2]).toEqual(
      {headers: {Authorization: `Bearer ${token}`}}
    );
  });

  test('Cancel bookings', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let bookings: string[] = BOOKINGS.map((booking: IBooking) => {return booking.id}) as string[];
    API.delete = jest.fn();
    (API.delete as jest.Mock).mockResolvedValue({
      status: 204
    });

    const output = await deleteBookings(bookings, token);
    expect(output['data']).toEqual(null);
    expect(output['status']).toEqual(204);
    expect((API.delete as jest.Mock).mock.calls).toHaveLength(1);
    expect((API.delete as jest.Mock).mock.calls[0][0]).toEqual(`/bookings`);
  });

  test('Unable to cancel bookings', async () => {
    let token: string = '4448fdf20043d0a8bc5d4383ebac1a64';
    let bookings: string[] = BOOKINGS.map((booking: IBooking) => {return booking.id}) as string[];
    let mockError: IRestApiError = {
      code: 500,
      message: 'Unable to delete Booking(s)'
    };
    API.delete = jest.fn();
    (API.delete as jest.Mock).mockRejectedValue(new AxiosError(
      mockError.message,
      'test',
      undefined,
      undefined,
      {data: mockError, status: 500} as AxiosResponse
    ));

    await expect(deleteBookings(bookings, token)).rejects.toThrow(Error);
    await expect(deleteBookings(bookings, token)).rejects.toThrow('Unable to delete Booking(s)');
    expect((API.delete as jest.Mock).mock.calls[0][0]).toEqual(`/bookings`);
  });

})