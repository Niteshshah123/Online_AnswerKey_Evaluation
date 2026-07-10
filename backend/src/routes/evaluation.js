import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { evaluationController } from '../controllers/evaluation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:answerSheetId', (req, res) => evaluationController.getEvaluation(req, res));
router.post('/:answerSheetId/draft', (req, res) => evaluationController.saveDraft(req, res));
router.post('/:answerSheetId/submit', (req, res) => evaluationController.submitEvaluation(req, res));

export default router;
