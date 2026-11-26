import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';

// Route imports
import authRoutes from './src/routes/auth.routes.js';
import analysisRoutes from './src/routes/analysis.routes.js';
import cryptanalysisRoutes from './src/routes/cryptanalysis.routes.js';
import encryptionRoutes from './src/routes/encryption.routes.js';
import recommendationRoutes from './src/routes/recommendation.routes.js';
import reportRoutes from './src/routes/report.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import userRoutes from './src/routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CLIENT_URL || '*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CipherSense AI-Powered Cryptanalysis Engine',
    version: '1.0.0',
    cryptoEngine: 'Node.js FIPS-ready Crypto Core',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/cryptanalysis', cryptanalysisRoutes);
app.use('/api/encryption', encryptionRoutes);
app.use('/api/ai', recommendationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error caught by global handler]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error in Cryptographic Core',
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🛡️  CipherSense Security Core API running on port ${PORT}`);
  console.log(` 🚀 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
