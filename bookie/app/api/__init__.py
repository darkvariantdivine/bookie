from typing import List, Type

from fastapi import APIRouter
from fastapi.routing import APIRoute

from .routes import BookieRESTRoute
from .bookings import router as booking_api
from .users import router as user_api
from .rooms import router as room_api
from .login import router as login_api


__all__ = ['routers', 'route_class']


routers: List[APIRouter] = [booking_api, user_api, room_api, login_api]
route_class: Type[APIRoute] = BookieRESTRoute
