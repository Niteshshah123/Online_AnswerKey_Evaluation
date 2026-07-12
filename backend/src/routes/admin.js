import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middlewares/auth.js';
import requireRole from '../middlewares/requireRole.js';
import {
  createUser, setUserRole, listUsers, deleteUser,
  listStudents, getStudentFilters, createStudent, updateStudent, deleteStudent,
  uploadSheet, listExams, listFaculty, syncTeacher,
} from '../controllers/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../public/pdfs')),
  filename: (req, file, cb) => cb(null, `sheet_${Date.now()}_${Math.round(Math.random() * 1e9)}.pdf`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = express.Router();
router.use(authMiddleware, requireRole('admin'));

// Firebase user management
router.get('/users',              listUsers);
router.post('/users',             createUser);
router.patch('/users/:uid/role',  setUserRole);
router.delete('/users/:uid',      deleteUser);

// Student management
router.get('/students/filters',   getStudentFilters);
router.get('/students',           listStudents);
router.post('/students',          createStudent);
router.patch('/students/:id',     updateStudent);
router.delete('/students/:id',    deleteStudent);

// Sheet upload & supporting data
router.get('/exams',              listExams);
router.get('/faculty',            listFaculty);
router.post('/faculty/sync',      syncTeacher);
router.post('/upload-sheet',      upload.single('answerSheet'), uploadSheet);

export default router;
