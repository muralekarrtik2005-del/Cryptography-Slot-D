import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  downloadPdfReport,
  exportJsonReport,
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.get('/:id/pdf', downloadPdfReport);
router.get('/:id/json', exportJsonReport);

export default router;
