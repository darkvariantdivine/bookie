
class ErrorMessage(object):
    # App
    APP_FAILURE_ERROR_FMT = "Fatal exception {}.{} was thrown, shutting down Bookie"

    # Module
    MODULE_INIT_ERROR_FMT = "Error {}.{} occurred when initialising module {}"
    MODULE_SHUTDOWN_ERROR_FMT = "Error {}.{} occurred when shutting down module {}"

    # API Validation
    API_ERROR_FMT = "Error {}.{} occurred when request was made with {}"
    API_VALIDATION_ERROR_MSG = "Validation error"
    API_VALIDATION_ERROR_FMT = "Validation error occurred when request was made with {}"
    API_INTERNAL_SERVER_ERROR_MSG = 'Internal server error'
    API_INVALID_AUTHENTICATION_ERROR_MSG = "Invalid authentication method used"
    API_USER_NOT_FOUND_ERROR_MSG = 'Requesting user does not exist'
    API_AUTHENTICATION_ERROR_MSG = 'Requesting user is not authenticated'

    # Bookings
    API_BOOKING_CREATE_ERROR_MSG = "Unable to create Booking"
    API_BOOKING_UPDATE_ERROR_MSG = "Unable to update Booking(s)"
    API_BOOKING_DELETE_ERROR_MSG = "Unable to delete Booking(s)"
    API_BOOKING_NOT_FOUND_ERROR_MSG = "Booking does not exist"
    API_BOOKING_EXPIRED_ERROR_MSG = "Booking has already expired"
    API_BOOKING_OVERLAPS_ERROR_MSG = "Booking overlaps with other Bookings"

    # Rooms
    API_ROOM_NOT_FOUND_ERROR_MSG = "Room does not exist"


class Message(object):
    # App
    APP_INIT_MSG = "Initialising Bookie"
    APP_INIT_SUCCESS_MSG = "Successfully created Bookie"
    APP_FOLDER_FMT = "Found {} folder at path {}"

    # Module
    MODULE_INIT_FMT = "Initialising module {}"
    MODULE_INIT_SUCCESS_FMT = "Successfully initialised module {}"
    MODULE_SHUTDOWN_FMT = "Shutting down module {}"
    MODULE_SHUTDOWN_SUCCESS_FMT = "Successfully shutdown module {}"

    # Bookings
    BOOKING_CREATE_FMT = "Creating Booking {}"
    BOOKING_UPDATE_FMT = "Updating Booking {} with parameters {}"
    BOOKING_DELETE_FMT = "Deleting Booking {}"

    # Rooms
    LOGIN_CREATE_FMT = "Logging in user {}"
    LOGIN_DELETE_FMT = "Logging out user {}"
