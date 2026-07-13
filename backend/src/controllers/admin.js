import { getAuth } from '../config/firebase.js';
import { sendResponse, sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';

// POST /api/admin/users  — create a Firebase user and assign a role
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

    sendResponse(res, HTTP_STATUS.CREATED, {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role,
    }, 'User created successfully.');
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      return sendErrorResponse(res, HTTP_STATUS.CONFLICT, 'A user with this email already exists.');
    }
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}

// PATCH /api/admin/users/:uid/role  — update role of existing user
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

// GET /api/admin/users  — list all Firebase users
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

// DELETE /api/admin/users/:uid
export async function deleteUser(req, res) {
  try {
    const { uid } = req.params;
    await getAuth().deleteUser(uid);
    sendResponse(res, HTTP_STATUS.OK, { uid }, 'User deleted successfully.');
  } catch (err) {
    sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message);
  }
}
