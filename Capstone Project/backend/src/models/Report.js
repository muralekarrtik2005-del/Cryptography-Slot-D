import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: false,
    },
    reportTitle: {
      type: String,
      required: true,
      default: 'Cryptographic Security Assessment Report',
    },
    reportNumber: {
      type: String,
      unique: true,
      required: true,
    },
    reportData: {
      clientInfo: {
        assessorName: String,
        organization: String,
        targetSystem: String,
      },
      summary: {
        overallScore: Number,
        riskLevel: String,
        criticalVulnerabilitiesCount: Number,
        highVulnerabilitiesCount: Number,
        entropyScore: Number,
      },
      technicalDetails: {
        algorithm: String,
        keySize: String,
        mode: String,
        detectedCipherFamily: String,
        entropy: Number,
        predictabilityScore: Number,
      },
      vulnerabilities: [
        {
          title: String,
          severity: String,
          description: String,
          remediation: String,
          cwe: String,
        },
      ],
      aiRecommendations: {
        primaryAlgorithm: String,
        recommendedKeySize: String,
        rationale: String,
        alternatives: [
          {
            name: String,
            suitabilityScore: Number,
            pros: String,
            cons: String,
          },
        ],
      },
      actionPlan: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model('Report', reportSchema);
