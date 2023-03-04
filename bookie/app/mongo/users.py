

from typing import Dict, Any, List

from bookie.app.mongo import get_collection


__all__ = [
    'insert_user',
    'update_user',
    'delete_user',
    'get_users',
    'get_user',
    'get_user_email'
]


async def insert_user(user: Dict[str, Any]) -> bool:
    """
    Inserts a new user into the database

    Args:
        user (Dict[str, Any]): User to be inserted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("users").insert_one(user)).acknowledged


async def update_user(user_id: str, user: Dict[str, Any]) -> bool:
    """
    Updates an existing user in the database

    Args:
        user_id (str): ID of the user
        user (Dict[str, Any]): User to be inserted

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("users").replace_one({"id": user_id}, user)).acknowledged


async def delete_user(user_id: str) -> bool:
    """
    Deletes an existing user in the database

    Args:
        user_id (str): ID of the user

    Returns:
        bool: If the operation was successful

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return (await get_collection("users").delete_one({"id": user_id})).acknowledged


async def get_users() -> List[Dict[str, Any]]:
    """
    Retrieves all users in the database

    Returns:
        List[Dict[str, Any]]: List of users

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return await get_collection('users').find().to_list(None)


async def get_user(user_id: str) -> Dict[str, Any] | None:
    """
    Retrieves a user from the database

    Args:
        user_id (str): ID of the user

    Returns:
        Dict[str, Any] | None: User retrieved

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return await get_collection('users').find_one({'id': user_id})


async def get_user_email(email: str) -> Dict[str, Any] | None:
    """
    Retrieves a user from the database via email

    Args:
        email (str): Email of the user

    Returns:
        Dict[str, Any] | None: User retrieved

    Raises:
        pymongo.PyMongoError: If errors occur during processing
    """
    return await get_collection('users').find_one({'email': email})

