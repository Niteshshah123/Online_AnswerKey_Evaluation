import prisma from '../config/database.js';

export class FacultyRepository {
  async findByEmail(email) {
    return prisma.faculty.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return prisma.faculty.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
        specialization: true,
        phone: true,
      },
    });
  }

  async create(data) {
    return prisma.faculty.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
      },
    });
  }
}

export class StudentRepository {
  async findByRollNumber(rollNumber) {
    return prisma.student.findUnique({
      where: { rollNumber },
    });
  }

  async findById(id) {
    return prisma.student.findUnique({
      where: { id },
    });
  }
}

export class AnswerSheetRepository {
  async findByFacultyId(facultyId, skip = 0, take = 10) {
    return prisma.answerSheet.findMany({
      where: { facultyId },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        exam: {
          include: {
            subject: true,
          },
        },
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByFacultyId(facultyId) {
    return prisma.answerSheet.count({
      where: { facultyId },
    });
  }

  async countByFacultyIdAndStatus(facultyId, status) {
    return prisma.answerSheet.count({
      where: { facultyId, status },
    });
  }

  async findById(id) {
    return prisma.answerSheet.findUnique({
      where: { id },
      include: {
        student: true,
        exam: {
          include: {
            subject: true,
            questions: {
              orderBy: { questionNumber: 'asc' },
            },
          },
        },
        faculty: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        evaluation: {
          include: {
            marks: {
              include: {
                question: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id, status) {
    return prisma.answerSheet.update({
      where: { id },
      data: { status },
    });
  }

  async searchByRollOrName(facultyId, query, skip = 0, take = 10) {
    return prisma.answerSheet.findMany({
      where: {
        facultyId,
        OR: [
          { student: { rollNumber: { contains: query } } },
          { student: { firstName: { contains: query } } },
          { student: { lastName: { contains: query } } },
        ],
      },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            firstName: true,
            lastName: true,
          },
        },
        exam: {
          include: {
            subject: true,
          },
        },
      },
      skip,
      take,
    });
  }
}

export class EvaluationRepository {
  async findByAnswerSheetId(answerSheetId) {
    return prisma.evaluation.findUnique({
      where: { answerSheetId },
      include: {
        marks: {
          include: {
            question: true,
          },
          orderBy: {
            question: {
              questionNumber: 'asc',
            },
          },
        },
      },
    });
  }

  async create(data) {
    return prisma.evaluation.create({
      data,
      include: {
        marks: true,
      },
    });
  }

  async update(id, data) {
    return prisma.evaluation.update({
      where: { id },
      data,
    });
  }

  async findById(id) {
    return prisma.evaluation.findUnique({
      where: { id },
      include: {
        marks: {
          include: {
            question: true,
          },
        },
      },
    });
  }
}

export class MarkRepository {
  async upsertMark(evaluationId, questionId, obtainedMarks, convertedMarks) {
    return prisma.mark.upsert({
      where: {
        evaluationId_questionId: {
          evaluationId,
          questionId,
        },
      },
      update: {
        obtainedMarks,
        convertedMarks,
      },
      create: {
        evaluationId,
        questionId,
        obtainedMarks,
        convertedMarks,
      },
    });
  }

  async findByEvaluationId(evaluationId) {
    return prisma.mark.findMany({
      where: { evaluationId },
      include: {
        question: true,
      },
    });
  }
}
