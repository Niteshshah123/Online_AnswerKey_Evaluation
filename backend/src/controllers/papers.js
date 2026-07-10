import { PapersService } from '../services/index.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

const papersService = new PapersService();

export class PapersController {
  async getAssignedPapers(req, res) {
    try {
      const { id: facultyId } = req.user;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const result = await papersService.getAssignedPapers(facultyId, skip, pageSize);

      sendResponse(res, HTTP_STATUS.OK, result, 'Papers retrieved successfully');
    } catch (error) {
      if (error.statusCode) {
        sendErrorResponse(res, error.statusCode, error.message);
      } else {
        sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getPaperDetails(req, res) {
    try {
      const { id } = req.params;
      const paperId = parseInt(id);

      const paper = await papersService.getPaperDetails(paperId);

      sendResponse(res, HTTP_STATUS.OK, paper, 'Paper details retrieved successfully');
    } catch (error) {
      if (error.statusCode) {
        sendErrorResponse(res, error.statusCode, error.message);
      } else {
        sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async searchPapers(req, res) {
    try {
      const { id: facultyId } = req.user;
      const { query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      if (!query) {
        return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Search query required');
      }

      const results = await papersService.searchPapers(facultyId, query, skip, pageSize);

      sendResponse(res, HTTP_STATUS.OK, results, 'Search results retrieved successfully');
    } catch (error) {
      if (error.statusCode) {
        sendErrorResponse(res, error.statusCode, error.message);
      } else {
        sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }
}

export const papersController = new PapersController();
