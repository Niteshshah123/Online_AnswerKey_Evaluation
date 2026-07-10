import express from 'express';
import { authController } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
