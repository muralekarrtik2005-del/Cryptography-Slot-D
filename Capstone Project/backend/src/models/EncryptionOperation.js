import mongoose from 'mongoose';

const encryptionOperationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    operation: {
      type: String,
      enum: ['encrypt', 'decrypt'],
      required: true,
    },
    algorithm: {
      type: String,
      required: true,
    },
    keySize: {
      type: String,
      default: '256-bit',
    },
    mode: {
      type: String,
      default: 'CBC',
    },
    inputLength: {
      type: Number,
      required: true,
    },
    outputLength: {
      type: Number,
      required: true,
    },
    executionTimeMs: {
      type: Number,
      required: true,
    },
    success: {
      type: Boolean,
      default: true,
    },
    // Note: NEVER store plaintext or raw keys in the database for security compliance
  },
  {
    timestamps: true,
  }
);

export const EncryptionOperation = mongoose.model(
  'EncryptionOperation',
  encryptionOperationSchema
);
