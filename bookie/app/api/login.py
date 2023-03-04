import json
import secrets
from logging import Logger, getLogger

from fastapi import APIRouter, status, Response, Depends

from bookie.app import mongo
from bookie.app.models import APIError, UserAuth, User
from bookie.app.utils import get_hash
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
    prefix='/login',
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


@router.post(
    '/',
    status_code=status.HTTP_204_NO_CONTENT,
    include_in_schema=False
)
@router.post(
    '',
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            'description': OpenAPIDescriptions.LOGIN_POST_204_SUCCESS_DESCRIPTION,
        },
        status.HTTP_400_BAD_REQUEST: {
            'description': OpenAPIDescriptions.GENERIC_400_VALIDATION_ERROR_DESCRIPTION,
            'content': {
                'application/json': OpenAPIExamples.GENERIC_VALIDATION_ERROR_EXAMPLE
            }
        },
        status.HTTP_404_NOT_FOUND: {
            'description': OpenAPIDescriptions.GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION,
            'content': {
                'application/json': OpenAPIExamples.GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE
            }
        },
    },
)
async def login_user(
        login: UserAuth,
        response: Response = Response
) -> Response:
    """
    Authenticates and logs in a user

    Args:
        login (UserAuth): User details to authenticate
        response (Response): FastAPI Response

    Returns:
        Response: FastAPI Response
    """
    try:
        user: User = User(**(await mongo.get_user_email(login.username)))
    except TypeError:
        raise BookieAPIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message=ErrorMessage.API_USER_NOT_FOUND_ERROR_MSG,
            details={'login': json.loads(login.json(exclude_unset=True))}
        )

    if not user.password == get_hash(login.password.get_secret_value(), user.salt):
        raise BookieAPIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=ErrorMessage.API_AUTHENTICATION_ERROR_MSG,
            details={'login': json.loads(login.json(exclude_unset=True))}
        )

    login.token = secrets.token_hex(16)

    logger.info(Message.LOGIN_CREATE_FMT.format(login))
    if not await mongo.insert_session(login.dict(exclude={'password'})):
        raise BookieAPIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=ErrorMessage.API_INTERNAL_SERVER_ERROR_MSG,
            details={'login': json.loads(login.json(exclude_unset=True))}
        )

    response.headers['Authorization'] = f"Bearer {login.token}"
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.delete(
    '/',
    status_code=status.HTTP_204_NO_CONTENT,
    include_in_schema=False
)
@router.delete(
    '',
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            'description': OpenAPIDescriptions.LOGIN_DELETE_204_SUCCESS_DESCRIPTION,
            'content': {
                'application/json': {
                    'example': OpenAPIExamples.ROOM_ID_GET_EXAMPLE
                }
            }
        },
    },
)
async def logout_user(
        user: User = Depends(authenticate),
        response: Response = Response
) -> Response:
    """
    Logs out a user

    Args:
        user (User): User details
        response (Response): FastAPI Response

    Returns:
        Response: FastAPI Response
    """
    logger.info(Message.LOGIN_DELETE_FMT.format(user))
    if not await mongo.delete_session(user.email):
        raise BookieAPIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=ErrorMessage.API_INTERNAL_SERVER_ERROR_MSG
        )

    response.status_code = status.HTTP_204_NO_CONTENT
    return response
