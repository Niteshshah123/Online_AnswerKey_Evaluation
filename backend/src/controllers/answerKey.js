import prisma from '../config/database.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';

export class AnswerKeyController {
  async getExams(req, res) {
    try {
      const exams = await prisma.exam.findMany({
        include: { subject: true },
        orderBy: { createdAt: 'desc' },
      });
      sendResponse(res, HTTP_STATUS.OK, exams, 'Exams retrieved successfully');
    } catch (error) {
      sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to fetch exams');
    }
  }

  async uploadAnswerKey(req, res) {
    try {
      const { examId } = req.params;
      if (!req.file) {
        return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'PDF file is required');
      }

      const exam = await prisma.exam.findUnique({ where: { id: examId } });
      if (!exam) {
        return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, 'Exam not found');
      }

      const answerKeyUrl = `/pdfs/${req.file.filename}`;
      const updated = await prisma.exam.update({
        where: { id: examId },
        data: { answerKeyUrl },
        include: { subject: true },
      });

      sendResponse(res, HTTP_STATUS.OK, updated, 'Answer key uploaded successfully');
    } catch (error) {
      sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to upload answer key');
    }
  }
}

export const answerKeyController = new AnswerKeyController();
