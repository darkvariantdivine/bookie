from logging import getLevelName
from os import environ
from os.path import abspath, join
from typing import List, Dict, Any

__all__ = [
    'HOST', 'PORT', 'VERSION_FORMAT', 'NUM_ITERATIONS',

    'DATABASE_NAME', 'DATABASE_HOST', 'BOOKIE_COLLECTIONS',

    'CURR_FOLDER', 'BOOKIE_FOLDER', 'LOGGING_FOLDER',

    'DEFAULT_LOGGING_LEVEL', 'LOGGING_FORMAT', 'LOGGING_LEVEL',
    'LOGGING_FILE_NAME', 'LOGGERS', 'LOGGING_CONFIG',

    'LONG_SLEEP'
]

HOST = environ.get('HOST', '127.0.0.1')
PORT: int = int(environ.get('PORT', 20000))
VERSION_FORMAT: str = '/v{major}.{minor}'
NUM_ITERATIONS: int = 10000

DATABASE_NAME: str = 'bookie'
DATABASE_HOST: str = environ.get('DATABASE_HOST', '127.0.0.1:27017')
BOOKIE_COLLECTIONS: List[str] = ['bookings', 'users', 'rooms', 'sessions']

CURR_FOLDER: str = abspath('.')
BOOKIE_FOLDER: str = abspath(environ.get('BOOKIE_FOLDER', CURR_FOLDER))
LOGGING_FOLDER: str = abspath(environ.get('LOGGING_FOLDER', join(BOOKIE_FOLDER, 'logs')))

DEFAULT_LOGGING_LEVEL: int = 20
LOGGING_FORMAT: str = '%(asctime)s:%(msecs)03d [%(name)s] [%(levelname)s] : %(message)s'
LOGGING_LEVEL: object = getLevelName(int(environ.get('LOGGING_LEVEL', DEFAULT_LOGGING_LEVEL)))
LOGGING_FILE_NAME: str = join(LOGGING_FOLDER, 'bookie.log')
LOGGERS: Dict[str, str] = {
    'base': 'bookie',
    'api': 'bookie.api',
}
LOGGING_CONFIG: Dict[str, Any] = {
    'version': 1,
    'formatters': {
        'default': {
            'format': LOGGING_FORMAT
        },
    },
    'handlers': {
        'file_handler': {
            'class': 'logging.FileHandler',
            'formatter': 'default',
            'filename': LOGGING_FILE_NAME,
            'level': LOGGING_LEVEL,
        },
        'stream_handler': {
            'class': 'logging.StreamHandler',
            'formatter': 'default',
            'level': LOGGING_LEVEL
        }
    },
    'loggers': {
        LOGGERS['base']: {
            'level': LOGGING_LEVEL,
            'handlers': ['stream_handler', 'file_handler']
        },
        'uvicorn': {
            'level': LOGGING_LEVEL,
            'handlers': ['stream_handler', 'file_handler']
        }
    }
}

LONG_SLEEP: float = 1.0
