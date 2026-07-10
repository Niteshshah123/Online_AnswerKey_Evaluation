import logger from '../config/logger.js';
import { sendErrorResponse } from '../utils/index.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  // Validation Error
  if (err.details) {
    return sendErrorResponse(res, 400, 'Validation error', err.details);
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return sendErrorResponse(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendErrorResponse(res, 401, 'Token expired');
  }

  // Custom Error
  if (err.statusCode) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }

  // Default Error
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error',
  });
};

export default errorHandler;
