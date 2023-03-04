
import asyncio
from logging import LogRecord, Logger, getLogger, Handler
from logging.config import dictConfig
from logging.handlers import QueueHandler, QueueListener
from os import makedirs
from os.path import exists

from queue import SimpleQueue as Queue
from typing import List, Optional

from bookie.constants import LOGGING_CONFIG, LOGGING_FOLDER, LOGGING_FILE_NAME, LOGGERS
from bookie.messages import Message, ErrorMessage


__all__ = ['init', 'close']


queue = Queue()
listener: Optional[QueueListener] = None


class AsyncioQueueHandler(QueueHandler):
    """
    Logging queue handler for handling asynchronous logging
    """
    def emit(self, record: LogRecord) -> None:
        """
        Emits a log record

        Args:
            record (LogRecord): Structured log record

        Returns:
            None
        """
        try:
            self.enqueue(record)
        except asyncio.CancelledError:
            raise
        except Exception:
            self.handleError(record)


async def init() -> None:
    """
    Main function to initialise loggers

    Returns:
        None
    """

    logger: Logger = getLogger(LOGGERS['base'])
    try:
        logger.info(Message.MODULE_INIT_FMT.format('logging'))

        # Setup logging folder and files
        if not exists(LOGGING_FOLDER):
            makedirs(LOGGING_FOLDER)
            with open(LOGGING_FILE_NAME, 'a+'):
                pass

        # Configure all the loggers with the specified config
        dictConfig(LOGGING_CONFIG)

        # Add queue handler to root logger
        root = getLogger()
        handler: AsyncioQueueHandler = AsyncioQueueHandler(queue)
        root.addHandler(handler)

        # Switch all existing handlers on the root logger over to the queue listener
        handlers: List[Handler] = []
        for h in root.handlers[:]:
            if h is not handler:
                root.removeHandler(h)
                handlers.append(h)

        # Start the queue listener
        global listener
        listener = QueueListener(
            queue, *handlers, respect_handler_level=True
        )
        listener.start()

    except Exception as e:
        logger.error(ErrorMessage.MODULE_INIT_ERROR_FMT.format(e.__class__.__name__, str(e), 'logging'))
        raise
    logger.info(Message.APP_FOLDER_FMT.format('logging', LOGGING_FOLDER))
    logger.info(Message.MODULE_INIT_SUCCESS_FMT.format('logging'))


async def close() -> None:
    """
    Shuts down the logging queue listener

    Returns:
        None
    """
    logger: Logger = getLogger(LOGGERS['base'])
    try:
        logger.info(Message.MODULE_SHUTDOWN_FMT.format('logging'))
        if listener:
            listener.stop()
    except Exception as e:
        logger.error(ErrorMessage.MODULE_SHUTDOWN_ERROR_FMT.format(e.__class__.__name__, str(e), 'logging'))
        raise
    logger.info(Message.MODULE_SHUTDOWN_SUCCESS_FMT.format('logging'))

