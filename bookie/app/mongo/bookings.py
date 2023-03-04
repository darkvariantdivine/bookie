from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

from bookie.app.mongo import get_collection


__all__ = [
    'insert_booking',
    'update_booking',
    'delete_bookings',
    'get_bookings',
    'get_bookings_user',
    'get_bookings_room_date',
    'get_booking'
]


async def insert_booking(booking: Dict[str, Any]) -> bool:
    """
    Inserts a new booking into the database

    Args:
        booking (Dict[str, Any]): Booking to be inserted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("bookings").insert_one(booking)).acknowledged


async def update_booking(booking_id: str, booking: Dict[str, Any]) -> bool:
    """
    Updates an existing booking in the database

    Args:
        booking_id (str): ID of the booking
        booking (Dict[str, Any]): Booking to be updated

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("bookings").replace_one({'id': booking_id}, booking)).acknowledged


async def delete_bookings(bookings: List[str]) -> bool:
    """
    Deletes a set of bookings from the database

    Args:
        bookings (List[str]): Bookings to be deleted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("bookings").delete_many({'id': {'$in': bookings}})).acknowledged


async def get_bookings() -> List[Dict[str, Any]]:
    """
    Retrieves all bookings from the database

    Returns:
        List[Dict[str, Any]]: List of all bookings
    """
    date: datetime = datetime.now(timezone.utc)
    return await get_collection("bookings").find(
        {'start': {'$gte': datetime(date.year, date.month, date.day)}}
    ).to_list(None)


async def get_bookings_user(user: str) -> List[Dict[str, Any]]:
    """
    Retrieves all bookings from the database

    Args:
        user (str): Bookings belonging to user

    Returns:
        List[Dict[str, Any]]: List of all bookings
    """
    date: datetime = datetime.now(timezone.utc)
    return await get_collection("bookings").find(
        {'user': user, 'start': {'$gte': datetime(date.year, date.month, date.day)}}
    ).to_list(None)


async def get_bookings_room_date(room: str, date: datetime) -> List[Dict[str, Any]]:
    """
    Retrieves all bookings from the database after a specified datetime

    Args:
        room (str): Bookings associated with a room
        date (datetime): Date time

    Returns:
        List[Dict[str, Any]]: List of all bookings
    """
    return await get_collection("bookings").find(
        {
            'room': room,
            'start': {
                '$gte': date,
                '$lt': datetime(date.year, date.month, date.day + 1)
            }
        }
    ).to_list(None)


async def get_booking(booking_id: str) -> Dict[str, Any] | None:
    """
    Retrieves a booking

    Args:
        booking_id (str): ID of the booking

    Returns:
        Dict[str, Any] | None: Booking retrieve

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return await get_collection("bookings").find_one(
        {'id': booking_id}, projection={"_id": False}
    )
