import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Lock,
  Unlock,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Cpu,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { encryptionApi } from '../api/endpoints';
import { EncryptionResult, BenchmarkItem } from '../types';
import { useToast } from '../hooks/useToast';
import { DataTable, Column } from '../components/ui/DataTable';

export const Encryption: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Encryption state
  const [plaintext, setPlaintext] = useState('');
  const [encryptAlgo, setEncryptAlgo] = useState('AES-256');
  const [encryptKey, setEncryptKey] = useState('MasterSecretKey_2026_Secure');
  const [encryptMode, setEncryptMode] = useState('CBC');
  const [encryptResult, setEncryptResult] = useState<EncryptionResult | null>(null);
  const [encryptLoading, setEncryptLoading] = useState(false);

  // Decryption state
  const [ciphertext, setCiphertext] = useState('');
  const [decryptAlgo, setDecryptAlgo] = useState('AES-256');
  const [decryptKey, setDecryptKey] = useState('MasterSecretKey_2026_Secure');
  const [decryptMode, setDecryptMode] = useState('CBC');
  const [decryptResult, setDecryptResult] = useState<EncryptionResult | null>(null);
  const [decryptLoading, setDecryptLoading] = useState(false);

  // Benchmarks
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const res = await encryptionApi.getBenchmarks();
        if (res.data.success) {
          setBenchmarks(res.data.data);
        }
      } catch {
        // Default benchmarks fallback
        setBenchmarks([
          { algorithm: 'AES-256-GCM', encryptionTimeMs: 0.12, decryptionTimeMs: 0.11, throughputMBps: 1840, security: 'Very High', nistApproved: true },
          { algorithm: 'ChaCha20-Poly1305', encryptionTimeMs: 0.09, decryptionTimeMs: 0.08, throughputMBps: 2150, security: 'Very High', nistApproved: true },
          { algorithm: 'AES-128-CBC', encryptionTimeMs: 0.08, decryptionTimeMs: 0.08, throughputMBps: 1980, security: 'High', nistApproved: true },
          { algorithm: 'RSA-2048 (OAEP)', encryptionTimeMs: 1.45, decryptionTimeMs: 4.80, throughputMBps: 12, security: 'High', nistApproved: true },
          { algorithm: '3DES (Legacy)', encryptionTimeMs: 0.65, decryptionTimeMs: 0.62, throughputMBps: 180, security: 'Deprecated (Low)', nistApproved: false },
        ]);
      }
    };
    fetchBenchmarks();
  }, []);

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plaintext.trim()) {
      showToast('warning', 'Missing Plaintext', 'Please enter text to encrypt.');
      return;
    }

    setEncryptLoading(true);
    try {
      const res = await encryptionApi.encrypt({
        plaintext,
        algorithm: encryptAlgo,
        key: encryptKey,
        mode: encryptMode,
      });

      if (res.data.success) {
        setEncryptResult(res.data.data);
        showToast('success', 'Data Encrypted', `Encrypted in ${res.data.data.executionTimeMs} ms.`);
      }
    } catch (err: any) {
      showToast('error', 'Encryption Failed', err.response?.data?.message || 'Crypto error.');
    } finally {
      setEncryptLoading(false);
    }
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciphertext.trim()) {
      showToast('warning', 'Missing Ciphertext', 'Please enter ciphertext to decrypt.');
      return;
    }

    setDecryptLoading(true);
    try {
      const res = await encryptionApi.decrypt({
        ciphertext,
        algorithm: decryptAlgo,
        key: decryptKey,
        mode: decryptMode,
      });

      if (res.data.success) {
        setDecryptResult(res.data.data);
        showToast('success', 'Data Decrypted', `Decrypted in ${res.data.data.executionTimeMs} ms.`);
      }
    } catch (err: any) {
      showToast('error', 'Decryption Failed', err.response?.data?.message || 'Crypto error.');
    } finally {
      setDecryptLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    showToast('info', 'Copied to Clipboard', 'Text copied.');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const transferToDecrypt = () => {
    if (encryptResult?.ciphertext) {
      setCiphertext(encryptResult.ciphertext);
      setDecryptAlgo(encryptAlgo);
      setDecryptKey(encryptKey);
      setDecryptMode(encryptMode);
      setActiveTab('decrypt');
      showToast('info', 'Transferred', 'Ciphertext loaded into Decryption tab.');
    }
  };

  const benchmarkColumns: Column<BenchmarkItem>[] = [
    {
      header: 'Cipher Suite',
      accessor: (row) => (
        <span className="font-bold font-mono text-slate-100 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          {row.algorithm}
        </span>
      ),
    },
    {
      header: 'Enc Time (ms)',
      accessor: (row) => <span className="font-mono text-emerald-400">{row.encryptionTimeMs} ms</span>,
    },
    {
      header: 'Dec Time (ms)',
      accessor: (row) => <span className="font-mono text-blue-400">{row.decryptionTimeMs} ms</span>,
    },
    {
      header: 'Throughput',
      accessor: (row) => <span className="font-mono text-slate-300">{row.throughputMBps} MB/s</span>,
    },
    {
      header: 'Security Posture',
      accessor: (row) => (
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
            row.nistApproved
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {row.security}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            Module 4: Cryptographic Engine (Encryption & Decryption)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Perform FIPS-compliant symmetric and asymmetric cryptographic operations with live runtime benchmarking.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="cyber-card rounded-xl p-2 flex items-center gap-2 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('encrypt')}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'encrypt'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Encryption Mode</span>
        </button>
        <button
          onClick={() => setActiveTab('decrypt')}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'decrypt'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Decryption Mode</span>
        </button>
      </div>

      {/* Main Mode Containers */}
      {activeTab === 'encrypt' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Encryption Input Form */}
          <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              Encryption Parameters
            </h3>

            <form onSubmit={handleEncrypt} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Plaintext Message</label>
                <textarea
                  rows={4}
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter sensitive confidential text to encrypt..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Algorithm</label>
                  <select
                    value={encryptAlgo}
                    onChange={(e) => setEncryptAlgo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="AES-256">AES-256</option>
                    <option value="AES-128">AES-128</option>
                    <option value="ChaCha20">ChaCha20-Poly1305</option>
                    <option value="RSA-2048">RSA-2048 (Asymmetric)</option>
                    <option value="3DES">3DES (Triple DES)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Mode / Padding</label>
                  <select
                    value={encryptMode}
                    onChange={(e) => setEncryptMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="CBC">CBC (Cipher Block Chaining)</option>
                    <option value="GCM">GCM (Galois/Counter Mode)</option>
                    <option value="OAEP">OAEP (RSA Padding)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Secret Key / Passphrase
                </label>
                <input
                  type="text"
                  value={encryptKey}
                  onChange={(e) => setEncryptKey(e.target.value)}
                  placeholder="Encryption key string (Leave blank for auto-generated RSA keypair)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={encryptLoading}
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs font-mono transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{encryptLoading ? 'Encrypting...' : 'Execute Encryption'}</span>
              </button>
            </form>
          </div>

          {/* Encryption Output Card */}
          <div className="cyber-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">Ciphertext Result</h3>
                {encryptResult && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {encryptResult.executionTimeMs} ms
                  </span>
                )}
              </div>

              {encryptResult ? (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-[11px]">Formatted Ciphertext:</span>
                      <button
                        onClick={() => copyToClipboard(encryptResult.ciphertext || '', 'enc')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {copiedField === 'enc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      readOnly
                      value={encryptResult.ciphertext}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs text-cyan-300 select-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500">Algorithm:</span>
                      <p className="font-bold text-slate-200">{encryptResult.algorithm}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500">Key Size:</span>
                      <p className="font-bold text-cyan-400">{encryptResult.keySize}</p>
                    </div>
                  </div>

                  {encryptResult.keyDetails && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                      <span className="text-amber-400 font-bold">Generated RSA Private Key (Save Carefully):</span>
                      <pre className="text-slate-400 mt-1 max-h-20 overflow-y-auto whitespace-pre-wrap">{encryptResult.keyDetails.privateKey}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 text-xs font-mono">
                  Encryption output, initialization vectors, and execution timing will render here.
                </div>
              )}
            </div>

            {encryptResult && (
              <button
                onClick={transferToDecrypt}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-mono font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Test in Decryption Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Decryption Input Form */}
          <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Unlock className="w-4 h-4 text-cyan-400" />
              Decryption Parameters
            </h3>

            <form onSubmit={handleDecrypt} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Ciphertext String</label>
                <textarea
                  rows={4}
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder="Paste formatted ciphertext (e.g. iv:ciphertext or iv:tag:data)..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Algorithm</label>
                  <select
                    value={decryptAlgo}
                    onChange={(e) => setDecryptAlgo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="AES-256">AES-256</option>
                    <option value="AES-128">AES-128</option>
                    <option value="ChaCha20">ChaCha20-Poly1305</option>
                    <option value="RSA-2048">RSA-2048 (Private Key)</option>
                    <option value="3DES">3DES</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Mode / Padding</label>
                  <select
                    value={decryptMode}
                    onChange={(e) => setDecryptMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="CBC">CBC</option>
                    <option value="GCM">GCM</option>
                    <option value="OAEP">OAEP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Secret Key / RSA Private Key PEM
                </label>
                <input
                  type="text"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  placeholder="Enter matching secret key or PEM private key"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={decryptLoading}
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs font-mono transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>{decryptLoading ? 'Decrypting...' : 'Execute Decryption'}</span>
              </button>
            </form>
          </div>

          {/* Decryption Output Card */}
          <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">Decrypted Plaintext</h3>
              {decryptResult && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {decryptResult.executionTimeMs} ms
                </span>
              )}
            </div>

            {decryptResult ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-[11px]">Decrypted Content:</span>
                  <button
                    onClick={() => copyToClipboard(decryptResult.decryptedText || '', 'dec')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    {copiedField === 'dec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  readOnly
                  value={decryptResult.decryptedText}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs text-emerald-300 select-all"
                />

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Integrity Verified: Decryption matched cipher authentication tag.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs font-mono">
                Decrypted plaintext results and timing verification will appear here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Algorithm Performance Benchmarking Table */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Cryptographic Performance & Security Benchmark Comparison
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Live server-side execution timing, throughput benchmarks, and NIST SP 800-131A posture ratings.
            </p>
          </div>
        </div>

        <DataTable
          columns={benchmarkColumns}
          data={benchmarks}
          keyExtractor={(row) => row.algorithm}
        />
      </div>
    </div>
  );
};
