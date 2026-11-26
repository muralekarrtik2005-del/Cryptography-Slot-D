import mongoose from 'mongoose';

const vulnerabilitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  description: { type: String, required: true },
  cwe: { type: String, default: 'CWE-326' },
  remediation: { type: String, required: true },
});

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    inputType: {
      type: String,
      enum: ['Plaintext', 'Ciphertext', 'File', 'Hex', 'Base64'],
      required: true,
    },
    sampleName: {
      type: String,
      default: 'Input Sample',
    },
    inputSize: {
      type: Number, // in bytes
      default: 0,
    },
    algorithm: {
      type: String,
      default: 'Unknown',
    },
    detectedCipherFamily: {
      type: String,
      default: 'Block Cipher / Unknown',
    },
    keySize: {
      type: String,
      default: 'N/A',
    },
    mode: {
      type: String,
      default: 'N/A',
    },
    entropy: {
      type: Number,
      required: true,
    },
    chiSquareScore: {
      type: Number,
      default: 0,
    },
    indexCoincidence: {
      type: Number,
      default: 0,
    },
    characterFrequency: [
      {
        char: String,
        count: Number,
        percentage: Number,
      },
    ],
    patternAnalysis: {
      repeatedSequences: { type: Number, default: 0 },
      predictabilityScore: { type: Number, default: 0 }, // 0 - 100
      blockAlignmentDetected: { type: Boolean, default: false },
      nullByteRatio: { type: Number, default: 0 },
      isHexOrBase64: { type: Boolean, default: false },
    },
    securityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    vulnerabilities: [vulnerabilitySchema],
    recommendations: [
      {
        title: String,
        description: String,
        priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'] },
      },
    ],
    metadata: {
      fileName: String,
      fileType: String,
      analysisDurationMs: Number,
    },
    status: {
      type: String,
      enum: ['Completed', 'Flagged', 'Archived'],
      default: 'Completed',
    },
  },
  {
    timestamps: true,
  }
);

export const Analysis = mongoose.model('Analysis', analysisSchema);
