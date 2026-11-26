import {
  encryptData,
  decryptData,
  getAlgorithmBenchmarks,
} from '../services/encryption.service.js';
import { EncryptionOperation } from '../models/EncryptionOperation.js';

export const handleEncrypt = async (req, res) => {
  try {
    const { plaintext, algorithm = 'AES-256', key, mode = 'CBC' } = req.body;

    if (!plaintext || plaintext.trim() === '') {
      return res.status(400).json({ success: false, message: 'Plaintext cannot be empty.' });
    }

    if (!key && !algorithm.toUpperCase().includes('RSA')) {
      return res.status(400).json({ success: false, message: 'Encryption key is required.' });
    }

    const result = encryptData(plaintext, algorithm, key || 'ciphersense-default-key-256', mode);

    // Audit operation without persisting plaintext or key
    try {
      await EncryptionOperation.create({
        userId: req.user._id,
        operation: 'encrypt',
        algorithm: result.algorithm,
        keySize: result.keySize,
        mode: result.mode,
        inputLength: plaintext.length,
        outputLength: result.ciphertext.length,
        executionTimeMs: result.executionTimeMs,
        success: true,
      });
    } catch {
      // Graceful
    }

    return res.status(200).json({
      success: true,
      message: 'Data encrypted successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Encryption failed',
    });
  }
};

export const handleDecrypt = async (req, res) => {
  try {
    const { ciphertext, algorithm = 'AES-256', key, mode = 'CBC' } = req.body;

    if (!ciphertext || ciphertext.trim() === '') {
      return res.status(400).json({ success: false, message: 'Ciphertext cannot be empty.' });
    }

    if (!key) {
      return res.status(400).json({ success: false, message: 'Decryption key / Private Key is required.' });
    }

    const result = decryptData(ciphertext, algorithm, key, mode);

    try {
      await EncryptionOperation.create({
        userId: req.user._id,
        operation: 'decrypt',
        algorithm: result.algorithm,
        inputLength: ciphertext.length,
        outputLength: result.decryptedText.length,
        executionTimeMs: result.executionTimeMs,
        success: true,
      });
    } catch {
      // Graceful
    }

    return res.status(200).json({
      success: true,
      message: 'Data decrypted successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Decryption failed',
    });
  }
};

export const getBenchmarks = async (req, res) => {
  try {
    const benchmarks = getAlgorithmBenchmarks();
    return res.status(200).json({ success: true, data: benchmarks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch benchmarks', error: error.message });
  }
};
