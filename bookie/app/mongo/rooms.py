
from typing import Dict, Any, List

from bookie.app.mongo import get_collection


__all__ = [
    'insert_room',
    'update_room',
    'delete_room',
    'get_rooms',
    'get_room'
]


async def insert_room(room: Dict[str, Any]) -> bool:
    """
    Inserts a new room into the database

    Args:
        room (Dict[str, Any]): Room to be inserted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("rooms").insert_one(room)).acknowledged


async def update_room(room_id: str, room: Dict[str, Any]) -> bool:
    """
    Updates an existing room in the database

    Args:
        room_id (str): ID of the room
        room (Dict[str, Any]): Room to be inserted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("rooms").replace_one({"id": room_id}, room)).acknowledged


async def delete_room(room_id: str) -> bool:
    """
    Deletes an existing room in the database

    Args:
        room_id (str): ID of the room

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("rooms").delete_one({"id": room_id})).acknowledged


async def get_rooms() -> List[Dict[str, Any]]:
    """
    Retrieves all rooms in the database

    Returns:
        List[Dict[str, Any]]: List of rooms

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return await get_collection('rooms').find().to_list(None)


async def get_room(room_id: str) -> Dict[str, Any] | None:
    """
    Retrieves a room from the database

    Args:
        room_id (str): ID of the room

    Returns:
        Dict[str, Any] | None: Room retrieved

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return await get_collection('rooms').find_one({'id': room_id})
