
import {getDateBookings, getRoomBookings, getTimeline, getCurrentTimeSlots} from "@/libs/bookings";
import BOOKINGS from "@/mocks/bookings.json"
import {
  test,
  expect,
} from "@jest/globals";
import {SLOT_INTERVAL, TIMESLOTS} from "@/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ObjectSupport from "dayjs/plugin/objectSupport";

dayjs.extend(utc);
dayjs.extend(ObjectSupport);

test('Empty bookings and room', () => {
  expect(getRoomBookings("", [])).toStrictEqual([]);
});

test('Empty room', () => {
  expect(getRoomBookings("", BOOKINGS)).toStrictEqual([]);
});

test('No bookings for room', () => {
  expect(getRoomBookings('abcdef', BOOKINGS)).toStrictEqual([]);
});

test('Room has bookings', () => {
  expect(
    getRoomBookings('3fa85f64-5717-4562-b3fc-2c963f66', BOOKINGS)
  ).toStrictEqual([
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66",
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "room": "3fa85f64-5717-4562-b3fc-2c963f66",
        "start": "2023-02-23T05:30:00Z",
        "duration": 1,
        "lastModified": {
          "user": "3fa85f64-5717-4562-b3fc-2c963f66",
          "timestamp": "2023-02-23T05:04:29Z"
        }
      },
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f68",
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "room": "3fa85f64-5717-4562-b3fc-2c963f66",
        "start": "2023-02-23T07:30:00Z",
        "duration": 0.5,
        "lastModified": {
          "user": "3fa85f64-5717-4562-b3fc-2c963f66",
          "timestamp": "2023-02-23T05:04:29Z"
        }
      },
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f69",
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "room": "3fa85f64-5717-4562-b3fc-2c963f66",
        "start": "2023-02-23T09:00:00Z",
        "duration": 1,
        "lastModified": {
          "user": "3fa85f64-5717-4562-b3fc-2c963f66",
          "timestamp": "2023-02-23T05:04:29Z"
        }
      }
    ]
  );
});

test('No bookings', () => {
  expect(getDateBookings(dayjs.utc({y: 2023, M: 1, d: 24}), [])).toStrictEqual([]);
});

test('No bookings on date', () => {
  expect(getDateBookings(dayjs.utc({y: 2023, M: 1, d: 26}), BOOKINGS)).toStrictEqual([]);
});

test('Bookings on selected date', () => {
  expect(getDateBookings(dayjs.utc({y: 2023, M: 1, d: 25}), BOOKINGS)).toStrictEqual([
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f69",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f67",
      "start": "2023-02-25T09:00:00Z",
      "duration": 1,
      "lastModified": {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "timestamp": "2023-02-24T05:04:29Z"
      }
    }
  ]);
  expect(getDateBookings(dayjs.utc({y: 2023, M: 1, d: 23}), BOOKINGS)).toStrictEqual([
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f66",
      "start": "2023-02-23T05:30:00Z",
      "duration": 1,
      "lastModified": {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "timestamp": "2023-02-23T05:04:29Z"
      }
    },
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f67",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f67",
      "start": "2023-02-23T05:30:00Z",
      "duration": 1.5,
      "lastModified": {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "timestamp": "2023-02-23T05:04:29Z"
      }
    },
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f68",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f66",
      "start": "2023-02-23T07:30:00Z",
      "duration": 0.5,
      "lastModified": {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "timestamp": "2023-02-23T05:04:29Z"
      }
    },
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f69",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f66",
      "start": "2023-02-23T09:00:00Z",
      "duration": 1,
      "lastModified": {
        "user": "3fa85f64-5717-4562-b3fc-2c963f66",
        "timestamp": "2023-02-23T05:04:29Z"
      }
    }
  ]);
});

test('No bookings, all timeslots available', () => {
  expect(getTimeline([], TIMESLOTS)).toStrictEqual(TIMESLOTS);
});

test('Timeslots available with bookings removed', () => {
  BOOKINGS.splice(1, 1)
  expect(getTimeline(BOOKINGS, TIMESLOTS)).toStrictEqual([
    0,
    0.5,
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.5,
    6,
    6.5,
    7,
    7.5,
    8,
    8.5,
    9,
    9.5,
    10,
    10.5,
    11,
    11.5,
    12,
    12.5,
    13,
    14.5,
    15,
    16,
    16.5,
    18,
    18.5,
    19,
    19.5,
    20,
    20.5,
    21,
    21.5,
    22,
    22.5,
    23,
    23.5
  ]);
});

test('Quarterly timeslots with bookings removed', async () => {
  const constants = await import("@/constants");
  constants.SLOT_INTERVAL = 0.25;
  BOOKINGS.splice(1, 1)
  let timeslots = [
    12,
    12.25,
    12.5,
    12.75,
    13,
    13.25,
    13.5,
    13.75,
    14,
    14.25,
    14.5,
    14.75,
    15,
    15.25,
    15.5,
    15.75,
    16,
    16.25,
    16.5,
    16.75,
    17,
    17.25,
    17.50,
    17.75,
    18,
    18.25,
    18.5,
    18.75
  ];
  expect(getTimeline(BOOKINGS, timeslots)).toStrictEqual([
    12,
    12.25,
    12.5,
    12.75,
    13,
    13.25,
    14.5,
    14.75,
    15,
    15.25,
    16,
    16.25,
    16.5,
    16.75,
    18,
    18.25,
    18.5,
    18.75
  ]);
  constants.SLOT_INTERVAL = 0.5;
});

test('No timeslots available', () => {
  expect(getCurrentTimeSlots(dayjs.utc().local(), [])).toStrictEqual([]);
});

test('Timeslots with time not lapsed', () => {
  let timeslots = [
    0,  0.5,    1,  1.5,    2,  2.5,    3,  3.5,
    4,  4.5,    5,  5.5,    6,  6.5,    7,  7.5,
    8,  8.5,    9,  9.5,   10, 10.5,   11, 11.5,
    12, 12.5,   13, 14.5,   15,   16, 16.5,   18,
    18.5,   19, 19.5,   20, 20.5,   21, 21.5,   22,
    22.5,   23, 23.5
  ];
  expect(getCurrentTimeSlots(dayjs.utc().add(1, 'day').local(), timeslots)).toStrictEqual(timeslots);
});

test('Timeslots with time entirely lapsed', () => {
  let timeslots = [
    0,  0.5,    1,  1.5,    2,  2.5,    3,  3.5,
    4,  4.5,    5,  5.5,    6,  6.5,    7,  7.5,
    8,  8.5,    9,  9.5,   10, 10.5,   11, 11.5,
    12, 12.5,   13, 14.5,   15,   16, 16.5,   18,
    18.5,   19, 19.5,   20, 20.5,   21, 21.5,   22,
    22.5,   23, 23.5
  ];
  expect(getCurrentTimeSlots(dayjs.utc().subtract(1, 'day').local(), timeslots)).toStrictEqual([]);
});

test('Timeslots with time partially lapsed', () => {
  let timeslots = [
    0,  0.5,    1,  1.5,    2,  2.5,    3,  3.5,
    4,  4.5,    5,  5.5,    6,  6.5,    7,  7.5,
    8,  8.5,    9,  9.5,   10, 10.5,   11, 11.5,
    12, 12.5,   13, 14.5,   15,   16, 16.5,   18,
    18.5,   19, 19.5,   20, 20.5,   21, 21.5,   22,
    22.5,   23, 23.5
  ];
  expect(getCurrentTimeSlots(dayjs.utc().local(), timeslots).length).toBeGreaterThanOrEqual(1);
});

test('Quarterly timeslots with time not lapsed', async () => {
  const constants = await import("@/constants");
  constants.SLOT_INTERVAL = 0.25;
  let timeslots = [
    0,  0.25,   0.5,  0.75,     1,  1.25,   1.5,  1.75,     2,
    2.25,   2.5,  2.75,     3,  3.25,   3.5,  3.75,     4,  4.25,
    4.5,  4.75,     5,  5.25,   5.5,  5.75,     6,  6.25,   6.5,
    6.75,     7,  7.25,   7.5,  7.75,     8,  8.25,   8.5,  8.75,
    9,  9.25,   9.5,  9.75,    10, 10.25,  10.5, 10.75,    11,
    11.25,  11.5, 11.75,    12, 12.25,  12.5, 12.75,    13, 13.25,
    13.5, 13.75,    14, 14.25,  14.5, 14.75,    15, 15.25,  15.5,
    15.75,    16, 16.25,  16.5, 16.75,    17, 17.25,  17.5, 17.75,
    18, 18.25,  18.5, 18.75,    19, 19.25,  19.5, 19.75,    20,
    20.25,  20.5, 20.75,    21, 21.25,  21.5, 21.75,    22, 22.25,
    22.5, 22.75,    23, 23.25,  23.5, 23.75
  ];
  expect(getCurrentTimeSlots(dayjs.utc().add(1, 'day').local(), timeslots)).toStrictEqual(timeslots);
  constants.SLOT_INTERVAL = 0.5;
});