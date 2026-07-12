import { PapersService } from '../services/index.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

const papersService = new PapersService();

export class PapersController {
  async getAssignedPapers(req, res) {
    try {
      const facultyId = req.user.id;
      if (!facultyId) return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Faculty record not found. Please contact admin.');
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;
      const filters = {
        department: req.query.department || undefined,
        section: req.query.section || undefined,
        year: req.query.year || undefined,
        status: req.query.status || undefined,
      };
      const result = await papersService.getAssignedPapers(facultyId, skip, pageSize, filters);
      sendResponse(res, HTTP_STATUS.OK, result, 'Papers retrieved successfully');
    } catch (error) {
      if (error.statusCode) sendErrorResponse(res, error.statusCode, error.message);
      else sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getPaperDetails(req, res) {
    try {
      const { id } = req.params;
      const paper = await papersService.getPaperDetails(id);
      sendResponse(res, HTTP_STATUS.OK, paper, 'Paper details retrieved successfully');
    } catch (error) {
      if (error.statusCode) sendErrorResponse(res, error.statusCode, error.message);
      else sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getPaperFilters(req, res) {
    try {
      const facultyId = req.user.id;
      if (!facultyId) return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Faculty record not found.');
      const filters = await papersService.getPaperFilters(facultyId);
      sendResponse(res, HTTP_STATUS.OK, filters, 'Filters retrieved successfully');
    } catch (error) {
      sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async searchPapers(req, res) {
    try {
      const facultyId = req.user.id;
      if (!facultyId) return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Faculty record not found.');
      const { query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;
      if (!query) return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Search query required');
      const results = await papersService.searchPapers(facultyId, query, skip, pageSize);
      sendResponse(res, HTTP_STATUS.OK, results, 'Search results retrieved successfully');
    } catch (error) {
      if (error.statusCode) sendErrorResponse(res, error.statusCode, error.message);
      else sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}

export const papersController = new PapersController();
