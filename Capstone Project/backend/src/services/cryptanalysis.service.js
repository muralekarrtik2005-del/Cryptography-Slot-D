/**
 * Cryptanalysis and Statistical Security Assessment Service
 * Calculates Shannon Entropy, Index of Coincidence, Chi-Square, Pattern Repetitions,
 * and assesses cryptographic strength, risk level, and vulnerabilities.
 */

export const calculateShannonEntropy = (buffer) => {
  if (!buffer || buffer.length === 0) return 0;
  const frequencies = new Map();
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    frequencies.set(byte, (frequencies.get(byte) || 0) + 1);
  }

  let entropy = 0;
  const len = buffer.length;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
};

export const calculateIndexOfCoincidence = (buffer) => {
  if (!buffer || buffer.length < 2) return 0;
  const counts = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    counts[buffer[i]]++;
  }
  const n = buffer.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += counts[i] * (counts[i] - 1);
  }
  const ioc = sum / (n * (n - 1));
  return Number(ioc.toFixed(4));
};

export const calculateChiSquare = (buffer) => {
  if (!buffer || buffer.length === 0) return 0;
  const counts = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    counts[buffer[i]]++;
  }
  const expected = buffer.length / 256;
  let chiSquare = 0;
  for (let i = 0; i < 256; i++) {
    const diff = counts[i] - expected;
    chiSquare += (diff * diff) / expected;
  }
  return Number(chiSquare.toFixed(2));
};

export const getCharacterFrequency = (buffer, maxItems = 15) => {
  if (!buffer || buffer.length === 0) return [];
  const map = {};
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    const char = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : `0x${byte.toString(16).padStart(2, '0').toUpperCase()}`;
    map[char] = (map[char] || 0) + 1;
  }

  return Object.entries(map)
    .map(([char, count]) => ({
      char,
      count,
      percentage: Number(((count / buffer.length) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxItems);
};

export const detectPatternsAndEncodings = (buffer, rawString) => {
  const isHex = /^[0-9a-fA-F\s:]+$/.test(rawString.trim()) && rawString.trim().length > 8;
  const isBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(rawString.trim()) && rawString.trim().length % 4 === 0 && rawString.trim().length > 12;

  // Block repetition check (16-byte chunks for ECB / repeated blocks)
  let repeated16ByteBlocks = 0;
  if (buffer.length >= 32) {
    const blocks = new Set();
    const totalBlocks = Math.floor(buffer.length / 16);
    for (let i = 0; i < totalBlocks; i++) {
      const blockHex = buffer.subarray(i * 16, (i + 1) * 16).toString('hex');
      if (blocks.has(blockHex)) {
        repeated16ByteBlocks++;
      } else {
        blocks.add(blockHex);
      }
    }
  }

  // Count null bytes or low ASCII dominance
  let nullBytes = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0x00) nullBytes++;
  }
  const nullByteRatio = buffer.length > 0 ? Number((nullBytes / buffer.length).toFixed(3)) : 0;

  // Predictability score (0 = completely random/high security, 100 = trivial plaintext or repeated)
  const entropy = calculateShannonEntropy(buffer);
  let predictability = Math.max(0, Math.min(100, Math.round(((8.0 - entropy) / 8.0) * 100)));
  if (repeated16ByteBlocks > 0) predictability = Math.min(100, predictability + repeated16ByteBlocks * 15);

  return {
    repeatedSequences: repeated16ByteBlocks,
    predictabilityScore: predictability,
    blockAlignmentDetected: buffer.length % 16 === 0,
    nullByteRatio,
    isHexOrBase64: isHex || isBase64,
  };
};

export const identifyCipherAndVulnerabilities = (buffer, rawString, options = {}) => {
  const entropy = calculateShannonEntropy(buffer);
  const ioc = calculateIndexOfCoincidence(buffer);
  const patterns = detectPatternsAndEncodings(buffer, rawString);
  const { algorithm: claimedAlgo, keySize: claimedKeySize } = options;

  let detectedAlgorithm = 'Unknown / Raw Ciphertext';
  let detectedCipherFamily = 'Unknown Stream/Block';
  let securityScore = 50;
  let riskLevel = 'Medium';
  const vulnerabilities = [];
  const recommendations = [];

  // Plaintext detection
  if (entropy < 4.5 && ioc > 0.05) {
    detectedAlgorithm = 'Plaintext (Unencrypted)';
    detectedCipherFamily = 'Unencrypted Text';
    securityScore = 12;
    riskLevel = 'Critical';
    vulnerabilities.push({
      title: 'Unencrypted Plaintext Data in Transit/Rest',
      severity: 'Critical',
      description: 'The provided data has low entropy and character distribution matching unencrypted language text.',
      cwe: 'CWE-312',
      remediation: 'Encrypt the sensitive payload using AES-256-GCM or ChaCha20-Poly1305 before transmission or storage.',
    });
  } else if (entropy >= 7.5) {
    // High entropy data
    if (patterns.repeatedSequences > 0) {
      detectedAlgorithm = 'ECB Mode Block Cipher (Insecure)';
      detectedCipherFamily = 'Electronic Codebook (ECB)';
      securityScore = 48;
      riskLevel = 'High';
      vulnerabilities.push({
        title: 'ECB Mode Pattern Leakage Detected',
        severity: 'High',
        description: 'Identical plaintext blocks produce identical ciphertext blocks, leaking structural and statistical patterns.',
        cwe: 'CWE-327',
        remediation: 'Switch from ECB mode to authenticated modes like GCM (Galois/Counter Mode) or CBC with random IV.',
      });
    } else {
      detectedAlgorithm = claimedAlgo || (patterns.blockAlignmentDetected ? 'AES-256-CBC / GCM' : 'Modern Stream / AEAD Cipher (ChaCha20 / AES-CTR)');
      detectedCipherFamily = patterns.blockAlignmentDetected ? 'Modern Block Cipher (Rijndael / AES)' : 'Modern Stream / Authenticated Cipher';
      securityScore = 92;
      riskLevel = 'Low';
    }
  } else if (entropy >= 5.5 && entropy < 7.5) {
    detectedAlgorithm = claimedAlgo || 'Weak/Classical Cipher or Compressed Stream';
    detectedCipherFamily = 'Substitution / Transposition or Weak Block';
    securityScore = 65;
    riskLevel = 'Medium';
    vulnerabilities.push({
      title: 'Sub-Optimal Ciphertext Entropy',
      severity: 'Medium',
      description: `Shannon entropy is ${entropy} bits/byte (expected > 7.9 bits/byte for strong modern crypto), indicating possible byte bias.`,
      cwe: 'CWE-326',
      remediation: 'Ensure nonces/IVs are cryptographically random and avoid short key schedules or deprecated algorithms.',
    });
  }

  // Algorithm / Key Size specific checks
  if (claimedAlgo) {
    const algoUpper = claimedAlgo.toUpperCase();
    if (algoUpper.includes('DES') || algoUpper.includes('3DES') || algoUpper.includes('TRIPLE DES')) {
      securityScore = Math.min(securityScore, 42);
      riskLevel = 'High';
      vulnerabilities.push({
        title: 'Deprecated Legacy Cipher: 3DES/DES',
        severity: 'High',
        description: 'DES and 3DES suffer from small 64-bit block size vulnerability (Sweet32 attack) and are deprecated by NIST.',
        cwe: 'CWE-327',
        remediation: 'Migrate immediately to AES-256-GCM or ChaCha20-Poly1305.',
      });
    } else if (algoUpper.includes('RC4') || algoUpper.includes('MD5') || algoUpper.includes('SHA1')) {
      securityScore = Math.min(securityScore, 25);
      riskLevel = 'Critical';
      vulnerabilities.push({
        title: 'Broken Cryptographic Algorithm In Use',
        severity: 'Critical',
        description: 'RC4, MD5, and SHA1 have practical collision and keystream bias attacks demonstrated in research.',
        cwe: 'CWE-327',
        remediation: 'Replace with modern SHA-256/SHA-3 and AES-GCM.',
      });
    } else if (claimedAlgo.includes('128') && (claimedKeySize === '128' || claimedKeySize === '128-bit')) {
      if (securityScore > 85) securityScore = 85;
      recommendations.push({
        title: 'Upgrade to 256-bit Key Length for Future Proofing',
        description: '128-bit AES is secure today, but 256-bit keys offer quantum-resistance against Grover’s algorithm.',
        priority: 'Medium',
      });
    }
  }

  // Generate actionable recommendations
  if (vulnerabilities.length === 0) {
    recommendations.push({
      title: 'Maintain Authenticated Encryption Best Practices',
      description: 'Continue using AES-256-GCM or ChaCha20 with unique, never-repeated initialization vectors (IVs).',
      priority: 'Low',
    });
    recommendations.push({
      title: 'Periodic Key Rotation Policy',
      description: 'Enforce automatic cryptographic key rotation every 90 days or after 2^32 encryption invocations.',
      priority: 'Medium',
    });
  } else {
    recommendations.push({
      title: 'Enforce Modern Cipher Suite Configurations',
      description: 'Deprecate legacy TLS / symmetric cipher suites in favor of TLS 1.3 and AES-GCM / ChaCha20-Poly1305.',
      priority: 'High',
    });
  }

  return {
    entropy,
    ioc,
    chiSquareScore: calculateChiSquare(buffer),
    characterFrequency: getCharacterFrequency(buffer),
    patternAnalysis: patterns,
    detectedAlgorithm,
    detectedCipherFamily,
    securityScore,
    riskLevel,
    vulnerabilities,
    recommendations,
  };
};

export const performCryptanalysis = (inputData, options = {}) => {
  const startTime = Date.now();
  let buffer;
  let rawString = '';

  if (Buffer.isBuffer(inputData)) {
    buffer = inputData;
    rawString = buffer.toString('utf8', 0, Math.min(buffer.length, 5000));
  } else if (typeof inputData === 'string') {
    rawString = inputData;
    // Check if hex or base64
    const trimmed = inputData.trim();
    if (/^[0-9a-fA-F\s]+$/.test(trimmed) && trimmed.length % 2 === 0 && trimmed.length > 8) {
      try {
        buffer = Buffer.from(trimmed.replace(/\s+/g, ''), 'hex');
      } catch {
        buffer = Buffer.from(inputData, 'utf8');
      }
    } else if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length > 12) {
      try {
        buffer = Buffer.from(trimmed, 'base64');
      } catch {
        buffer = Buffer.from(inputData, 'utf8');
      }
    } else {
      buffer = Buffer.from(inputData, 'utf8');
    }
  } else {
    buffer = Buffer.from(String(inputData), 'utf8');
    rawString = String(inputData);
  }

  const analysisResult = identifyCipherAndVulnerabilities(buffer, rawString, options);
  const duration = Date.now() - startTime;

  return {
    ...analysisResult,
    inputSize: buffer.length,
    analysisDurationMs: duration,
  };
};
