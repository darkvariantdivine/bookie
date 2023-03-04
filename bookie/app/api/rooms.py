
from logging import Logger, getLogger
from typing import Dict, List, Any

from fastapi import APIRouter, status

from bookie.app import mongo
from bookie.app.models import APIError, Room
from bookie.constants import LOGGERS
from bookie.exceptions import BookieAPIException
from bookie.messages import ErrorMessage
from bookie.openapi import OpenAPIDescriptions, OpenAPIExamples

from .routes import BookieRESTRoute


__all__ = ['router']


logger: Logger = getLogger(LOGGERS['api'])

router: APIRouter = APIRouter(
    route_class=BookieRESTRoute,
    prefix='/rooms',
    tags=['Rooms'],
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


@router.get(
    '/',
    status_code=status.HTTP_200_OK,
    response_model=List[Room],
    include_in_schema=False
)
@router.get(
    '',
    status_code=status.HTTP_200_OK,
    response_model=List[Room],
    responses={
        status.HTTP_200_OK: {
            'description': OpenAPIDescriptions.ROOM_GET_200_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.ROOM_GET_EXAMPLE
                }
            }
        },
    },
)
async def get_rooms() -> List[Dict[str, Any]]:
    """
    Retrieves all rooms

    Returns:
        List[Dict[str, Any]]: Rooms retrieved
    """
    return await mongo.get_rooms()


@router.get(
    '/{room_id}/',
    status_code=status.HTTP_200_OK,
    response_model=Room,
    include_in_schema=False
)
@router.get(
    '/{room_id}',
    status_code=status.HTTP_200_OK,
    response_model=Room,
    responses={
        status.HTTP_200_OK: {
            'description': OpenAPIDescriptions.ROOM_ID_GET_200_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.ROOM_ID_GET_EXAMPLE
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
async def get_room(room_id: str) -> Dict[str, Any]:
    """
    Retrieves a specific room

    Args:
        room_id (str): ID of the room

    Returns:
        Dict[str, Any]: Room retrieved
    """
    room: Dict[str, Any] | None = await mongo.get_room(room_id)

    if not room:
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_ROOM_NOT_FOUND_ERROR_MSG,
            details={'room': {'id': room_id}}
        )

    return room
