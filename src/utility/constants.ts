const MAX_LIMIT = 10;
const OTP_EXPIRY = 1200; // Seconds;
const TOKEN_EXPIRY = 60000; // Seconds
const TOKEN_EXPIRY_EMAIL_VERIFY = 43200;

const STATUSES = {
  ok: 'OK',
  created: 'Created',
  accepted: 'Accepted',
  noContent: 'No Content',
  badRequest: 'Bad request',
  unauthorized: 'Unauthorized',
  paymentRequired: 'Payment required',
  forbidden: 'Forbidden',
  notFound: 'Not found',
  methodNotAllowed: 'Method not allowed',
  requestTimeout: 'Request Timeout',
  duplicateResource: 'Resource already exists',
  payloadTooLarge: 'Payload too large',
  unsupportedMediaType: 'Unsupported media type',
  unprocessableEntity: 'Unprocessable entity',
  tooManyRequests: 'Too many requests',
  internalServerError: 'Internal server error',
  badGateway: 'Bad gateway',
  serviceUnavailable: 'Service unavailable',
  gatewayTimeout: 'Gateway timeout'
};

const STATUS_CODES = {
  [STATUSES.ok]: 200,
  [STATUSES.created]: 201,
  [STATUSES.accepted]: 202,
  [STATUSES.noContent]: 202,
  [STATUSES.badRequest]: 400,
  [STATUSES.unauthorized]: 401,
  [STATUSES.paymentRequired]: 402,
  [STATUSES.forbidden]: 403,
  [STATUSES.notFound]: 404,
  [STATUSES.methodNotAllowed]: 405,
  [STATUSES.requestTimeout]: 408,
  [STATUSES.duplicateResource]: 409,
  [STATUSES.payloadTooLarge]: 413,
  [STATUSES.unsupportedMediaType]: 415,
  [STATUSES.unprocessableEntity]: 422,
  [STATUSES.tooManyRequests]: 429,
  [STATUSES.internalServerError]: 500,
  [STATUSES.badGateway]: 502,
  [STATUSES.serviceUnavailable]: 503,
  [STATUSES.gatewayTimeout]: 504
};

const GLOBAL_APP_CONFIG_KEY = 'APP_CONFIG';

const COLLECTIONS = {
  APP_CONFIG: 'app_config',
  CLIENT: 'client',
  INVESTOR: 'investor',
  COMPETITOR: 'competitor',
  TRADING_HISTORY: 'trading_history',
  EXCHANGE: 'exchange',
};

const USER_ROLES = {
  customer: 'Individual',
  business: 'Business',
};

const REFERRAL_CONVERSIONS_COUNT = 5;

const AUTH_USER_ROLES = ['Client', 'Investor', 'Competitor', 'Admin'];

const EVENTS = {
  USER_CREATE_ORCHESTRATOR: 'USER_CREATE_ORCHESTRATOR',
  CLIENT_UPDATE_ORCHESTRATOR: 'CLIENT_UPDATE_ORCHESTRATOR',
  INVESTOR_UPDATE_ORCHESTRATOR: 'INVESTOR_UPDATE_ORCHESTRATOR',
  COMPETITOR_UPDATE_ORCHESTRATOR: 'COMPETITOR_UPDATE_ORCHESTRATOR',
};

export {
  MAX_LIMIT,
  OTP_EXPIRY,
  TOKEN_EXPIRY,
  TOKEN_EXPIRY_EMAIL_VERIFY,
  STATUSES,
  STATUS_CODES,
  GLOBAL_APP_CONFIG_KEY,
  COLLECTIONS,
  REFERRAL_CONVERSIONS_COUNT,
  USER_ROLES,
  AUTH_USER_ROLES,
  EVENTS,
};