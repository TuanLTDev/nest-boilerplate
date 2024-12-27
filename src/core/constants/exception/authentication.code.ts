export const AUTH_ERROR_CODE = {
  // auth error code
  INVALID_CREDENTIALS: 'AUTH_001',
  OLD_PASSWORD_INCORRECT: 'AUTH_002',
  UNAUTHORIZED: 'AUTH_003',
  TOKEN_EXPIRED: 'AUTH_004',
  TOKEN_INVALID: 'AUTH_005',
  ACCESS_DENIED: 'AUTH_006',
  TOKEN_INVALID_DEVICE: 'AUTH_007',
  EMAIL_EXIST: 'AUTH_008',
  ACCOUNT_NOT_REGISTER: 'AUTH_009',
  RESET_PASSWORD_TOKEN_USED: 'AUTH_010',

  // user error code
  USER_NOT_FOUND: 'USER_001',
  PHONE_NUMBER_EXIST: 'USER_002',

  // role error code
  ROLE_NOT_FOUND: 'ROLE_001',
  ROLE_NAME_EXIST: 'ROLE_002',
};

export const AUTH_ERROR_RES: Record<string, string> = {
  [AUTH_ERROR_CODE.INVALID_CREDENTIALS]: 'Email or password is incorrect.',
  [AUTH_ERROR_CODE.OLD_PASSWORD_INCORRECT]: 'The old password provided is incorrect. Please try again.',
  [AUTH_ERROR_CODE.USER_NOT_FOUND]: 'No account was found with the provided credentials.',
  [AUTH_ERROR_CODE.TOKEN_EXPIRED]: 'The authentication token has expired. Please log in again.',
  [AUTH_ERROR_CODE.TOKEN_INVALID]: 'The token provided is invalid or malformed.',
  [AUTH_ERROR_CODE.ACCESS_DENIED]: 'You do not have permission to access this resource.',
  [AUTH_ERROR_CODE.UNAUTHORIZED]: 'You must be logged in to access this resource.',
  [AUTH_ERROR_CODE.TOKEN_INVALID_DEVICE]: 'Token not issued for this device.',
  [AUTH_ERROR_CODE.EMAIL_EXIST]: 'The email address is already registered. Please use a different email or log in.',
  [AUTH_ERROR_CODE.ACCOUNT_NOT_REGISTER]: 'Account is not registered.',
  [AUTH_ERROR_CODE.RESET_PASSWORD_TOKEN_USED]: 'Reset password token has already been used. Please request a new one.',

  // define error msg for user
  [AUTH_ERROR_CODE.PHONE_NUMBER_EXIST]: 'Phone number already.',

  // define error msg for role
  [AUTH_ERROR_CODE.ROLE_NOT_FOUND]: 'Role not found.',
  [AUTH_ERROR_CODE.ROLE_NAME_EXIST]: 'Role with this name already exists.',
};
