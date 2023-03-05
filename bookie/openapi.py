from typing import Dict, List, Any


class OpenAPIDescriptions(object):
    GENERIC_400_VALIDATION_ERROR_DESCRIPTION = 'Invalid parameters'
    GENERIC_401_AUTHENTICATION_ERROR_DESCRIPTION = "Authentication error"
    GENERIC_404_ID_NOT_FOUND_ERROR_DESCRIPTION = 'ID specified was not found'
    GENERIC_500_INTERNAL_SERVER_ERROR_DESCRIPTION = 'Internal server error'

    BOOKING_POST_201_SUCCESS_DESCRIPTION: str = 'Successfully created Booking'
    BOOKING_GET_200_SUCCESS_DESCRIPTION: str = 'Successfully retrieved all bookings'
    BOOKING_DELETE_204_SUCCESS_DESCRIPTION: str = 'Successfully cancelled bookings'
    BOOKING_ID_PUT_204_SUCCESS_DESCRIPTION: str = 'Successfully updated booking'
    BOOKING_ID_GET_200_SUCCESS_DESCRIPTION: str = 'Successfully retrieved booking'
    BOOKING_ID_DELETE_204_SUCCESS_DESCRIPTION: str = 'Successfully cancelled booking'

    ROOM_GET_200_SUCCESS_DESCRIPTION: str = 'Successfully retrieved all bookings'
    ROOM_ID_GET_200_SUCCESS_DESCRIPTION: str = 'Successfully retrieved booking'

    USER_GET_200_SUCCESS_DESCRIPTION: str = 'Successfully retrieved all users'
    USER_ID_GET_200_SUCCESS_DESCRIPTION: str = 'Successfully retrieved user'

    LOGIN_POST_201_SUCCESS_DESCRIPTION: str = "Successfully logged in"
    LOGIN_DELETE_204_SUCCESS_DESCRIPTION: str = "Successfully logged out"


class OpenAPIExamples(object):
    GENERIC_VALIDATION_ERROR_EXAMPLE = {'code': 400, 'message': 'Validation error'}
    GENERIC_AUTHENTICATION_ERROR_EXAMPLE = {'code': 401, 'message': 'Authentication error'}
    GENERIC_ID_NOT_FOUND_ERROR_EXAMPLE = {'code': 404, 'message': 'ID specified was not found'}
    GENERIC_INTERNAL_SERVER_ERROR_EXAMPLE = {'code': 500, 'message': 'Internal server error'}

    # TODO: Update examples
    BOOKING_POST_EXAMPLE: Dict[str, int] = {'id': "45d6caff-f168-432c-9f51-8c0555c962f4"}
    BOOKING_GET_EXAMPLE: List[Dict[str, Any]] = []
    BOOKING_ID_GET_EXAMPLE: Dict[str, Any] = {}

    ROOM_GET_EXAMPLE: List[Dict[str, Any]] = []
    ROOM_ID_GET_EXAMPLE: Dict[str, Any] = {}

    USER_GET_EXAMPLE: List[Dict[str, Any]] = []
    USER_ID_GET_EXAMPLE: Dict[str, Any] = {}
