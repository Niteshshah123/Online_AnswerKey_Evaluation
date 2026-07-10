import { DashboardService } from '../services/index.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req, res) {
    try {
      const { id: facultyId } = req.user;

      const stats = await dashboardService.getDashboardStats(facultyId);

      sendResponse(res, HTTP_STATUS.OK, stats, 'Dashboard stats retrieved successfully');
    } catch (error) {
      if (error.statusCode) {
        sendErrorResponse(res, error.statusCode, error.message);
      } else {
        sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }
}

export const dashboardController = new DashboardController();
