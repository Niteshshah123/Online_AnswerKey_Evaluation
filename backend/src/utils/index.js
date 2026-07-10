// JWT Utilities
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret);
  } catch (error) {
    return null;
  }
};

// Bcrypt Utilities
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Mark Conversion Utility
export const convertMarks = (obtained, originalTotal, targetTotal) => {
  if (!originalTotal || originalTotal === 0) {
    return 0;
  }
  const converted = (obtained / originalTotal) * targetTotal;
  return Math.round(converted * 100) / 100; // Round to 2 decimal places
};

// Response Utility
export const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    data,
    message,
  });
};

// Error Response Utility
export const sendErrorResponse = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};
