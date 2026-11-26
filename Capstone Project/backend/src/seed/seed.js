import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Analysis } from '../models/Analysis.js';
import { EncryptionOperation } from '../models/EncryptionOperation.js';
import { Report } from '../models/Report.js';
import { Recommendation } from '../models/Recommendation.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ciphersense';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Analysis.deleteMany({}),
      EncryptionOperation.deleteMany({}),
      Report.deleteMany({}),
      Recommendation.deleteMany({}),
    ]);

    // Create Analyst User
    const user = await User.create({
      name: 'Lead Cryptanalyst',
      email: 'analyst@ciphersense.io',
      passwordHash: 'CyberSec2026!',
      role: 'analyst',
      preferences: {
        theme: 'dark',
        notifications: true,
        defaultAlgorithm: 'AES-256',
        autoAnalysis: true,
      },
    });

    console.log(`[Seed] Created User: ${user.email}`);

    // Create Sample Analyses
    const sampleAnalyses = [
      {
        userId: user._id,
        inputType: 'Ciphertext',
        sampleName: 'Banking_Payload_CBC.enc',
        inputSize: 24800,
        algorithm: 'AES-256-CBC',
        detectedCipherFamily: 'Block Cipher (Rijndael)',
        keySize: '256-bit',
        mode: 'CBC',
        entropy: 7.94,
        chiSquareScore: 248.5,
        indexCoincidence: 0.0039,
        securityScore: 92,
        riskLevel: 'Low',
        vulnerabilities: [],
        recommendations: [
          {
            title: 'Transition to AES-GCM for Authenticated Encryption',
            description: 'Provide cryptographic integrity guarantees alongside confidentiality to defeat chosen-ciphertext attacks.',
            priority: 'Low',
          },
        ],
        status: 'Completed',
      },
      {
        userId: user._id,
        inputType: 'File',
        sampleName: 'legacy_transaction_ecb.dat',
        inputSize: 8192,
        algorithm: 'DES-ECB (Legacy)',
        detectedCipherFamily: 'Electronic Codebook (ECB)',
        keySize: '56-bit',
        mode: 'ECB',
        entropy: 6.12,
        chiSquareScore: 1240.2,
        indexCoincidence: 0.0215,
        securityScore: 35,
        riskLevel: 'Critical',
        vulnerabilities: [
          {
            title: 'Electronic Codebook (ECB) Mode Pattern Leakage',
            severity: 'Critical',
            description: 'Identical plaintext blocks map to identical ciphertext blocks, exposing data structures to statistical visual cryptanalysis.',
            cwe: 'CWE-327',
            remediation: 'Replace ECB mode with AES-256-GCM authenticated cipher mode immediately.',
          },
          {
            title: 'Deprecated 56-bit Key Length (DES)',
            severity: 'Critical',
            description: '56-bit key space can be brute-forced in hours with commodity GPU clusters.',
            cwe: 'CWE-326',
            remediation: 'Migrate to at least 256-bit symmetric encryption keys.',
          },
        ],
        recommendations: [
          {
            title: 'Immediate Deprecation of DES Protocol',
            description: 'Purge DES implementations across legacy middleware.',
            priority: 'Urgent',
          },
        ],
        status: 'Flagged',
      },
      {
        userId: user._id,
        inputType: 'Hex',
        sampleName: 'tls_session_ticket.bin',
        inputSize: 1024,
        algorithm: 'ChaCha20-Poly1305',
        detectedCipherFamily: 'Authenticated Stream Cipher',
        keySize: '256-bit',
        mode: 'AEAD',
        entropy: 7.98,
        chiSquareScore: 254.1,
        indexCoincidence: 0.0038,
        securityScore: 98,
        riskLevel: 'Low',
        vulnerabilities: [],
        recommendations: [
          {
            title: 'Replay Protection Validation',
            description: 'Ensure unique nonces are enforced per session ticket handshake.',
            priority: 'Low',
          },
        ],
        status: 'Completed',
      },
      {
        userId: user._id,
        inputType: 'Plaintext',
        sampleName: 'config_credentials_unencrypted.txt',
        inputSize: 4200,
        algorithm: 'Plaintext (Unencrypted)',
        detectedCipherFamily: 'Unencrypted Text',
        keySize: '0-bit',
        mode: 'None',
        entropy: 4.12,
        chiSquareScore: 4890.0,
        indexCoincidence: 0.0654,
        securityScore: 10,
        riskLevel: 'Critical',
        vulnerabilities: [
          {
            title: 'Sensitive Plaintext Data Exposed',
            severity: 'Critical',
            description: 'Plaintext credentials detected without any cryptographic encapsulation.',
            cwe: 'CWE-312',
            remediation: 'Encrypt with AES-256-GCM using envelope encryption and hardware KMS.',
          },
        ],
        recommendations: [
          {
            title: 'Adopt Vault / KMS Secret Management',
            description: 'Store secrets in an encrypted key management service.',
            priority: 'Urgent',
          },
        ],
        status: 'Flagged',
      },
    ];

    const insertedAnalyses = await Analysis.insertMany(sampleAnalyses);
    console.log(`[Seed] Seeded ${insertedAnalyses.length} Analysis records`);

    // Create Sample Encryption Operations
    await EncryptionOperation.insertMany([
      {
        userId: user._id,
        operation: 'encrypt',
        algorithm: 'AES-256-GCM',
        keySize: '256-bit',
        mode: 'GCM',
        inputLength: 10240,
        outputLength: 10272,
        executionTimeMs: 0.12,
        success: true,
      },
      {
        userId: user._id,
        operation: 'decrypt',
        algorithm: 'ChaCha20-Poly1305',
        keySize: '256-bit',
        mode: 'AEAD',
        inputLength: 4096,
        outputLength: 4080,
        executionTimeMs: 0.08,
        success: true,
      },
      {
        userId: user._id,
        operation: 'encrypt',
        algorithm: 'RSA-2048',
        keySize: '2048-bit',
        mode: 'OAEP',
        inputLength: 128,
        outputLength: 256,
        executionTimeMs: 1.45,
        success: true,
      },
    ]);
    console.log('[Seed] Seeded Encryption Operations');

    // Create Sample Recommendation
    await Recommendation.create({
      userId: user._id,
      inputs: {
        dataSensitivity: 'High',
        dataType: 'Database',
        requiredSecurityLevel: 'Enhanced',
        performancePriority: 'Balanced',
        keySizePreference: '256-bit',
      },
      recommendationScore: 98,
      recommendedAlgorithm: {
        name: 'AES-256-GCM',
        keySize: '256-bit',
        securityLevel: 'Very High',
        performanceRating: 'High (AES-NI accelerated)',
        recommendedMode: 'Galois/Counter Mode (GCM)',
      },
      explanation: 'AES-256-GCM selected for database column encryption to provide authenticated confidentiality with negligible CPU overhead.',
      alternatives: [
        {
          name: 'ChaCha20-Poly1305',
          securityLevel: 'Very High',
          keySize: '256-bit',
          performance: 'Ultra High on ARM',
          recommendedUseCase: 'Mobile & edge storage',
          riskLevel: 'Low',
          matchScore: 94,
        },
      ],
    });
    console.log('[Seed] Seeded AI Recommendation');

    // Create Sample Report
    await Report.create({
      userId: user._id,
      analysisId: insertedAnalyses[0]._id,
      reportTitle: 'Q3 Enterprise Cryptographic Posture Assessment',
      reportNumber: 'CS-REP-902144',
      reportData: {
        clientInfo: {
          assessorName: 'Lead Cryptanalyst',
          organization: 'CyberSec Core Operations',
          targetSystem: 'Core Banking API & Storage Layer',
        },
        summary: {
          overallScore: 87,
          riskLevel: 'Low',
          criticalVulnerabilitiesCount: 0,
          highVulnerabilitiesCount: 1,
          entropyScore: 7.94,
        },
        technicalDetails: {
          algorithm: 'AES-256-CBC',
          keySize: '256-bit',
          mode: 'CBC',
          detectedCipherFamily: 'Modern Block Cipher (Rijndael)',
          entropy: 7.94,
          predictabilityScore: 2,
        },
        vulnerabilities: [
          {
            title: 'CBC Bit-Flipping Malleability',
            severity: 'Medium',
            description: 'Unauthenticated CBC ciphertexts allow bit-flipping on decrypted plaintexts.',
            remediation: 'Implement HMAC-SHA256 over ciphertext (Encrypt-then-MAC) or switch to AES-GCM.',
            cwe: 'CWE-327',
          },
        ],
        aiRecommendations: {
          primaryAlgorithm: 'AES-256-GCM',
          recommendedKeySize: '256-bit',
          rationale: 'Galois/Counter Mode (GCM) offers authenticated encryption with built-in GMAC tag verification.',
          alternatives: [],
        },
        actionPlan: [
          'Enforce AES-256-GCM across all microservices.',
          'Schedule automated key rollover every 90 days.',
        ],
      },
    });
    console.log('[Seed] Seeded Security Report');

    console.log('[Seed] All demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();
