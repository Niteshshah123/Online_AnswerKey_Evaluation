import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/index.js';

const main = async () => {
  console.log('Starting database seeding (safe — skips existing records)...');

  // Faculty — only create if no faculty exists at all
  const facultyCount = await prisma.faculty.count();
  let faculty;
  if (facultyCount === 0) {
    faculty = await prisma.faculty.create({
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
    console.log('Created default faculty:', faculty.email);
  } else {
    faculty = await prisma.faculty.findFirst();
    console.log(`Skipped faculty seed — ${facultyCount} faculty record(s) already exist.`);
  }

  // Course
  let course = await prisma.course.findUnique({ where: { code: 'CS101' } });
  if (!course) {
    course = await prisma.course.create({
      data: { code: 'CS101', name: 'Data Structures and Algorithms', credits: 4, description: 'Fundamental concepts of data structures and algorithms' },
    });
    console.log('Created course:', course.code);
  } else {
    console.log('Skipped course — already exists.');
  }

  // Subject
  let subject = await prisma.subject.findUnique({ where: { code: 'CS101' } });
  if (!subject) {
    subject = await prisma.subject.create({
      data: { code: 'CS101', name: 'Data Structures and Algorithms', courseId: course.id, maxMarks: 50, targetMarks: 30 },
    });
    console.log('Created subject:', subject.code);
  } else {
    console.log('Skipped subject — already exists.');
  }

  // Exam
  let exam = await prisma.exam.findUnique({ where: { code: 'CS101-MID-2024' } });
  if (!exam) {
    exam = await prisma.exam.create({
      data: { code: 'CS101-MID-2024', name: 'Mid Semester Examination - 2024', subjectId: subject.id, date: new Date('2024-03-15'), duration: 120, totalMarks: 50 },
    });
    console.log('Created exam:', exam.code);
  } else {
    console.log('Skipped exam — already exists.');
  }

  // Questions — only if exam has none
  const qCount = await prisma.question.count({ where: { examId: exam.id } });
  if (qCount === 0) {
    await Promise.all([
      prisma.question.create({ data: { examId: exam.id, subjectId: subject.id, questionNumber: 1, maxMarks: 5 } }),
      prisma.question.create({ data: { examId: exam.id, subjectId: subject.id, questionNumber: 2, maxMarks: 10 } }),
      prisma.question.create({ data: { examId: exam.id, subjectId: subject.id, questionNumber: 3, maxMarks: 15 } }),
      prisma.question.create({ data: { examId: exam.id, subjectId: subject.id, questionNumber: 4, maxMarks: 20 } }),
    ]);
    console.log('Created 4 questions.');
  } else {
    console.log(`Skipped questions — ${qCount} already exist.`);
  }

  console.log('Database seeding completed safely!');
};

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
