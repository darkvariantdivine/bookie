
interface IUserAuth {
  username: string
  password: string
}

interface IRestApiError {
  code: number;
  message: string;
  request?: {[prop: string]: any};
  details?: {[prop: string]: any};
}

interface IUser {
  id: string;
  name: string;
  image: string;
  description: string;
  rooms: string[];
}

interface ITab {
  label: string;
  link: string;
  requireSignIn: boolean;
}

interface IRoom {
  id: string;
  name: string;
  description: string;
  capacity: number;
  images: string[];
}

interface IBooking {
  id?: string;
  user?: string;
  room: string;
  start: string;
  duration: number;
  lastModified?: string;
}

const TABS: ITab[] = [
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

const TIMEZONE: string = process.env.NEXT_TIMEZONE ?
  process.env.NEXT_TIMEZONE : 'Asia/Singapore'

const TIMESLOTS: number[] = Array(
  24 / SLOT_INTERVAL
).fill(0).map(
  (_, i: number) => i * SLOT_INTERVAL
)

export {
  type IUserAuth,
  type IRestApiError,
  type IUser,
  type ITab,
  type IRoom,
  type IBooking,
  TABS,
  PASSWORD_REQS,
  SLOT_INTERVAL,
  HOST,
  TIMEZONE,
  TIMESLOTS
}