export interface User {
  id: string;
  name: string;
  email: string;
  role: 'analyst' | 'security_officer' | 'admin';
  createdAt?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    defaultAlgorithm?: string;
    autoAnalysis?: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Vulnerability {
  _id?: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  cwe?: string;
  remediation: string;
}

export interface RecommendationItem {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface CharacterFrequency {
  char: string;
  count: number;
  percentage: number;
}

export interface PatternAnalysis {
  repeatedSequences: number;
  predictabilityScore: number;
  blockAlignmentDetected: boolean;
  nullByteRatio: number;
  isHexOrBase64: boolean;
}

export interface AnalysisRecord {
  _id: string;
  userId: string;
  inputType: 'Plaintext' | 'Ciphertext' | 'File' | 'Hex' | 'Base64';
  sampleName: string;
  inputSize: number;
  algorithm: string;
  detectedCipherFamily: string;
  keySize?: string;
  mode?: string;
  entropy: number;
  chiSquareScore?: number;
  indexCoincidence?: number;
  characterFrequency?: CharacterFrequency[];
  patternAnalysis?: PatternAnalysis;
  securityScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilities: Vulnerability[];
  recommendations: RecommendationItem[];
  metadata?: {
    fileName?: string;
    fileType?: string;
    analysisDurationMs?: number;
    analysisType?: string;
  };
  status?: 'Completed' | 'Flagged' | 'Archived';
  createdAt: string;
}

export interface AlgorithmAlternative {
  name: string;
  securityLevel: string;
  keySize: string;
  performance: string;
  recommendedUseCase: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  matchScore: number;
}

export interface AIRecommendationResult {
  recommendationScore: number;
  recommendedAlgorithm: {
    name: string;
    keySize: string;
    securityLevel: string;
    performanceRating: string;
    recommendedMode: string;
  };
  explanation: string;
  alternatives: AlgorithmAlternative[];
  inputs?: {
    dataSensitivity: string;
    dataType: string;
    requiredSecurityLevel: string;
    performancePriority: string;
    keySizePreference: string;
  };
}

export interface EncryptionResult {
  success: boolean;
  ciphertext?: string;
  decryptedText?: string;
  iv?: string;
  authTag?: string;
  algorithm: string;
  keySize?: string;
  mode?: string;
  executionTimeMs: number;
  keyDetails?: {
    publicKey: string;
    privateKey: string;
  };
}

export interface BenchmarkItem {
  algorithm: string;
  encryptionTimeMs: number;
  decryptionTimeMs: number;
  throughputMBps: number;
  security: string;
  nistApproved: boolean;
}

export interface ReportRecord {
  _id: string;
  userId: string;
  analysisId?: string;
  reportTitle: string;
  reportNumber: string;
  reportData: {
    clientInfo?: {
      assessorName?: string;
      organization?: string;
      targetSystem?: string;
    };
    summary?: {
      overallScore: number;
      riskLevel: string;
      criticalVulnerabilitiesCount: number;
      highVulnerabilitiesCount: number;
      entropyScore: number;
    };
    technicalDetails?: {
      algorithm: string;
      keySize: string;
      mode: string;
      detectedCipherFamily: string;
      entropy: number;
      predictabilityScore: number;
    };
    vulnerabilities?: Vulnerability[];
    aiRecommendations?: {
      primaryAlgorithm: string;
      recommendedKeySize: string;
      rationale: string;
      alternatives?: { name: string; suitabilityScore: number; pros: string; cons: string }[];
    };
    actionPlan?: string[];
  };
  createdAt: string;
}

export interface DashboardData {
  overallSecurityScore: number;
  status: 'Secure' | 'Warning' | 'Critical';
  filesAnalyzed: number;
  vulnerabilitiesDetected: number;
  encryptionOperations: number;
  aiRecommendations: number;
  reportsGenerated: number;
  charts: {
    scoreTrend: { name: string; score: number; entropy: number }[];
    vulnerabilityDistribution: { name: string; value: number; color: string }[];
    algorithmUsage: { name: string; count: number; percentage: number }[];
    performanceComparison: { algorithm: string; encrypt: number; decrypt: number }[];
    riskLevelDistribution: { level: string; count: number; color: string }[];
  };
}
