import { verifyAccessToken } from '../utils/index.js';
import { sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendErrorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return sendErrorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED,
      );
    }

    req.user = decoded;
    next();
  } catch (error) {
    sendErrorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED,
    );
  }
};

export default authMiddleware;
