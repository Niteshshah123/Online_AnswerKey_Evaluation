import { getAuth } from '../config/firebase.js';
import prisma from '../config/database.js';
import { sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return sendErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const decoded = await getAuth().verifyIdToken(token);
    const role = decoded.role || 'teacher';

    // For teacher role, look up the Faculty record to get the DB id
    let dbId = null;
    if (role === 'teacher') {
      const faculty = await prisma.faculty.findUnique({ where: { email: decoded.email }, select: { id: true } });
      dbId = faculty?.id || null;
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role,
      id: dbId, // MongoDB Faculty id (null for admin/student)
    };
    next();
  } catch {
    sendErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }
};

export default authMiddleware;
