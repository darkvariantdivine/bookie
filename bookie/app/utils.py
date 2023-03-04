import hashlib
import uuid

from bookie.constants import NUM_ITERATIONS


__all__ = ['get_id', 'get_hash']


def get_id() -> str:
    """
    Generates a random 32-bit hexadecimal ID

    Returns:
        str: Hexadecimal ID
    """
    return uuid.uuid4().hex


def get_hash(to_hash: str, salt: str) -> str:
    """
    Retrieves the salted SHA-256 hash of specified string

    Args:
        to_hash (str): String to be hashed
        salt (str): Salt string

    Returns:
        str: Hashed string
    """
    return hashlib.pbkdf2_hmac('sha256', to_hash.encode('utf-8'), salt.encode('utf-8'), NUM_ITERATIONS).hex()
