import { Analysis } from '../models/Analysis.js';
import { performCryptanalysis } from '../services/cryptanalysis.service.js';
import fs from 'fs';

// In-memory cache for fallback when MongoDB is running in demo/offline mode
let memoryAnalyses = [];

export const validateAndAnalyzeData = async (req, res) => {
  try {
    const { plaintext, ciphertext, algorithm, keySize, mode, iv, key } = req.body;
    let inputContent = '';
    let inputType = 'Plaintext';
    let sampleName = 'Manual Input';
    let fileMeta = null;

    if (req.file) {
      inputContent = fs.readFileSync(req.file.path);
      inputType = 'File';
      sampleName = req.file.originalname;
      fileMeta = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
      };
      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    } else if (ciphertext && ciphertext.trim().length > 0) {
      inputContent = ciphertext.trim();
      inputType = 'Ciphertext';
      sampleName = 'Ciphertext Sample';
    } else if (plaintext && plaintext.trim().length > 0) {
      inputContent = plaintext.trim();
      inputType = 'Plaintext';
      sampleName = 'Plaintext Sample';
    } else {
      return res.status(400).json({
        success: false,
        message: 'No input provided. Please provide Plaintext, Ciphertext, or upload a File.',
      });
    }

    // Execute statistical and vulnerability analysis
    const result = performCryptanalysis(inputContent, { algorithm, keySize, mode });

    const analysisData = {
      userId: req.user._id,
      inputType,
      sampleName,
      inputSize: result.inputSize,
      algorithm: algorithm || result.detectedAlgorithm,
      detectedCipherFamily: result.detectedCipherFamily,
      keySize: keySize || (algorithm?.includes('128') ? '128-bit' : '256-bit'),
      mode: mode || 'CBC',
      entropy: result.entropy,
      chiSquareScore: result.chiSquareScore,
      indexCoincidence: result.ioc,
      characterFrequency: result.characterFrequency,
      patternAnalysis: result.patternAnalysis,
      securityScore: result.securityScore,
      riskLevel: result.riskLevel,
      vulnerabilities: result.vulnerabilities,
      recommendations: result.recommendations,
      metadata: {
        ...(fileMeta || {}),
        analysisDurationMs: result.analysisDurationMs,
      },
    };

    let savedAnalysis;
    try {
      savedAnalysis = await Analysis.create(analysisData);
    } catch {
      savedAnalysis = {
        _id: 'an_' + Date.now(),
        ...analysisData,
        createdAt: new Date(),
      };
      memoryAnalyses.unshift(savedAnalysis);
    }

    return res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: savedAnalysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Analysis processing failed',
      error: error.message,
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const { search, algorithm, riskLevel, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (algorithm && algorithm !== 'All') {
      query.algorithm = new RegExp(algorithm, 'i');
    }
    if (riskLevel && riskLevel !== 'All') {
      query.riskLevel = riskLevel;
    }
    if (search) {
      query.$or = [
        { sampleName: new RegExp(search, 'i') },
        { algorithm: new RegExp(search, 'i') },
        { inputType: new RegExp(search, 'i') },
      ];
    }

    let items;
    let total = 0;

    try {
      total = await Analysis.countDocuments(query);
      items = await Analysis.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    } catch {
      items = memoryAnalyses.filter((a) => String(a.userId) === String(req.user._id));
      total = items.length;
    }

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve analysis history', error: error.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    let item;
    try {
      item = await Analysis.findById(id);
    } catch {
      item = memoryAnalyses.find((a) => String(a._id) === String(id));
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analysis', error: error.message });
  }
};

export const deleteAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Analysis.findByIdAndDelete(id);
    } catch {
      memoryAnalyses = memoryAnalyses.filter((a) => String(a._id) !== String(id));
    }
    return res.status(200).json({ success: true, message: 'Analysis record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete analysis', error: error.message });
  }
};
