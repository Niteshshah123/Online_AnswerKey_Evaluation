import { getAuth } from '../config/firebase.js';
import { AdminService } from '../services/index.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';

const adminService = new AdminService();

// ── Firebase User Management ──────────────────────────────────────────────────

export async function createUser(req, res) {
  try {
    const { email, password, displayName, role } = req.body;
    if (!email || !password || !role) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'email, password, and role are required.');
    }
    const validRoles = ['admin', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, `role must be one of: ${validRoles.join(', ')}`);
    }
    const firebaseAuth = getAuth();
    const userRecord = await firebaseAuth.createUser({ email, password, displayName });
    await firebaseAuth.setCustomUserClaims(userRecord.uid, { role });
    // Auto-create Faculty record for teachers
    if (role === 'teacher') {
      await adminService.syncTeacherToFaculty({ email, displayName });
    }
    sendResponse(res, HTTP_STATUS.CREATED, { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName, role }, 'User created successfully.');
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      return sendErrorResponse(res, HTTP_STATUS.CONFLICT, 'A user with this email already exists.');
    }
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function setUserRole(req, res) {
  try {
    const { uid } = req.params;
    const { role } = req.body;
    const validRoles = ['admin', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, `role must be one of: ${validRoles.join(', ')}`);
    }
    await getAuth().setCustomUserClaims(uid, { role });
    sendResponse(res, HTTP_STATUS.OK, { uid, role }, 'Role updated successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function listUsers(req, res) {
  try {
    const result = await getAuth().listUsers(1000);
    const users = result.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.customClaims?.role || 'teacher',
      disabled: u.disabled,
      createdAt: u.metadata.creationTime,
    }));
    sendResponse(res, HTTP_STATUS.OK, { users }, 'Users fetched successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { uid } = req.params;
    await getAuth().deleteUser(uid);
    sendResponse(res, HTTP_STATUS.OK, { uid }, 'User deleted successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

// ── Student Management ────────────────────────────────────────────────────────

export async function listStudents(req, res) {
  try {
    const { department, section, year, semester, page = 1, pageSize = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const result = await adminService.listStudents({ department, section, year, semester, skip, take: parseInt(pageSize) });
    sendResponse(res, HTTP_STATUS.OK, result, 'Students fetched successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function getStudentFilters(req, res) {
  try {
    const filters = await adminService.getStudentFilters();
    sendResponse(res, HTTP_STATUS.OK, filters, 'Filters fetched successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function createStudent(req, res) {
  try {
    const { rollNumber, firstName, lastName, email, phone, department, section, year, semester } = req.body;
    if (!rollNumber || !firstName || !lastName || !email) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'rollNumber, firstName, lastName, and email are required.');
    }
    const student = await adminService.addStudent({ rollNumber, firstName, lastName, email, phone, department, section, year, semester });
    sendResponse(res, HTTP_STATUS.CREATED, student, 'Student added successfully.');
  } catch (err) {
    if (err.statusCode) return sendErrorResponse(res, err.statusCode, err.message);
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await adminService.updateStudent(id, req.body);
    sendResponse(res, HTTP_STATUS.OK, student, 'Student updated successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    await adminService.deleteStudent(id);
    sendResponse(res, HTTP_STATUS.OK, { id }, 'Student deleted successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

// ── Sheet Upload ──────────────────────────────────────────────────────────────

export async function uploadSheet(req, res) {
  try {
    const { studentId, facultyId, examId, answerKeyUrl } = req.body;
    if (!studentId || !facultyId || !examId) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'studentId, facultyId, and examId are required.');
    }
    if (!req.file) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'PDF file is required.');
    }
    const studentAnswerSheetUrl = `/pdfs/${req.file.filename}`;
    const sheet = await adminService.uploadSheet({ studentId, facultyId, examId, studentAnswerSheetUrl, answerKeyUrl });
    sendResponse(res, HTTP_STATUS.CREATED, sheet, 'Answer sheet uploaded and assigned successfully.');
  } catch (err) {
    if (err.statusCode) return sendErrorResponse(res, err.statusCode, err.message);
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function listExams(req, res) {
  try {
    const exams = await adminService.listExams();
    sendResponse(res, HTTP_STATUS.OK, exams, 'Exams fetched successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function listFaculty(req, res) {
  try {
    const faculty = await adminService.listFaculty();
    sendResponse(res, HTTP_STATUS.OK, faculty, 'Faculty fetched successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function syncTeacher(req, res) {
  try {
    const { email, displayName } = req.body;
    if (!email) return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'email is required.');
    const result = await adminService.syncTeacherToFaculty({ email, displayName });
    const msg = result.alreadyExists ? 'Teacher already synced.' : 'Teacher synced to faculty successfully.';
    sendResponse(res, HTTP_STATUS.OK, result.faculty, msg);
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}
