import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    inputs: {
      dataSensitivity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true,
      },
      dataType: {
        type: String,
        enum: ['Text', 'File', 'Database', 'Communication'],
        required: true,
      },
      requiredSecurityLevel: {
        type: String,
        enum: ['Standard', 'Enhanced', 'Military/Top-Secret', 'Post-Quantum Prepared'],
        required: true,
      },
      performancePriority: {
        type: String,
        enum: ['Maximum Throughput', 'Balanced', 'Maximum Security', 'Low Resource / IoT'],
        required: true,
      },
      keySizePreference: {
        type: String,
        enum: ['128-bit', '256-bit', '2048-bit (Asymmetric)', '4096-bit (Asymmetric)', 'Auto'],
        required: true,
      },
    },
    recommendationScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    recommendedAlgorithm: {
      name: { type: String, required: true },
      keySize: { type: String, required: true },
      securityLevel: { type: String, required: true },
      performanceRating: { type: String, required: true },
      recommendedMode: { type: String, default: 'GCM or CBC with HMAC' },
    },
    explanation: {
      type: String,
      required: true,
    },
    alternatives: [
      {
        name: { type: String, required: true },
        securityLevel: { type: String, required: true },
        keySize: { type: String, required: true },
        performance: { type: String, required: true },
        recommendedUseCase: { type: String, required: true },
        riskLevel: { type: String, required: true },
        matchScore: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Recommendation = mongoose.model(
  'Recommendation',
  recommendationSchema
);
