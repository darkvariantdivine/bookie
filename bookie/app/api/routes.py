import asyncio
from logging import getLogger, Logger
import traceback

from json import JSONDecodeError
from typing import Dict, Callable, Any

from fastapi import Request, Response, status
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute

from bookie.exceptions import BookieAPIException, BookieAuthException
from bookie.constants import LOGGERS, LONG_SLEEP
from bookie.messages import ErrorMessage


__all__ = ['BookieRESTRoute']


logger: Logger = getLogger(LOGGERS['api'])


class BookieRESTRoute(APIRoute):
    """
    Customised API Route handler to handle exceptions in a particular way
    """
    def get_route_handler(self) -> Callable:
        """
        Overwritten method for handling routing

        Returns:
            Callable: Route handling function
        """
        original_route_handler: Callable = super().get_route_handler()

        async def generate_request(request: Request) -> Dict[str, Any]:
            """
            Convenience function for structuring the request field in Error response

            Args:
                request (Request): FastAPI Request

            Returns:
                Dict[str, Any]: Request details
            """

            try:
                try:
                    data: Dict[str, Any] = await asyncio.wait_for(request.json(), timeout=LONG_SLEEP)
                except JSONDecodeError:
                    data: str = str((await asyncio.wait_for(request.body(), timeout=LONG_SLEEP)).decode())
            except asyncio.TimeoutError:
                data: Dict[str, Any] = {}
            return {
                'url': str(request.url),
                'headers': dict(request.headers),
                'path_params': dict(request.path_params),
                'query_params': dict(request.query_params),
                'client': dict(request.client._asdict()),
                'body': data
            }

        async def exception_route_handler(request: Request) -> Response:
            """
            Exception route handler

            Args:
                request (Request): FastAPI Request

            Returns:
                Response: FastAPI Response
            """
            try:
                return await original_route_handler(request)
            except HTTPException:
                logger.error(ErrorMessage.API_AUTHENTICATION_ERROR_MSG)
                logger.error(traceback.format_exc())
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        'code': status.HTTP_401_UNAUTHORIZED,
                        'message': ErrorMessage.API_INVALID_AUTHENTICATION_ERROR_MSG,
                        'request': await generate_request(request),
                    }
                )
            except RequestValidationError as exc:
                request: Dict[str, Any] = {
                    'url': str(request.url),
                    'headers': dict(request.headers),
                    'path_params': dict(request.path_params),
                    'query_params': dict(request.query_params),
                    'client': dict(request.client._asdict()),
                    'body': exc.body
                }
                logger.error(ErrorMessage.API_VALIDATION_ERROR_FMT.format(str(request)))
                logger.error(traceback.format_exc())
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        'code': status.HTTP_400_BAD_REQUEST,
                        'message': ErrorMessage.API_VALIDATION_ERROR_MSG,
                        'request': request,
                        'details': {
                            'errors': exc.errors()
                        }
                    }
                )
            except BookieAuthException as exc:
                logger.error(exc.message)
                return JSONResponse(
                    status_code=exc.status_code,
                    content={
                        'code': exc.status_code,
                        'message': exc.message,
                        'request': await generate_request(request),
                        'details': exc.details
                    }
                )
            except BookieAPIException as exc:
                return JSONResponse(
                    status_code=exc.status_code,
                    content={
                        'code': exc.status_code,
                        'message': exc.message,
                        'request': await generate_request(request),
                        'details': exc.details
                    }
                )
            except Exception as exc:
                logger.error(ErrorMessage.API_ERROR_FMT.format(exc.__class__.__name__, str(exc), str(request)))
                logger.error(traceback.format_exc())
                return JSONResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content={
                        'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                        'message': ErrorMessage.API_INTERNAL_SERVER_ERROR_MSG,
                        'request': await generate_request(request),
                        'details': {'traceback': traceback.format_exc()}
                    }
                )

        return exception_route_handler
