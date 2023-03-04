
from typing import Dict, Any


__all__ = [
    'BookieException',
    'BookieAPIException',
    'BookieAuthException'
]


class BookieException(Exception):
    """
    Base Bookie exception class
    """


class BookieAPIException(BookieException):
    """
    Standard API Exception class

    Attributes:
        status_code (int): REST API status code
        message (str): Brief message summarising error
        request (Dict[str, Any]): Request body
        details (Dict[str, Any]): More details on the error
    """

    def __init__(
            self,
            status_code: int,
            message: str,
            request: Dict[str, Any] | None = None,
            details: Dict[str, Any] | None = None
    ):
        self.status_code = status_code
        self.message = message
        self.request = request or {}
        self.details = details or {}


class BookieAuthException(BookieAPIException):
    """
    Bookie authentication exception

    Attributes:
        message (str): Brief message summarising error
        user (Optional[str]): Requesting user, defaults to None
    """
    def __init__(
            self,
            message: str,
            user: str | None = None
    ):
        super(BookieAuthException, self).__init__(
            401, message, None, {'user': user}
        )
