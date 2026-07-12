import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/index.js";
import { FacultyRepository } from "../repositories/index.js";
import { getAuth } from "../config/firebase.js";

const facultyRepository = new FacultyRepository();

export class AuthService {
  async register(email, password, displayName = "", role = "teacher") {
    const validRoles = ["admin", "teacher", "student"];

    if (!validRoles.includes(role)) {
      throw {
        statusCode: 400,
        message: `Role must be one of: ${validRoles.join(", ")}`,
      };
    }

    const firebaseAuth = getAuth();
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: displayName || undefined,
    });

    await firebaseAuth.setCustomUserClaims(userRecord.uid, { role });

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role,
    };
  }

  async login(email, password) {
    const faculty = await facultyRepository.findByEmail(email);

    if (!faculty) {
      throw {
        statusCode: 401,
        message: "Invalid email or password",
      };
    }

    const isPasswordValid = await comparePassword(password, faculty.password);

    if (!isPasswordValid) {
      throw {
        statusCode: 401,
        message: "Invalid email or password",
      };
    }

    const accessToken = generateAccessToken({
      id: faculty.id,
      email: faculty.email,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
    });

    const refreshToken = generateRefreshToken({
      id: faculty.id,
    });

    return {
      accessToken,
      refreshToken,
      faculty: {
        id: faculty.id,
        email: faculty.email,
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        department: faculty.department,
      },
    };
  }

  async refreshToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw {
        statusCode: 401,
        message: "Invalid refresh token",
      };
    }

    const faculty = await facultyRepository.findById(decoded.id);

    if (!faculty) {
      throw {
        statusCode: 401,
        message: "Faculty not found",
      };
    }

    const newAccessToken = generateAccessToken({
      id: faculty.id,
      email: faculty.email,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
    });

    return {
      accessToken: newAccessToken,
      refreshToken,
    };
  }

  verifyRefreshToken(token) {
    // This would use jwt.verify from utils
    return null;
  }
}

export class DashboardService {
  async getDashboardStats(facultyId) {
    const { AnswerSheetRepository } = await import("../repositories/index.js");
    const repo = new AnswerSheetRepository();

    const total = await repo.countByFacultyId(facultyId);
    const completed = await repo.countByFacultyIdAndStatus(
      facultyId,
      "COMPLETED",
    );
    const assigned = await repo.countByFacultyIdAndStatus(
      facultyId,
      "ASSIGNED",
    );
    const inProgress = await repo.countByFacultyIdAndStatus(
      facultyId,
      "IN_PROGRESS",
    );

    return {
      totalPapers: total,
      completedPapers: completed,
      assignedPapers: assigned,
      inProgressPapers: inProgress,
      pendingPapers: total - completed,
    };
  }
}

export class PapersService {
  async getAssignedPapers(facultyId, skip = 0, take = 10) {
    const { AnswerSheetRepository } = await import("../repositories/index.js");
    const repo = new AnswerSheetRepository();

    const papers = await repo.findByFacultyId(facultyId, skip, take);
    const total = await repo.countByFacultyId(facultyId);

    return {
      data: papers.map((paper) => ({
        id: paper.id,
        rollNumber: paper.student.rollNumber,
        studentName: `${paper.student.firstName} ${paper.student.lastName}`,
        subject: paper.exam.subject.name,
        status: paper.status,
        examCode: paper.exam.code,
        date: paper.exam.date,
      })),
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getPaperDetails(paperId) {
    const { AnswerSheetRepository } = await import("../repositories/index.js");
    const repo = new AnswerSheetRepository();
    const paper = await repo.findById(paperId);
    if (!paper) {
      throw { statusCode: 404, message: "Paper not found" };
    }
    return {
      id: paper.id,
      student: {
        rollNumber: paper.student.rollNumber,
        firstName: paper.student.firstName,
        lastName: paper.student.lastName,
        email: paper.student.email,
      },
      exam: {
        id: paper.exam.id,
        code: paper.exam.code,
        name: paper.exam.name,
        totalMarks: paper.exam.totalMarks,
        duration: paper.exam.duration,
        date: paper.exam.date,
        answerKeyUrl: paper.exam.answerKeyUrl,
      },
      subject: {
        code: paper.exam.subject.code,
        name: paper.exam.subject.name,
        maxMarks: paper.exam.subject.maxMarks,
        targetMarks: paper.exam.subject.targetMarks,
      },
      answerSheetUrl: paper.studentAnswerSheetUrl,
      answerKeyUrl: paper.exam.answerKeyUrl || paper.answerKeyUrl,
      status: paper.status,
      questions: paper.exam.questions.map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        maxMarks: q.maxMarks,
      })),
      evaluation: paper.evaluation
        ? {
            id: paper.evaluation.id,
            status: paper.evaluation.status,
            totalObtainedMarks: paper.evaluation.totalObtainedMarks,
            totalConvertedMarks: paper.evaluation.totalConvertedMarks,
            targetMarks: paper.evaluation.targetMarks,
            remarks: paper.evaluation.remarks,
            marks: paper.evaluation.marks.map((m) => ({
              questionId: m.questionId,
              obtainedMarks: m.obtainedMarks,
              convertedMarks: m.convertedMarks,
            })),
          }
        : null,
    };
  }

  async searchPapers(facultyId, query, skip = 0, take = 10) {
    const { AnswerSheetRepository } = await import("../repositories/index.js");
    const repo = new AnswerSheetRepository();

    const papers = await repo.searchByRollOrName(facultyId, query, skip, take);

    return papers.map((paper) => ({
      id: paper.id,
      rollNumber: paper.student.rollNumber,
      studentName: `${paper.student.firstName} ${paper.student.lastName}`,
      subject: paper.exam.subject.name,
      status: paper.status,
    }));
  }
}

export class EvaluationService {
  async getEvaluation(answersheetId) {
    const { EvaluationRepository } = await import("../repositories/index.js");
    const repo = new EvaluationRepository();
    const evaluation = await repo.findByAnswerSheetId(answersheetId);
    if (!evaluation) {
      throw { statusCode: 404, message: "Evaluation not found" };
    }
    return evaluation;
  }

  async saveEvaluationDraft(
    answersheetId,
    marks,
    remarks = "",
    targetMarks = 0,
  ) {
    const { AnswerSheetRepository, EvaluationRepository, MarkRepository } =
      await import("../repositories/index.js");
    const answerSheetRepo = new AnswerSheetRepository();
    const evaluationRepo = new EvaluationRepository();
    const markRepo = new MarkRepository();
    const { convertMarks } = await import("../utils/index.js");

    const answerSheet = await answerSheetRepo.findById(answersheetId);
    if (!answerSheet) {
      throw { statusCode: 404, message: "Answer sheet not found" };
    }

    let evaluation = await evaluationRepo.findByAnswerSheetId(answersheetId);
    if (!evaluation) {
      evaluation = await evaluationRepo.create({
        answerSheetId: answersheetId,
        status: "DRAFT",
      });
    }

    let totalObtained = 0;
    const maxMarksTotal = answerSheet.exam.totalMarks;

    for (const mark of marks) {
      const question = answerSheet.exam.questions.find(
        (q) => q.id === mark.questionId,
      );
      if (!question)
        throw {
          statusCode: 400,
          message: `Question ${mark.questionId} not found`,
        };
      if (mark.obtainedMarks > question.maxMarks)
        throw {
          statusCode: 400,
          message: `Marks for Q${question.questionNumber} cannot exceed ${question.maxMarks}`,
        };
      if (mark.obtainedMarks < 0)
        throw {
          statusCode: 400,
          message: `Marks for Q${question.questionNumber} cannot be negative`,
        };

      await markRepo.upsertMark(
        evaluation.id,
        mark.questionId,
        mark.obtainedMarks,
        0,
      );
      totalObtained += mark.obtainedMarks;
    }

    const totalConverted =
      targetMarks > 0
        ? convertMarks(totalObtained, maxMarksTotal, targetMarks)
        : 0;

    await evaluationRepo.update(evaluation.id, {
      totalObtainedMarks: totalObtained,
      totalConvertedMarks: Math.round(totalConverted * 100) / 100,
      targetMarks: targetMarks || 0,
      remarks,
    });

    await answerSheetRepo.updateStatus(answersheetId, "IN_PROGRESS");

    return {
      id: evaluation.id,
      totalObtainedMarks: totalObtained,
      totalConvertedMarks: Math.round(totalConverted * 100) / 100,
      targetMarks: targetMarks || 0,
      maxMarks: maxMarksTotal,
    };
  }

  async submitEvaluation(answersheetId, marks, remarks = "", targetMarks = 0) {
    const { AnswerSheetRepository, EvaluationRepository } =
      await import("../repositories/index.js");
    const answerSheetRepo = new AnswerSheetRepository();
    const evaluationRepo = new EvaluationRepository();

    const result = await this.saveEvaluationDraft(
      answersheetId,
      marks,
      remarks,
      targetMarks,
    );
    const evaluation = await evaluationRepo.findByAnswerSheetId(answersheetId);

    await evaluationRepo.update(evaluation.id, { status: "SUBMITTED" });
    await answerSheetRepo.updateStatus(answersheetId, "COMPLETED");

    return result;
  }
}
