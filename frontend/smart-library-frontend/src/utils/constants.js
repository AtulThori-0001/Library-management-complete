
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
export const TOKEN_KEY = 'slms_token';
export const USER_KEY = 'slms_user';
export const FINE_PER_DAY = 5;
export const DEFAULT_PAGE_SIZE = 10;
export const ISSUE_DAYS = 14;

export const ROLES = { ADMIN: 'ROLE_ADMIN', STUDENT: 'ROLE_STUDENT' };

export const BOOK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ISSUED: 'ISSUED',
  RESERVED: 'RESERVED',
  LOST: 'LOST'
};

export const TRANSACTION_TYPE = { ISSUE: 'ISSUE', RETURN: 'RETURN', RENEWAL: 'RENEWAL' };
export const RESERVATION_STATUS = { PENDING: 'PENDING', FULFILLED: 'FULFILLED', CANCELLED: 'CANCELLED', EXPIRED: 'EXPIRED' };
