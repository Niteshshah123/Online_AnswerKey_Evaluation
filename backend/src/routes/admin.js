import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import requireRole from '../middlewares/requireRole.js';
import { createUser, setUserRole, listUsers, deleteUser } from '../controllers/admin.js';

const router = express.Router();

// All admin routes require a valid Firebase token + admin role
router.use(authMiddleware, requireRole('admin'));

router.get('/users',            listUsers);
router.post('/users',           createUser);
router.patch('/users/:uid/role', setUserRole);
router.delete('/users/:uid',    deleteUser);

export default router;
