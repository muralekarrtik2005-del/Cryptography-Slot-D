import { generateRecommendation } from '../services/recommendation.service.js';
import { Recommendation } from '../models/Recommendation.js';

let memoryRecommendations = [];

export const getAIRecommendation = async (req, res) => {
  try {
    const {
      dataSensitivity = 'High',
      dataType = 'Text',
      requiredSecurityLevel = 'Enhanced',
      performancePriority = 'Balanced',
      keySizePreference = 'Auto',
    } = req.body;

    const result = generateRecommendation({
      dataSensitivity,
      dataType,
      requiredSecurityLevel,
      performancePriority,
      keySizePreference,
    });

    let saved;
    try {
      saved = await Recommendation.create({
        userId: req.user._id,
        inputs: {
          dataSensitivity,
          dataType,
          requiredSecurityLevel,
          performancePriority,
          keySizePreference,
        },
        recommendationScore: result.recommendationScore,
        recommendedAlgorithm: result.recommendedAlgorithm,
        explanation: result.explanation,
        alternatives: result.alternatives,
      });
    } catch {
      saved = {
        _id: 'rec_' + Date.now(),
        userId: req.user._id,
        ...result,
        createdAt: new Date(),
      };
      memoryRecommendations.unshift(saved);
    }

    return res.status(200).json({
      success: true,
      message: 'AI Cryptographic Recommendation generated',
      data: result,
      savedId: saved._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate recommendation',
      error: error.message,
    });
  }
};

export const getRecommendationHistory = async (req, res) => {
  try {
    let list;
    try {
      list = await Recommendation.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    } catch {
      list = memoryRecommendations.filter((r) => String(r.userId) === String(req.user._id));
    }
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch recommendations', error: error.message });
  }
};
