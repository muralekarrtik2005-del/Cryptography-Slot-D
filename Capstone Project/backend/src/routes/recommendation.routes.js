import express from 'express';
import { getAIRecommendation, getRecommendationHistory } from '../controllers/recommendation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/recommend', getAIRecommendation);
router.get('/history', getRecommendationHistory);

export default router;
