
import {
  test,
  expect,
} from "@jest/globals";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ObjectSupport from "dayjs/plugin/objectSupport";
import localizedFormat from "dayjs/plugin/localizedFormat";

import {
  getDateBookings,
  getRoomBookings,
  getTimeline,
  getCurrentTimeSlots
} from "@/libs/bookings";
import BOOKINGS from "@/mocks/bookings.json";
import {TIMESLOTS, SLOT_INTERVAL} from "@/constants";

dayjs.extend(utc);
dayjs.extend(ObjectSupport);
dayjs.extend(localizedFormat);

beforeAll(() => {
  jest.mock('@/constants', () => ({
    ...jest.requireActual('@/constants'),
    SLOT_INTERVAL: jest.fn(() => 0.25)
  }));
})

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
    getRoomBookings('8af9ab04f6ea4d64b25358781c92e07b', BOOKINGS)
  ).toStrictEqual([
      {
        "id": "155280b4d8094e13845c91ef721e5c13",
        "user": "b4811bbb0de74ca0b6c8feb541896746",
        "room": "8af9ab04f6ea4d64b25358781c92e07b",
        "start": "2023-02-23T05:30:00Z",
        "duration": 1,
        "lastModified": "2023-02-23T05:04:29Z"
      },
      {
        "id": "daf66c6b9f2e4c83bfa5545f67785fb0",
        "user": "b4811bbb0de74ca0b6c8feb541896746",
        "room": "8af9ab04f6ea4d64b25358781c92e07b",
        "start": "2023-02-23T07:30:00Z",
        "duration": 0.5,
        "lastModified": "2023-02-23T05:04:29Z"
      },
      {
        "id": "9b4204913a604f90a2ddecc5c9a4b1a0",
        "user": "b4811bbb0de74ca0b6c8feb541896746",
        "room": "8af9ab04f6ea4d64b25358781c92e07b",
        "start": "2023-02-23T09:00:00Z",
        "duration": 1,
        "lastModified": "2023-02-23T05:04:29Z"
      },
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
      "id": "b5d40005bdde463483949c6302e30137",
      "user": "b4811bbb0de74ca0b6c8feb541896746",
      "room": "7e1ad2e0a6d04be797176dd1bcdfc729",
      "start": "2023-02-25T09:00:00Z",
      "duration": 1,
      "lastModified": "2023-02-24T05:04:29Z"
    }
  ]);
  expect(getDateBookings(dayjs.utc({y: 2023, M: 1, d: 23}), BOOKINGS)).toStrictEqual([
    {
      "id": "155280b4d8094e13845c91ef721e5c13",
      "user": "b4811bbb0de74ca0b6c8feb541896746",
      "room": "8af9ab04f6ea4d64b25358781c92e07b",
      "start": "2023-02-23T05:30:00Z",
      "duration": 1,
      "lastModified": "2023-02-23T05:04:29Z"
    },
    {
      "id": "a4e3a8661b4144deab8d8c88c1a1760c",
      "user": "b4811bbb0de74ca0b6c8feb541896746",
      "room": "7e1ad2e0a6d04be797176dd1bcdfc729",
      "start": "2023-02-23T05:30:00Z",
      "duration": 1.5,
      "lastModified": "2023-02-23T05:04:29Z"
    },
    {
      "id": "daf66c6b9f2e4c83bfa5545f67785fb0",
      "user": "b4811bbb0de74ca0b6c8feb541896746",
      "room": "8af9ab04f6ea4d64b25358781c92e07b",
      "start": "2023-02-23T07:30:00Z",
      "duration": 0.5,
      "lastModified": "2023-02-23T05:04:29Z"
    },
    {
      "id": "9b4204913a604f90a2ddecc5c9a4b1a0",
      "user": "b4811bbb0de74ca0b6c8feb541896746",
      "room": "8af9ab04f6ea4d64b25358781c92e07b",
      "start": "2023-02-23T09:00:00Z",
      "duration": 1,
      "lastModified": "2023-02-23T05:04:29Z"
    },
  ]);
});

test('No bookings, all timeslots available', () => {
  expect(getTimeline([], TIMESLOTS)).toStrictEqual(TIMESLOTS);
});

test('Quarterly timeslots with bookings removed', async () => {
  let bookings = [...BOOKINGS]
  bookings.splice(1, 1)
  bookings.splice(3, 1)
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
  expect(getTimeline(bookings, timeslots)).toStrictEqual([
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
});

test('Quarterly timeslots with more bookings removed', async () => {
  let bookings = [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f66",
      "start": "2023-03-02T20:30:00Z",
      "duration": 1,
      "lastModified": "2023-02-24T05:04:29Z"
    },
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f68",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f66",
      "start": "2023-03-02T22:30:00Z",
      "duration": 0.5,
      "lastModified": "2023-02-24T05:04:29Z"
    },
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f69",
      "user": "3fa85f64-5717-4562-b3fc-2c963f66",
      "room": "3fa85f64-5717-4562-b3fc-2c963f66",
      "start": "2023-03-03T00:00:00Z",
      "duration": 1,
      "lastModified": "2023-02-24T05:04:29Z"
    },
  ]
  let timeslots = [
    2.5,
    2.75,
    3,
    3.25,
    3.5,
    3.75,
    4,
    4.25,
    4.5,
    4.75,
    5,
    5.25,
    5.5,
    5.75,
    6,
    6.25,
    6.5,
    6.75,
    7,
    7.25,
    7.5,
    7.75,
    8,
    8.25,
    8.5,
    8.75,
    9,
    9.25,
    9.5,
    9.75,
    10,
    10.25,
    10.5,
    10.75,
    11,
    11.25,
    11.5,
    11.75,
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
    17.5,
    17.75,
    18,
    18.25,
    18.5,
    18.75,
    19,
    19.25,
    19.5,
    19.75,
    20,
    20.25,
    20.5,
    20.75,
    21,
    21.25,
    21.5,
    21.75,
    22,
    22.25,
    22.5,
    22.75,
    23,
    23.25,
    23.5,
    23.75
  ];
  expect(getTimeline(bookings, timeslots)).toStrictEqual([
    2.5,
    2.75,
    3,
    3.25,
    3.5,
    3.75,
    4,
    4.25,
    5.5,
    5.75,
    6,
    6.25,
    7,
    7.25,
    7.5,
    7.75,
    9,
    9.25,
    9.5,
    9.75,
    10,
    10.25,
    10.5,
    10.75,
    11,
    11.25,
    11.5,
    11.75,
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
    17.5,
    17.75,
    18,
    18.25,
    18.5,
    18.75,
    19,
    19.25,
    19.5,
    19.75,
    20,
    20.25,
    20.5,
    20.75,
    21,
    21.25,
    21.5,
    21.75,
    22,
    22.25,
    22.5,
    22.75,
    23,
    23.25,
    23.5,
    23.75
  ]);
});

describe.skip('Changing slot intervals', () => {
  beforeEach( async () => {
    console.log(typeof SLOT_INTERVAL)
    SLOT_INTERVAL.mockReturnValue(0.5)
  })

  test('Timeslots available with bookings removed', () => {
    let bookings = [ ...BOOKINGS];
    bookings.splice(1, 1);
    expect(getTimeline(bookings, TIMESLOTS)).toStrictEqual([
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

  beforeEach( async () => {
    SLOT_INTERVAL.mockReturnValue(0.25)
  })
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
});