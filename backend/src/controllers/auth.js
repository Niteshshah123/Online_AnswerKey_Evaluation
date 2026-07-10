import { AuthService } from '../services/index.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { loginValidator } from '../validators/index.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';

const authService = new AuthService();

export class AuthController {
  async login(req, res) {
    try {
      const { error, value } = loginValidator(req.body);

      if (error) {
        const errors = error.details.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.VALIDATION_ERROR, errors);
      }

      const result = await authService.login(value.email, value.password);

      sendResponse(res, HTTP_STATUS.OK, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      if (error.statusCode) {
        sendErrorResponse(res, error.statusCode, error.message);
      } else {
        sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Refresh token required');
      }

      const result = await authService.refreshToken(refreshToken);

      sendResponse(res, HTTP_STATUS.OK, result, 'Token refreshed successfully');
    } catch (error) {
      if (error.statusCode) {
        sendErrorResponse(res, error.statusCode, error.message);
      } else {
        sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async logout(req, res) {
    try {
      sendResponse(res, HTTP_STATUS.OK, {}, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}

export const authController = new AuthController();
