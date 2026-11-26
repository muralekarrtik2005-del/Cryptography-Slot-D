/**
 * AI / Multi-Criteria Decision Engine for Cryptographic Recommendation
 * Calculates fitness scores across NIST-approved and classical ciphers
 * based on data sensitivity, application latency requirements, and threat model.
 */

export const generateRecommendation = (inputs) => {
  const {
    dataSensitivity = 'High',
    dataType = 'Text',
    requiredSecurityLevel = 'Enhanced',
    performancePriority = 'Balanced',
    keySizePreference = 'Auto',
  } = inputs;

  let recommendedAlgorithm = {
    name: 'AES-256-GCM',
    keySize: '256-bit',
    securityLevel: 'Very High',
    performanceRating: 'High (Hardware-Accelerated via AES-NI)',
    recommendedMode: 'Galois/Counter Mode (GCM) Authenticated Encryption',
  };
  let recommendationScore = 96;
  let explanation = '';

  // Rule matrix
  if (dataType === 'Communication' || performancePriority === 'Low Resource / IoT') {
    if (performancePriority === 'Low Resource / IoT' || dataSensitivity === 'Medium') {
      recommendedAlgorithm = {
        name: 'ChaCha20-Poly1305',
        keySize: '256-bit',
        securityLevel: 'Very High',
        performanceRating: 'Extreme (Software Optimized, Mobile/ARM Preferred)',
        recommendedMode: 'AEAD (Authenticated Encryption with Associated Data)',
      };
      recommendationScore = 98;
      explanation =
        'ChaCha20-Poly1305 was selected as the optimal cipher because it provides 256-bit military-grade security with unparalleled efficiency on mobile, embedded, and IoT processors lacking dedicated hardware AES acceleration.';
    } else {
      recommendedAlgorithm = {
        name: 'AES-256-GCM',
        keySize: '256-bit',
        securityLevel: 'Very High',
        performanceRating: 'Ultra High (Hardware AES-NI)',
        recommendedMode: 'GCM Authenticated Encryption',
      };
      recommendationScore = 97;
      explanation =
        'AES-256-GCM provides the industry-standard authenticated encryption required for secure communications (TLS 1.3 standard) with full integrity guarantees and high pipeline throughput.';
    }
  } else if (dataType === 'Database' || dataSensitivity === 'Critical') {
    recommendedAlgorithm = {
      name: 'AES-256-GCM',
      keySize: '256-bit',
      securityLevel: 'Maximum / Top-Secret',
      performanceRating: 'Optimal',
      recommendedMode: 'XTS-AES or AES-256-GCM',
    };
    recommendationScore = 99;
    explanation =
      'For critical enterprise databases and high-sensitivity storage, AES-256 in GCM or XTS mode is the gold standard mandated by NIST, GDPR, HIPAA, and PCI-DSS, ensuring resistance against both classic and quantum Grover search attacks.';
  } else if (keySizePreference === '2048-bit (Asymmetric)' || keySizePreference === '4096-bit (Asymmetric)') {
    const keyLen = keySizePreference.includes('4096') ? '4096-bit' : '2048-bit';
    recommendedAlgorithm = {
      name: `RSA-${keyLen.replace('-bit', '')} (OAEP)`,
      keySize: keyLen,
      securityLevel: keyLen === '4096-bit' ? 'Very High' : 'High',
      performanceRating: 'Moderate (Suitable for Key Exchange & Digital Signatures)',
      recommendedMode: 'OAEP with SHA-256 Padding',
    };
    recommendationScore = 92;
    explanation =
      `Asymmetric RSA with ${keyLen} key size and OAEP-SHA256 padding was chosen to support public-key encryption and digital signatures where secret key sharing is impractical.`;
  } else if (performancePriority === 'Maximum Throughput' && dataSensitivity !== 'Critical') {
    recommendedAlgorithm = {
      name: 'AES-128-GCM',
      keySize: '128-bit',
      securityLevel: 'High',
      performanceRating: 'Maximum (Lowest CPU cycles per byte)',
      recommendedMode: 'Galois/Counter Mode (GCM)',
    };
    recommendationScore = 93;
    explanation =
      'AES-128-GCM delivers the maximum throughput while retaining certified NIST FIPS-197 security, perfect for high-speed streaming or latency-sensitive workloads with moderate security mandates.';
  } else {
    recommendedAlgorithm = {
      name: 'AES-256-CBC with HMAC-SHA256',
      keySize: '256-bit',
      securityLevel: 'Very High',
      performanceRating: 'High',
      recommendedMode: 'CBC (Cipher Block Chaining) with Encrypt-then-MAC',
    };
    recommendationScore = 95;
    explanation =
      'AES-256 provides comprehensive security against modern cryptanalytic attacks with broad compatibility across operating systems, hardware cryptographic engines, and compliance frameworks.';
  }

  // Pre-calculated alternative algorithms comparison matrix
  const alternatives = [
    {
      name: 'AES-256 (Advanced Encryption Standard)',
      securityLevel: 'Very High (256-bit strength)',
      keySize: '256-bit',
      performance: 'High (AES-NI accelerated)',
      recommendedUseCase: 'Enterprise storage, cloud databases, confidential documents',
      riskLevel: 'Low',
      matchScore: 97,
    },
    {
      name: 'ChaCha20-Poly1305',
      securityLevel: 'Very High (256-bit strength)',
      keySize: '256-bit',
      performance: 'Ultra-High on ARM & CPUs without AES-NI',
      recommendedUseCase: 'Mobile apps, IoT devices, WireGuard VPN, TLS 1.3',
      riskLevel: 'Low',
      matchScore: 94,
    },
    {
      name: 'RSA-2048 / RSA-4096 (OAEP)',
      securityLevel: 'High to Very High',
      keySize: '2048-bit / 4096-bit',
      performance: 'Low (Asymmetric computation overhead)',
      recommendedUseCase: 'Key encapsulation, digital certificates, hybrid cryptosystems',
      riskLevel: 'Low',
      matchScore: 86,
    },
    {
      name: 'AES-128-GCM',
      securityLevel: 'High (128-bit strength)',
      keySize: '128-bit',
      performance: 'Maximum Throughput',
      recommendedUseCase: 'High-speed media streaming, low-latency telemetry',
      riskLevel: 'Low',
      matchScore: 89,
    },
    {
      name: 'Triple-DES (3DES / EDE3)',
      securityLevel: 'Deprecated / Weak (112-bit effective)',
      keySize: '168-bit (112-bit effective)',
      performance: 'Poor (Slow 3-pass block encryption)',
      recommendedUseCase: 'Legacy banking systems (Disallowed in new designs by NIST SP 800-131A)',
      riskLevel: 'High',
      matchScore: 35,
    },
    {
      name: 'Blowfish-448',
      securityLevel: 'Legacy / 64-bit block size vulnerable',
      keySize: 'Up to 448-bit',
      performance: 'Moderate',
      recommendedUseCase: 'Legacy password hashing (bcrypt ancestor), legacy tunnels',
      riskLevel: 'Medium',
      matchScore: 48,
    },
  ];

  return {
    recommendationScore,
    recommendedAlgorithm,
    explanation,
    alternatives,
    inputs,
  };
};
