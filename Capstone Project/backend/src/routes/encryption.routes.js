import express from 'express';
import { handleEncrypt, handleDecrypt, getBenchmarks } from '../controllers/encryption.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/encrypt', handleEncrypt);
router.post('/decrypt', handleDecrypt);
router.get('/benchmarks', getBenchmarks);

export default router;
