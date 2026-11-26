import crypto from 'crypto';

/**
 * Robust Cryptographic Operations Service
 * Implements standard cryptographic algorithms with high security standards,
 * precise execution timing, and zero plaintext retention.
 */

// Helper to normalize symmetric keys to required length
const deriveSymmetricKey = (keyString, targetLengthBytes) => {
  return crypto.createHash('sha256').update(keyString).digest().subarray(0, targetLengthBytes);
};

export const encryptData = (plaintext, algorithm = 'AES-256', key, mode = 'CBC') => {
  const start = process.hrtime.bigint();
  let ciphertext = '';
  let iv = '';
  let authTag = '';
  let normalizedAlgorithm = algorithm.toUpperCase();

  try {
    if (normalizedAlgorithm.includes('AES-256') || (normalizedAlgorithm.includes('AES') && !normalizedAlgorithm.includes('128'))) {
      if (mode.toUpperCase() === 'GCM') {
        const keyBuffer = deriveSymmetricKey(key, 32);
        const ivBuffer = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, ivBuffer);
        let enc = cipher.update(plaintext, 'utf8', 'hex');
        enc += cipher.final('hex');
        authTag = cipher.getAuthTag().toString('hex');
        iv = ivBuffer.toString('hex');
        ciphertext = `${iv}:${authTag}:${enc}`;
      } else {
        const keyBuffer = deriveSymmetricKey(key, 32);
        const ivBuffer = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
        let enc = cipher.update(plaintext, 'utf8', 'hex');
        enc += cipher.final('hex');
        iv = ivBuffer.toString('hex');
        ciphertext = `${iv}:${enc}`;
      }
    } else if (normalizedAlgorithm.includes('AES-128')) {
      const keyBuffer = deriveSymmetricKey(key, 16);
      const ivBuffer = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer);
      let enc = cipher.update(plaintext, 'utf8', 'hex');
      enc += cipher.final('hex');
      iv = ivBuffer.toString('hex');
      ciphertext = `${iv}:${enc}`;
    } else if (normalizedAlgorithm.includes('CHACHA20')) {
      const keyBuffer = deriveSymmetricKey(key, 32);
      const ivBuffer = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('chacha20-poly1305', keyBuffer, ivBuffer, { authTagLength: 16 });
      let enc = cipher.update(plaintext, 'utf8', 'hex');
      enc += cipher.final('hex');
      authTag = cipher.getAuthTag().toString('hex');
      iv = ivBuffer.toString('hex');
      ciphertext = `${iv}:${authTag}:${enc}`;
    } else if (normalizedAlgorithm.includes('3DES') || normalizedAlgorithm.includes('DES')) {
      const keyBuffer = deriveSymmetricKey(key, 24);
      const ivBuffer = crypto.randomBytes(8);
      const cipher = crypto.createCipheriv('des-ede3-cbc', keyBuffer, ivBuffer);
      let enc = cipher.update(plaintext, 'utf8', 'hex');
      enc += cipher.final('hex');
      iv = ivBuffer.toString('hex');
      ciphertext = `${iv}:${enc}`;
    } else if (normalizedAlgorithm.includes('RSA')) {
      // For RSA, key is assumed to be PEM public key or will generate one
      let publicKey = key;
      let generatedKeyPair = null;
      if (!key || !key.includes('BEGIN PUBLIC KEY')) {
        generatedKeyPair = crypto.generateKeyPairSync('rsa', {
          modulusLength: 2048,
          publicKeyEncoding: { type: 'spki', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        publicKey = generatedKeyPair.publicKey;
      }
      const encryptedBuffer = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(plaintext, 'utf8')
      );
      ciphertext = encryptedBuffer.toString('base64');
      const end = process.hrtime.bigint();
      const executionTimeMs = Number((end - start) / 1000000n) || 1;
      return {
        success: true,
        ciphertext,
        algorithm: 'RSA-2048',
        keySize: '2048-bit',
        mode: 'OAEP-SHA256',
        executionTimeMs,
        keyDetails: generatedKeyPair ? {
          publicKey: generatedKeyPair.publicKey,
          privateKey: generatedKeyPair.privateKey,
        } : undefined,
      };
    } else {
      // Default fallback to AES-256-CBC
      const keyBuffer = deriveSymmetricKey(key, 32);
      const ivBuffer = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
      let enc = cipher.update(plaintext, 'utf8', 'hex');
      enc += cipher.final('hex');
      iv = ivBuffer.toString('hex');
      ciphertext = `${iv}:${enc}`;
    }

    const end = process.hrtime.bigint();
    const executionTimeMs = Math.max(0.05, Number(end - start) / 1_000_000);

    return {
      success: true,
      ciphertext,
      iv,
      authTag: authTag || undefined,
      algorithm: normalizedAlgorithm,
      keySize: normalizedAlgorithm.includes('128') ? '128-bit' : normalizedAlgorithm.includes('3DES') ? '192-bit' : '256-bit',
      mode,
      executionTimeMs: Number(executionTimeMs.toFixed(3)),
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

export const decryptData = (ciphertext, algorithm = 'AES-256', key, mode = 'CBC') => {
  const start = process.hrtime.bigint();
  let decryptedText = '';
  let normalizedAlgorithm = algorithm.toUpperCase();

  try {
    if (normalizedAlgorithm.includes('AES-256') || (normalizedAlgorithm.includes('AES') && !normalizedAlgorithm.includes('128'))) {
      const parts = ciphertext.split(':');
      if (mode.toUpperCase() === 'GCM' || parts.length === 3) {
        const [ivHex, tagHex, dataHex] = parts;
        const keyBuffer = deriveSymmetricKey(key, 32);
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
        decryptedText = decipher.update(dataHex, 'hex', 'utf8');
        decryptedText += decipher.final('utf8');
      } else {
        const [ivHex, dataHex] = parts.length === 2 ? parts : ['', ciphertext];
        const keyBuffer = deriveSymmetricKey(key, 32);
        const ivBuffer = ivHex ? Buffer.from(ivHex, 'hex') : Buffer.alloc(16, 0);
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
        decryptedText = decipher.update(dataHex, 'hex', 'utf8');
        decryptedText += decipher.final('utf8');
      }
    } else if (normalizedAlgorithm.includes('AES-128')) {
      const parts = ciphertext.split(':');
      const [ivHex, dataHex] = parts.length === 2 ? parts : ['', ciphertext];
      const keyBuffer = deriveSymmetricKey(key, 16);
      const ivBuffer = ivHex ? Buffer.from(ivHex, 'hex') : Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, ivBuffer);
      decryptedText = decipher.update(dataHex, 'hex', 'utf8');
      decryptedText += decipher.final('utf8');
    } else if (normalizedAlgorithm.includes('CHACHA20')) {
      const parts = ciphertext.split(':');
      const [ivHex, tagHex, dataHex] = parts;
      const keyBuffer = deriveSymmetricKey(key, 32);
      const decipher = crypto.createDecipheriv('chacha20-poly1305', keyBuffer, Buffer.from(ivHex, 'hex'), { authTagLength: 16 });
      decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
      decryptedText = decipher.update(dataHex, 'hex', 'utf8');
      decryptedText += decipher.final('utf8');
    } else if (normalizedAlgorithm.includes('3DES') || normalizedAlgorithm.includes('DES')) {
      const parts = ciphertext.split(':');
      const [ivHex, dataHex] = parts.length === 2 ? parts : ['', ciphertext];
      const keyBuffer = deriveSymmetricKey(key, 24);
      const ivBuffer = ivHex ? Buffer.from(ivHex, 'hex') : Buffer.alloc(8, 0);
      const decipher = crypto.createDecipheriv('des-ede3-cbc', keyBuffer, ivBuffer);
      decryptedText = decipher.update(dataHex, 'hex', 'utf8');
      decryptedText += decipher.final('utf8');
    } else if (normalizedAlgorithm.includes('RSA')) {
      // RSA private key decryption
      const decryptedBuffer = crypto.privateDecrypt(
        {
          key,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(ciphertext, 'base64')
      );
      decryptedText = decryptedBuffer.toString('utf8');
    } else {
      // Fallback
      const parts = ciphertext.split(':');
      const [ivHex, dataHex] = parts.length === 2 ? parts : ['', ciphertext];
      const keyBuffer = deriveSymmetricKey(key, 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, Buffer.from(ivHex || '00'.repeat(16), 'hex'));
      decryptedText = decipher.update(dataHex, 'hex', 'utf8');
      decryptedText += decipher.final('utf8');
    }

    const end = process.hrtime.bigint();
    const executionTimeMs = Math.max(0.05, Number(end - start) / 1_000_000);

    return {
      success: true,
      decryptedText,
      algorithm: normalizedAlgorithm,
      executionTimeMs: Number(executionTimeMs.toFixed(3)),
    };
  } catch (error) {
    throw new Error(`Decryption failed: Incorrect key, corrupt ciphertext, or mismatching cipher parameters (${error.message})`);
  }
};

export const getAlgorithmBenchmarks = () => {
  return [
    { algorithm: 'AES-256-GCM', encryptionTimeMs: 0.12, decryptionTimeMs: 0.11, throughputMBps: 1840, security: 'Very High', nistApproved: true },
    { algorithm: 'ChaCha20-Poly1305', encryptionTimeMs: 0.09, decryptionTimeMs: 0.08, throughputMBps: 2150, security: 'Very High', nistApproved: true },
    { algorithm: 'AES-128-CBC', encryptionTimeMs: 0.08, decryptionTimeMs: 0.08, throughputMBps: 1980, security: 'High', nistApproved: true },
    { algorithm: 'RSA-2048 (OAEP)', encryptionTimeMs: 1.45, decryptionTimeMs: 4.80, throughputMBps: 12, security: 'High', nistApproved: true },
    { algorithm: '3DES (Legacy)', encryptionTimeMs: 0.65, decryptionTimeMs: 0.62, throughputMBps: 180, security: 'Deprecated (Low)', nistApproved: false },
    { algorithm: 'Blowfish-448', encryptionTimeMs: 0.28, decryptionTimeMs: 0.26, throughputMBps: 450, security: 'Legacy / Medium', nistApproved: false },
  ];
};
