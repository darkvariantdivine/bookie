
from typing import Dict, Any

from bookie.app.mongo import get_collection


__all__ = [
    'insert_session',
    'delete_session',
    'get_session',
    'get_session_user'
]


async def insert_session(session: Dict[str, Any]) -> bool:
    """
    Inserts a new session into the database

    Args:
        session (Dict[str, Any]): Session to be inserted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (
        await get_collection("sessions").replace_one(
            {'username': session['username']}, session, upsert=True
        )
    ).acknowledged


async def delete_session(username: str) -> bool:
    """
    Deletes an existing session in the database

    Args:
        username (str): Username details

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("sessions").delete_many({"username": username})).acknowledged


async def get_session(session_id: str) -> Dict[str, Any] | None:
    """
    Retrieves a login session

    Args:
        session_id (str): ID of the session

    Returns:
        Dict[str, Any] | None: Session retrieved

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("sessions").find_one(
        {'token': session_id}, projection={"_id": False}
    ))


async def get_session_user(session_id: str) -> Dict[str, Any]:
    """
    Retrieves the user associated with a session

    Args:
        session_id (str): ID of the session

    Returns:
        Dict[str, Any]: Session retrieved

    Raises:
        IndexError: Token does not exist
        KeyError: User does not exist
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("sessions").aggregate(
        [
            {'$match': {'token': session_id}},
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'username',
                    'foreignField': 'email',
                    'as': 'user'
                }
            },
            {'$unwind': {'path': '$user'}},
            {'$project': {'_id': False, 'user._id': False}}
        ]
    ).to_list(None))[0]['user']
