import json
from datetime import datetime, timezone

from logging import Logger, getLogger
from typing import Dict, List, Any

from fastapi import APIRouter, status, Depends, Query, Response
from pydantic import BaseModel, constr, validator, parse_obj_as, confloat

from bookie.app import mongo
from bookie.app.models import APIError, Booking, User
from bookie.app.utils import get_id
from bookie.constants import LOGGERS
from bookie.exceptions import BookieAPIException
from bookie.messages import ErrorMessage, Message
from bookie.openapi import OpenAPIDescriptions, OpenAPIExamples

from .auth import authenticate
from .routes import BookieRESTRoute


__all__ = ['router']


logger: Logger = getLogger(LOGGERS['api'])

router: APIRouter = APIRouter(
    route_class=BookieRESTRoute,
    prefix='/bookings',
    tags=['Bookings'],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            'description': OpenAPIDescriptions.GENERIC_401_AUTHENTICATION_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_AUTHENTICATION_ERROR_EXAMPLE
                }
            },
            'model': APIError
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            'description': OpenAPIDescriptions.GENERIC_500_INTERNAL_SERVER_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_INTERNAL_SERVER_ERROR_EXAMPLE
                }
            },
            'model': APIError
        }
    }
)


class BookingCreate(BaseModel):
    """
    Booking creation parameters

    Attributes:
        room (constr): ID of the room
        start (datetime): Starting date time of the booking
        duration (confloat): Duration of the booking in hours
    """
    room: constr(min_length=32, max_length=32)
    start: datetime
    duration: confloat(gt=0)

    @validator('start')
    def validate_start(cls, v: datetime) -> datetime:
        """
        Ensures that the date given is greater than the current time

        Args:
            v (datetime): Current time

        Returns:
            datetime: Validated datetime

        Raises:
            AssertionError: If start datetime is in the past
        """
        assert v >= datetime.now(timezone.utc), \
            ErrorMessage.API_BOOKING_EXPIRED_ERROR_MSG
        return v


class BookingUpdate(BaseModel):
    """
    Booking update parameters

    Attributes:
        start (datetime | None): Starting date time of the booking,
                                 defaults to None
        duration (confloat | None): Duration of the booking in hours,
                                    defaults to None
    """
    start: datetime | None = None
    duration: confloat(gt=0) | None = None

    @validator('start')
    def validate_start(cls, v: datetime | None) -> datetime | None:
        """
        Ensures that the date given is greater than the current time if provided

        Args:
            v (datetime | None): Current time

        Returns:
            datetime | None: Validated datetime

        Raises:
            AssertionError: If start datetime is in the past
        """
        if v:
            assert v >= datetime.now(timezone.utc), \
                ErrorMessage.API_BOOKING_EXPIRED_ERROR_MSG
        return v


@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, str],
    include_in_schema=False
)
@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, str],
    responses={
        status.HTTP_201_CREATED: {
            'description': OpenAPIDescriptions.BOOKING_POST_201_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.BOOKING_POST_EXAMPLE
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            'description': OpenAPIDescriptions.GENERIC_400_VALIDATION_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_VALIDATION_ERROR_EXAMPLE
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            'description': OpenAPIDescriptions.GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE
                }
            }
        },
    }
)
async def create_booking(
        booking_details: BookingCreate,
        user: User = Depends(authenticate)
) -> Dict[str, str]:
    """
    Creates a new booking

    Args:
        booking_details (BookingCreate): Booking details
        user (User): Authenticated user

    Returns:
        Dict[str, str]: ID of the new booking
    """
    booking: Booking = Booking(
        **booking_details.dict(),
        id=get_id(),
        user=user.id,
        last_modified=datetime.now(timezone.utc)
    )

    if not await mongo.get_room(booking.room):
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_ROOM_NOT_FOUND_ERROR_MSG,
            details={'booking': json.loads(booking_details.json(exclude_unset=True))}
        )

    room_bookings: List[Booking] = parse_obj_as(
        List[Booking],
        await mongo.get_bookings_room_date(booking.room, booking.start)
    )

    if any(booking.overlaps(b) for b in room_bookings):
        raise BookieAPIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=ErrorMessage.API_BOOKING_OVERLAPS_ERROR_MSG,
            details={'booking': json.loads(booking_details.json(exclude_unset=True))}
        )

    logger.info(Message.BOOKING_CREATE_FMT.format(booking))
    if not await mongo.insert_booking(booking.dict()):
        raise BookieAPIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=ErrorMessage.API_BOOKING_CREATE_ERROR_MSG,
            details={'booking': json.loads(booking_details.json(exclude_unset=True))}
        )

    return {"id": booking.id}


@router.get(
    '/',
    status_code=status.HTTP_200_OK,
    response_model=List[Booking],
    include_in_schema=False
)
@router.get(
    '',
    status_code=status.HTTP_200_OK,
    response_model=List[Booking],
    responses={
        status.HTTP_200_OK: {
            'description': OpenAPIDescriptions.BOOKING_GET_200_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.BOOKING_GET_EXAMPLE
                }
            }
        },
    },
)
async def get_bookings() -> List[Dict[str, Any]]:
    """
    Retrieves all bookings

    Returns:
        List[Dict[str, Any]]: Bookings retrieved
    """
    return await mongo.get_bookings()


@router.delete(
    '/',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(authenticate)],
    include_in_schema=False
)
@router.delete(
    '',
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            'description': OpenAPIDescriptions.BOOKING_POST_201_SUCCESS_DESCRIPTION,
        },
        status.HTTP_404_NOT_FOUND: {
            'description': OpenAPIDescriptions.GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE
                }
            }
        },
    },
    dependencies=[Depends(authenticate)],
)
async def delete_bookings(
        bookings: List[str] = Query([], alias='booking'),
        response: Response = Response
) -> Response:
    """
    Delets an existing set of bookings

    Args:
        bookings (List[str]): Bookings to be deleted
        response (Response): FastAPI Response

    Returns:
        Response: FastAPI Response
    """
    logger.info(Message.BOOKING_DELETE_FMT.format(bookings))
    if not await mongo.delete_bookings(bookings):
        raise BookieAPIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=ErrorMessage.API_BOOKING_DELETE_ERROR_MSG,
            details={'booking': {'id': bookings}}
        )

    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.put(
    '/{booking_id}/',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(authenticate)],
    include_in_schema=False
)
@router.put(
    '/{booking_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            'description': OpenAPIDescriptions.BOOKING_ID_PUT_204_SUCCESS_DESCRIPTION,
        },
        status.HTTP_400_BAD_REQUEST: {
            'description': OpenAPIDescriptions.GENERIC_400_VALIDATION_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_VALIDATION_ERROR_EXAMPLE
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            'description': OpenAPIDescriptions.GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE
                }
            }
        },
    },
    dependencies=[Depends(authenticate)],
)
async def update_booking(
        booking_id: str,
        booking_details: BookingUpdate,
        response: Response
) -> Response:
    """
    Updates an existing booking

    Args:
        booking_id (str): Booking ID
        booking_details (BookingUpdate): Details to update booking with
        response (Response): FastAPI Response

    Returns:
        Response: FastAPI Response
    """
    if (
            (not booking_details.dict(exclude_unset=True)) or
            (any(v is None for v in booking_details.dict(exclude_unset=True)))
    ):
        raise BookieAPIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=ErrorMessage.API_BOOKING_UPDATE_ERROR_MSG,
            details={'booking': json.loads(booking_details.json(exclude_unset=True))}
        )

    try:
        booking: Booking = Booking(**(await mongo.get_booking(booking_id)))
    except TypeError:
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_BOOKING_NOT_FOUND_ERROR_MSG,
            details={'booking': {'id': booking_id}}
        )

    if booking.start < datetime.now(timezone.utc):
        raise BookieAPIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=ErrorMessage.API_BOOKING_EXPIRED_ERROR_MSG,
            details={'booking': {'id': booking_id}}
        )

    new_booking: Booking = booking.copy(update=booking_details.dict(exclude_unset=True))
    room_bookings: List[Booking] = parse_obj_as(
        List[Booking],
        list(
            filter(
                lambda b: b['id'] != new_booking.id,
                await mongo.get_bookings_room_date(booking.room, new_booking.start)
            )
        )
    )

    if any(new_booking.overlaps(b) for b in room_bookings):
        raise BookieAPIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=ErrorMessage.API_BOOKING_OVERLAPS_ERROR_MSG,
            details={'booking': {'id': booking_id}}
        )

    logger.info(Message.BOOKING_UPDATE_FMT.format(booking_id, new_booking))
    if not await mongo.update_booking(booking_id, new_booking.dict()):
        raise BookieAPIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=ErrorMessage.API_BOOKING_UPDATE_ERROR_MSG,
            details={'booking': json.loads(booking_details.json(exclude_unset=True))}
        )

    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.get(
    '/{booking_id}/',
    status_code=status.HTTP_200_OK,
    response_model=Booking,
    include_in_schema=False
)
@router.get(
    '/{booking_id}',
    status_code=status.HTTP_200_OK,
    response_model=Booking,
    responses={
        status.HTTP_200_OK: {
            'description': OpenAPIDescriptions.BOOKING_ID_GET_200_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.BOOKING_ID_GET_EXAMPLE
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            'description': OpenAPIDescriptions.GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE
                }
            }
        },
    },
)
async def get_booking(booking_id: str) -> Dict[str, Any]:
    """
    Retrieves a specific booking ID

    Args:
        booking_id (str): ID of the booking

    Returns:
        Dict[str, Any]: Booking retrieved
    """
    booking: Dict[str, Any] | None = await mongo.get_booking(booking_id)

    if not booking:
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_BOOKING_NOT_FOUND_ERROR_MSG,
            details={'booking': {'id': booking_id}}
        )

    return booking


@router.delete(
    '/{booking_id}/',
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(authenticate)],
    include_in_schema=False
)
@router.delete(
    '/{booking_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            'description': OpenAPIDescriptions.BOOKING_ID_DELETE_204_SUCCESS_DESCRIPTION,
        },
        status.HTTP_404_NOT_FOUND: {
            'description': OpenAPIDescriptions.GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE
                }
            }
        },
    },
    dependencies=[Depends(authenticate)],
)
async def delete_booking(
        booking_id: str,
        response: Response = Response,
) -> Response:
    """
    Deletes an existing booking

    Args:
        booking_id (str): Booking to be deleted
        response (Response): FastAPI Response

    Returns:
        Response: FastAPI Response
    """
    if not await mongo.get_booking(booking_id):
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_BOOKING_NOT_FOUND_ERROR_MSG,
            details={'booking': {'id': booking_id}}
        )

    logger.info(Message.BOOKING_DELETE_FMT.format([booking_id]))
    if not await mongo.delete_bookings([booking_id]):
        raise BookieAPIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=ErrorMessage.API_BOOKING_DELETE_ERROR_MSG,
            details={'booking': {'id': booking_id}}
        )

    response.status_code = status.HTTP_204_NO_CONTENT
    return response
