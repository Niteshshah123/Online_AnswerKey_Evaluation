import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middlewares/auth.js';
import { answerKeyController } from '../controllers/answerKey.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/pdfs'));
  },
  filename: (req, file, cb) => {
    const unique = `answerkey_${Date.now()}_${Math.round(Math.random() * 1e9)}.pdf`;
    cb(null, unique);
  },
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
router.use(authMiddleware);

router.get('/', (req, res) => answerKeyController.getExams(req, res));
router.post('/:examId/upload', upload.single('answerKey'), (req, res) => answerKeyController.uploadAnswerKey(req, res));

export default router;
