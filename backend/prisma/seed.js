import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/index.js';

const main = async () => {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.mark.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.answerSheet.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();

  // Create Faculty
  const faculty = await prisma.faculty.create({
    data: {
      email: 'faculty@college.edu',
      password: await hashPassword('password123'),
      firstName: 'Dr.',
      lastName: 'Smith',
      department: 'Computer Science',
      specialization: 'Data Structures',
      phone: '+91-9876543210',
    },
  });

  console.log('Created faculty:', faculty);

  // Create Students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        rollNumber: 'CS2024001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@college.edu',
        phone: '+91-9000000001',
      },
    }),
    prisma.student.create({
      data: {
        rollNumber: 'CS2024002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@college.edu',
        phone: '+91-9000000002',
      },
    }),
    prisma.student.create({
      data: {
        rollNumber: 'CS2024003',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@college.edu',
        phone: '+91-9000000003',
      },
    }),
  ]);

  console.log('Created students:', students.length);

  // Create Course
  const course = await prisma.course.create({
    data: {
      code: 'CS101',
      name: 'Data Structures and Algorithms',
      credits: 4,
      description: 'Fundamental concepts of data structures and algorithms',
    },
  });

  console.log('Created course:', course);

  // Create Subject
  const subject = await prisma.subject.create({
    data: {
      code: 'CS101',
      name: 'Data Structures and Algorithms',
      courseId: course.id,
      maxMarks: 50,
      targetMarks: 30,
    },
  });

  console.log('Created subject:', subject);

  // Create Exam
  const exam = await prisma.exam.create({
    data: {
      code: 'CS101-MID-2024',
      name: 'Mid Semester Examination - 2024',
      subjectId: subject.id,
      date: new Date('2024-03-15'),
      duration: 120,
      totalMarks: 50,
    },
  });

  console.log('Created exam:', exam);

  // Create Questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        examId: exam.id,
        subjectId: subject.id,
        questionNumber: 1,
        maxMarks: 5,
      },
    }),
    prisma.question.create({
      data: {
        examId: exam.id,
        subjectId: subject.id,
        questionNumber: 2,
        maxMarks: 10,
      },
    }),
    prisma.question.create({
      data: {
        examId: exam.id,
        subjectId: subject.id,
        questionNumber: 3,
        maxMarks: 15,
      },
    }),
    prisma.question.create({
      data: {
        examId: exam.id,
        subjectId: subject.id,
        questionNumber: 4,
        maxMarks: 20,
      },
    }),
  ]);

  console.log('Created questions:', questions.length);

  // Create Answer Sheets
  const answerSheets = await Promise.all([
    prisma.answerSheet.create({
      data: {
        examId: exam.id,
        studentId: students[0].id,
        facultyId: faculty.id,
        studentAnswerSheetUrl: '/pdfs/student_answer_1.pdf',
        answerKeyUrl: '/pdfs/answer_key_1.pdf',
        status: 'ASSIGNED',
      },
    }),
    prisma.answerSheet.create({
      data: {
        examId: exam.id,
        studentId: students[1].id,
        facultyId: faculty.id,
        studentAnswerSheetUrl: '/pdfs/student_answer_2.pdf',
        answerKeyUrl: '/pdfs/answer_key_2.pdf',
        status: 'ASSIGNED',
      },
    }),
    prisma.answerSheet.create({
      data: {
        examId: exam.id,
        studentId: students[2].id,
        facultyId: faculty.id,
        studentAnswerSheetUrl: '/pdfs/student_answer_3.pdf',
        answerKeyUrl: '/pdfs/answer_key_3.pdf',
        status: 'COMPLETED',
      },
    }),
  ]);

  console.log('Created answer sheets:', answerSheets.length);

  // Create Evaluation for completed paper
  const evaluation = await prisma.evaluation.create({
    data: {
      answerSheetId: answerSheets[2].id,
      status: 'SUBMITTED',
      totalObtainedMarks: 38,
      totalConvertedMarks: 22.8,
      remarks: 'Good understanding of concepts',
    },
  });

  console.log('Created evaluation:', evaluation);

  // Create Marks for completed evaluation
  const marks = await Promise.all([
    prisma.mark.create({
      data: {
        evaluationId: evaluation.id,
        questionId: questions[0].id,
        obtainedMarks: 5,
        convertedMarks: 3,
      },
    }),
    prisma.mark.create({
      data: {
        evaluationId: evaluation.id,
        questionId: questions[1].id,
        obtainedMarks: 8,
        convertedMarks: 4.8,
      },
    }),
    prisma.mark.create({
      data: {
        evaluationId: evaluation.id,
        questionId: questions[2].id,
        obtainedMarks: 10,
        convertedMarks: 6,
      },
    }),
    prisma.mark.create({
      data: {
        evaluationId: evaluation.id,
        questionId: questions[3].id,
        obtainedMarks: 15,
        convertedMarks: 9,
      },
    }),
  ]);

  console.log('Created marks:', marks.length);

  console.log('Database seeding completed successfully!');
};

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
