import express from 'express';
import { runCryptanalysis } from '../controllers/cryptanalysis.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), runCryptanalysis);

export default router;
