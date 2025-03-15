export enum ERROR_CODES {
    INVALID_OTP = 'INVALID_OTP',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
}

export const APP_ERRORS = {
    [ERROR_CODES.INVALID_OTP]: {
        code: ERROR_CODES.INVALID_OTP,
        message: 'The OTP is invalid.',
    },
    [ERROR_CODES.USER_ALREADY_EXISTS]: {
        code: ERROR_CODES.USER_ALREADY_EXISTS,
        message: 'The user already exists'
    },
}