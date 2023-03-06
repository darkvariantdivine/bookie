
from __future__ import annotations

from datetime import datetime, timezone, timedelta
from functools import partial
from typing import List, Dict, Any

from pydantic import BaseModel, SecretStr, constr, EmailStr, conint, Field, confloat

__all__ = ['APIError', 'UserAuth', 'User', 'Room', 'Booking']


class APIError(BaseModel):
    """
    Generic description of an API Error

    Attributes:
        code (int): HTTP Status Code
        message (str): Brief message
        request (Dict[str, Any]): Request details
        details (Dict[str, Any]): More details on the error
    """
    code: int
    message: str
    request: Dict[str, Any] = {}
    details: Dict[str, Any] = {}


class UserAuth(BaseModel):
    """
    User authentication model

    Attributes:
        username (EmailStr): User name of the user
        password (SecretStr): Password of the user
        token (constr | None): Authentication token of the user,
                               defaults to None
    """
    username: EmailStr
    password: SecretStr
    token: constr(min_length=16, max_length=16) | None


class User(BaseModel):
    """
    User model

    Attributes:
        id (constr): ID of the user
        password (constr): Password of the user
        salt (constr): Salt to encrypt a user's password
        email (EmailStr): Email of the user
        name (constr): Name of the user
        image (str | None): Profile image of the user
        description (constr): Brief description of the user
        rooms (List[str]): Allowable rooms that the user can book,
                           defaults to an empty list
    """
    id: constr(min_length=32, max_length=32)
    password: constr(min_length=64, max_length=64)
    salt: constr(min_length=16, max_length=16)
    email: EmailStr
    name: constr(max_length=100)
    image: str | None
    description: constr(max_length=200)
    rooms: List[str] = []


class Room(BaseModel):
    """
    Room model

    Attributes:
        id (constr): ID of the room
        name (constr): Name of the room
        description (constr): Brief description of the room
        capacity (conint): Number of capacity that the room can hold,
                           defaults to 1
        images (List[str]): List of images associated with the room
    """
    id: constr(min_length=32, max_length=32)
    name: constr(max_length=100)
    description: constr(max_length=500)
    capacity: conint(ge=1) = 1
    images: List[str] = []


class Booking(BaseModel):
    """
    Booking model

    Attributes:
        id (constr): ID of the booking
        user (constr): ID of the user
        room (constr): ID of the room
        start (datetime): Starting date time of the booking
        duration (confloat): Duration of the booking in hours
        last_modified (datetime): Last modified timestamp
    """
    id: constr(min_length=32, max_length=32)
    user: constr(min_length=32, max_length=32)
    room: constr(min_length=32, max_length=32)
    start: datetime
    duration: confloat(gt=0)
    last_modified: datetime = Field(
        alias='lastModified',
        default_factory=partial(datetime.now, timezone.utc)
    )

    class Config:
        allow_population_by_field_name: bool = True

    @property
    def end(self) -> datetime:
        """
        Convenience function for generating the end datetime

        Returns:
            datetime: End datetime
        """
        return self.start + timedelta(hours=self.duration)

    def overlaps(self, booking: Booking) -> bool:
        """
        Checks if the booking overlaps with another

        Args:
            booking (Booking): Booking to check

        Returns:
            bool: If booking overlaps
        """
        return not (
                self.end <= booking.start or
                self.start >= booking.end
        )
