
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from bookie.app import mongo
from bookie.app.models import User
from bookie.exceptions import BookieAuthException
from bookie.messages import ErrorMessage


__all__ = ['authenticate']


auth_header: HTTPBearer = HTTPBearer()


async def authenticate(
        token: HTTPAuthorizationCredentials | None = Depends(auth_header),
) -> User:
    """
    Extracts and authenticates a bearer token

    Args:
        token (HTTPAuthorizationCredentials | None): User session token

    Returns:
        User: Extracted user details

    Raises:
        BookieAuthException: If token could not be extracted
        BookieAuthException: If user was not authenticated
        BookieAuthException: If user does not exist
    """
    if not token:
        raise BookieAuthException(ErrorMessage.API_INVALID_AUTHENTICATION_ERROR_MSG)

    try:
        user: User = User(**(await mongo.get_session_user(token.credentials)))
    except IndexError:
        raise BookieAuthException(ErrorMessage.API_AUTHENTICATION_ERROR_MSG)
    except (KeyError, TypeError):
        raise BookieAuthException(ErrorMessage.API_USER_NOT_FOUND_ERROR_MSG)

    return user
