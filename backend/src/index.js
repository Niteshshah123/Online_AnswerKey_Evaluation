import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import logger from './config/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import papersRoutes from './routes/papers.js';
import evaluationRoutes from './routes/evaluation.js';
import answerKeyRoutes from './routes/answerKey.js';
import adminRoutes from './routes/admin.js';
import { getFirebaseAdmin } from './config/firebase.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
origin: (origin, callback) => {
if (!origin) return callback(null, true);
return callback(null, allowedOrigins.includes(origin));
},
credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message),
  },
}));

// Static assets — PDFs served with CORS so browser can load them directly
app.use('/pdfs', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '..', 'public', 'pdfs')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Initialize Firebase Admin
try { getFirebaseAdmin(); logger.info('Firebase Admin initialized'); }
catch (e) { logger.warn(`Firebase Admin not initialized: ${e.message}`); }

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/papers', papersRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/answer-keys', answerKeyRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const startServer = (port = config.port) => {
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${config.nodeEnv} mode`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = port + 1;
      logger.warn(`Port ${port} is busy. Trying ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    logger.error(error);
    process.exit(1);
  });
};

startServer();

export default app;
