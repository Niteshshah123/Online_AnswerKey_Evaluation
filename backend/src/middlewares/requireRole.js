import { sendErrorResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';

// Usage: requireRole('admin') or requireRole('admin', 'teacher')
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendErrorResponse(res, HTTP_STATUS.FORBIDDEN, 'Insufficient permissions.');
  }
  next();
};

export default requireRole;
