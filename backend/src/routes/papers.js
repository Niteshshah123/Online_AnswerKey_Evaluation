import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { papersController } from '../controllers/papers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/filters', (req, res) => papersController.getPaperFilters(req, res));
router.get('/', (req, res) => papersController.getAssignedPapers(req, res));
router.get('/search', (req, res) => papersController.searchPapers(req, res));
router.get('/:id', (req, res) => papersController.getPaperDetails(req, res));

export default router;
