import express from 'express';
import {
  validateAndAnalyzeData,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysisById,
} from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), validateAndAnalyzeData);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysisById);

export default router;
