
interface UserAuth {
  username: string
  password: string
}

interface RestApiError {
  code: number;
  message: string;
  request?: {[prop: string]: any};
  details?: {[prop: string]: any};
}

interface RestApiResponse {
  data: RestApiError | any;
  status: number;
}

interface User {
  id: string;
  name: string;
  image: string;
  description: string;
  rooms: string[];
}

interface Tab {
  label: string;
  link: string;
  requireSignIn: boolean;
}

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  images: string[];
}

interface Booking {
  id?: string;
  user?: string;
  room: string;
  start: string;
  duration: number;
  lastModified?: string;
}

interface UserBooking {
  id: string;
  user: string;
  room: Room;
  start: string;
  duration: number;
  lastModified: string;
}

const TABS: Tab[] = [
  {label: 'Home', link: '/', requireSignIn: false},
  {label: 'Rooms', link: '/rooms', requireSignIn: false},
  {label: 'My Bookings', link: '/bookings', requireSignIn: true}
]

const PASSWORD_REQS: { req: RegExp, label: string }[] = [
  {req: /[0-9]/, label: "Includes number"},
  {req: /[A-Z]/, label: "Includes uppercase letter"},
  {req: /[a-z]/, label: "Includes lowercase letter"},
  {req: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special character"},
]

const SLOT_INTERVAL: number = process.env.NEXT_PUBLIC_SLOT_INTERVAL ?
  Number(process.env.NEXT_PUBLIC_SLOT_INTERVAL) :
  0.5

const HOST: string = process.env.NEXT_PUBLIC_SERVER ?
  process.env.NEXT_PUBLIC_SERVER : 'http://localhost:20000/v1.0'

const TIMESLOTS: number[] = Array(
  24 / SLOT_INTERVAL
).fill(0).map(
  (_, i: number) => i * SLOT_INTERVAL
)

export {
  type UserAuth,
  type RestApiError,
  type RestApiResponse,
  type User,
  type Tab,
  type Room,
  type Booking,
  type UserBooking,
  TABS,
  PASSWORD_REQS,
  SLOT_INTERVAL,
  HOST,
  TIMESLOTS
}