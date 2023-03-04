from logging import Logger, getLogger

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI

from bookie.app import mongo, api, logging
from bookie.messages import Message, ErrorMessage
from bookie.constants import LOGGERS, VERSION_FORMAT

__all__ = ['create_app']


def create_app() -> FastAPI:
    """
    Creates an application that is deployable

    Returns:
        FastAPI: The FastAPI application to be served
    """

    logger: Logger = getLogger(LOGGERS['base'])
    try:
        logger.info(Message.APP_INIT_MSG)
        app: FastAPI = FastAPI()
        app.router.route_class = api.route_class
        for router in api.routers:
            router.route_class = api.route_class
            app.include_router(router)
        app = VersionedFastAPI(
            app,
            prefix_format=VERSION_FORMAT,
            enable_latest=True,
        )
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"]
        )
        app.on_event('startup')(logging.init)
        app.on_event('startup')(mongo.init)
        app.on_event('shutdown')(mongo.close)
        logger.info(Message.APP_INIT_SUCCESS_MSG)
        return app
    except Exception as e:
        logger.error(ErrorMessage.APP_FAILURE_ERROR_FMT.format(e.__class__.__name__, str(e)))
        raise
