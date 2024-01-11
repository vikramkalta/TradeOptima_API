const ERROR_MESSAGES = {
  INVALID_OTP: 'Invalid OTP.',
  INVALID_REFERRER_CODE: 'Invalid referrer code. Please check and try again',
  ILLEGAL_OPERATION: 'Illegal operation. Max limit exceeded',
  COMMON_ERROR: 'Something went wrong.',
  INVALID_PRODUCT_IDENTIFIER: 'Invalid product identifier.',
  USER_NOT_EXISTS: 'User does not exist',
  BAD_CREDENTIALS: 'Credentials are invalid.',
  USER_EMAIL_EXISTS: 'User with same email id already exists.',
  USER_CONTACT_EXISTS: 'User with same contact no: already exists.',
  TOKEN_INVALID: 'Token is invalid.',
  TOKEN_EXPIRED: 'Token expired.'
};
const SUCCESS_MESSAGES = {
  OTP_SENT: 'OTP send to your mobile number.'
};

export { ERROR_MESSAGES, SUCCESS_MESSAGES };