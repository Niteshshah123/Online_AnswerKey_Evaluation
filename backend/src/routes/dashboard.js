import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { dashboardController } from '../controllers/dashboard.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', (req, res) => dashboardController.getStats(req, res));

export default router;
