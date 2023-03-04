from logging import Logger, getLogger
from typing import Dict, List, Any, Set

from fastapi import APIRouter, status

from bookie.app import mongo
from bookie.app.models import APIError, User
from bookie.constants import LOGGERS
from bookie.exceptions import BookieAPIException
from bookie.messages import ErrorMessage
from bookie.openapi import OpenAPIDescriptions, OpenAPIExamples

from .routes import BookieRESTRoute


__all__ = ['router']


logger: Logger = getLogger(LOGGERS['api'])

router: APIRouter = APIRouter(
    route_class=BookieRESTRoute,
    prefix='/users',
    tags=['Users'],
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


EXCLUDES: Set[str] = {'password', 'salt'}


@router.get(
    '/',
    status_code=status.HTTP_200_OK,
    response_model=List[User],
    response_model_exclude=EXCLUDES,
    include_in_schema=False
)
@router.get(
    '',
    status_code=status.HTTP_200_OK,
    response_model=List[User],
    response_model_exclude=EXCLUDES,
    responses={
        status.HTTP_200_OK: {
            'description': OpenAPIDescriptions.USER_GET_200_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.USER_GET_EXAMPLE
                }
            }
        },
    },
)
async def get_users() -> List[Dict[str, Any]]:
    """
    Retrieves all users

    Returns:
        List[Dict[str, Any]]: Users retrieved
    """
    return await mongo.get_users()


@router.get(
    '/{user_id}/',
    status_code=status.HTTP_200_OK,
    response_model=User,
    response_model_exclude=EXCLUDES,
    include_in_schema=False
)
@router.get(
    '/{user_id}',
    status_code=status.HTTP_200_OK,
    response_model=User,
    response_model_exclude=EXCLUDES,
    responses={
        status.HTTP_200_OK: {
            'description': OpenAPIDescriptions.USER_ID_GET_200_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.USER_ID_GET_EXAMPLE
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
async def get_user(user_id: str) -> Dict[str, Any]:
    """
    Retrieves a specific user

    Args:
        user_id (str): ID of the user

    Returns:
        Dict[str, Any]: User retrieved
    """
    user: Dict[str, Any] | None = await mongo.get_user(user_id)

    if not user:
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_USER_NOT_FOUND_ERROR_MSG,
            details={'user': {'id': user_id}}
        )

    return user
