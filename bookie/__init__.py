import uvicorn

from bookie.constants import HOST, PORT
from bookie.app import create_app


__all__ = ['web_app', 'config']


web_app = create_app()

config = {
    'host': HOST,
    'port': PORT
}
