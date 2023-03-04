
from logging import getLogger, Logger
from typing import Optional, Dict
from datetime import timezone

from bson import CodecOptions
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection

from bookie.messages import ErrorMessage, Message
from bookie.constants import BOOKIE_COLLECTIONS, DATABASE_NAME, DATABASE_HOST, LOGGERS


__all__ = ['get_mongo', 'get_database', 'get_collection', 'init', 'close']


mongo_client: Optional[AsyncIOMotorClient] = None
bookie_database: Optional[AsyncIOMotorDatabase] = None
collections: Dict[str, AsyncIOMotorCollection] = {}


def get_mongo() -> AsyncIOMotorClient:
    """
    Returns a reference to the MongoDB Client

    Returns:
        MotorClient: MongoDB Client
    """
    return mongo_client


def get_database() -> AsyncIOMotorDatabase:
    """
    Returns a reference to the MongoDB MHE X2 Laser Sensors Database

    Returns:
        MotorDatabase: MongoDB X2 Laser Sensors Database
    """
    return bookie_database


def get_collection(name: str) -> AsyncIOMotorCollection:
    """
    Returns a reference to a specified collection in the MongoDB WCS Database

    Args:
        name (str): Collection name

    Returns:
        AsyncIOMotorCollection: Specified collection
    """
    return collections[name]


async def init() -> None:
    """
    Initialises the MongoDB Client

    Returns:
        None
    """

    global mongo_client, bookie_database, collections

    logger: Logger = getLogger(LOGGERS['base'])
    try:
        logger.info(Message.MODULE_INIT_FMT.format('mongo'))
        mongo_client = AsyncIOMotorClient(host=DATABASE_HOST)
        bookie_database = mongo_client.get_database(DATABASE_NAME)
        options: CodecOptions = CodecOptions(tz_aware=True, tzinfo=timezone.utc)

        collections = {
            i: bookie_database.get_collection(i, codec_options=options)
            for i in BOOKIE_COLLECTIONS
        }

    except Exception as e:
        logger.error(ErrorMessage.MODULE_INIT_ERROR_FMT.format(e.__class__.__name__, str(e), 'mongo'))
        raise
    logger.info(Message.MODULE_INIT_SUCCESS_FMT.format('mongo'))


async def close() -> None:
    """
    Closes the MongoDB Client

    Returns:
        None
    """

    logger: Logger = getLogger(LOGGERS['base'])
    try:
        logger.info(Message.MODULE_SHUTDOWN_FMT.format('mongo'))
        if mongo_client is not None:
            mongo_client.close()
    except Exception as e:
        logger.error(ErrorMessage.MODULE_SHUTDOWN_ERROR_FMT.format(e.__class__.__name__, str(e), 'mongo'))
        raise
    logger.info(Message.MODULE_SHUTDOWN_SUCCESS_FMT.format('mongo'))


from .bookings import *
from .users import *
from .rooms import *
from .sessions import *
