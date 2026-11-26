import { performCryptanalysis } from '../services/cryptanalysis.service.js';
import { Analysis } from '../models/Analysis.js';
import fs from 'fs';

export const runCryptanalysis = async (req, res) => {
  try {
    const { ciphertext, analysisType, sampleName = 'Ciphertext Investigation' } = req.body;
    let inputContent = '';

    if (req.file) {
      inputContent = fs.readFileSync(req.file.path);
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    } else if (ciphertext && ciphertext.trim().length > 0) {
      inputContent = ciphertext.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide ciphertext string or upload an encrypted file to run cryptanalysis.',
      });
    }

    const results = performCryptanalysis(inputContent);

    // Save record to DB for user's audit trail
    try {
      await Analysis.create({
        userId: req.user._id,
        inputType: req.file ? 'File' : 'Ciphertext',
        sampleName,
        inputSize: results.inputSize,
        algorithm: results.detectedAlgorithm,
        detectedCipherFamily: results.detectedCipherFamily,
        entropy: results.entropy,
        chiSquareScore: results.chiSquareScore,
        indexCoincidence: results.ioc,
        characterFrequency: results.characterFrequency,
        patternAnalysis: results.patternAnalysis,
        securityScore: results.securityScore,
        riskLevel: results.riskLevel,
        vulnerabilities: results.vulnerabilities,
        recommendations: results.recommendations,
        metadata: {
          analysisType: analysisType || 'Full Suite',
          analysisDurationMs: results.analysisDurationMs,
        },
      });
    } catch {
      // In-memory / graceful
    }

    return res.status(200).json({
      success: true,
      message: 'Cryptanalysis completed successfully',
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Cryptanalysis failed to execute',
      error: error.message,
    });
  }
};
