export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PAPERS: '/papers',
  EVALUATION: '/evaluation/:id',
  NOT_FOUND: '/404',
};

export const PAPER_STATUS = {
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const EVALUATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
};

export const DEFAULT_ORIGINAL_MARKS = 50;
export const DEFAULT_TARGET_MARKS = 30;

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SOMETHING_WRONG: 'Something went wrong. Please try again.',
};

export const SUCCESS_MESSAGES = {
  DRAFT_SAVED: 'Draft saved successfully',
  EVALUATION_SUBMITTED: 'Evaluation submitted successfully',
  LOGIN_SUCCESS: 'Login successful',
};

export const ITEMS_PER_PAGE = 10;
