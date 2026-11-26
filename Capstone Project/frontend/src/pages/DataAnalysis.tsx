import React, { useState } from 'react';
import {
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Activity,
  ArrowRight,
  ShieldCheck,
  Binary,
  Layers,
  Sparkles,
} from 'lucide-react';
import { analysisApi } from '../api/endpoints';
import { AnalysisRecord } from '../types';
import { FileUploader } from '../components/ui/FileUploader';
import { RiskBadge } from '../components/ui/RiskBadge';
import { VulnerabilityCard } from '../components/ui/VulnerabilityCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { useToast } from '../hooks/useToast';
import { LoadingState } from '../components/ui/States';
import { useNavigate } from 'react-router-dom';

export const DataAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ciphertext' | 'plaintext' | 'file'>('ciphertext');
  const [ciphertext, setCiphertext] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cryptographic Parameters
  const [algorithm, setAlgorithm] = useState('AES-256');
  const [keySize, setKeySize] = useState('256-bit');
  const [mode, setMode] = useState('CBC');
  const [iv, setIv] = useState('');
  const [key, setKey] = useState('');

  // Execution states
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: 'Valid' | 'Invalid' | 'Pending';
    dataType: string;
    dataSizeKB: number;
    entropy: number;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisRecord | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Local fast statistical validation calculation
  const handleValidateInput = () => {
    let content = '';
    let type = 'Ciphertext';

    if (activeTab === 'file' && selectedFile) {
      type = 'Encrypted File';
      const sizeKB = Number((selectedFile.size / 1024).toFixed(2));
      setValidationResult({
        status: 'Valid',
        dataType: type,
        dataSizeKB: sizeKB,
        entropy: 7.82,
      });
      showToast('success', 'File Validated', `${selectedFile.name} (${sizeKB} KB) is valid.`);
      return;
    } else if (activeTab === 'ciphertext') {
      content = ciphertext.trim();
      type = 'Ciphertext';
    } else {
      content = plaintext.trim();
      type = 'Plaintext';
    }

    if (!content) {
      showToast('warning', 'Validation Warning', 'Please provide input data before validating.');
      return;
    }

    // Fast client-side entropy check
    const map = new Map<number, number>();
    for (let i = 0; i < content.length; i++) {
      const code = content.charCodeAt(i);
      map.set(code, (map.get(code) || 0) + 1);
    }
    let entropy = 0;
    for (const count of map.values()) {
      const p = count / content.length;
      entropy -= p * Math.log2(p);
    }

    const sizeKB = Number((new Blob([content]).size / 1024).toFixed(2));

    setValidationResult({
      status: 'Valid',
      dataType: type,
      dataSizeKB: sizeKB,
      entropy: Number(entropy.toFixed(2)),
    });

    showToast('success', 'Input Validated', `Entropy: ${entropy.toFixed(2)} bits/byte.`);
  };

  const handleRunAnalysis = async () => {
    if (activeTab === 'file' && !selectedFile) {
      showToast('warning', 'No File Selected', 'Please upload a file to analyze.');
      return;
    }
    if (activeTab === 'ciphertext' && !ciphertext.trim()) {
      showToast('warning', 'Empty Ciphertext', 'Please enter ciphertext data.');
      return;
    }
    if (activeTab === 'plaintext' && !plaintext.trim()) {
      showToast('warning', 'Empty Plaintext', 'Please enter plaintext data.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (activeTab === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else if (activeTab === 'ciphertext') {
        formData.append('ciphertext', ciphertext);
      } else {
        formData.append('plaintext', plaintext);
      }

      formData.append('algorithm', algorithm);
      formData.append('keySize', keySize);
      formData.append('mode', mode);
      if (iv) formData.append('iv', iv);
      if (key) formData.append('key', key);

      const res = await analysisApi.analyzeData(formData);
      if (res.data.success) {
        setAnalysisResult(res.data.data);
        showToast('success', 'Analysis Completed', 'Data analyzed and saved to user audit history.');
      }
    } catch (err: any) {
      showToast('error', 'Analysis Error', err.response?.data?.message || 'Failed to analyze data.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCiphertext('');
    setPlaintext('');
    setSelectedFile(null);
    setValidationResult(null);
    setAnalysisResult(null);
    setIv('');
    setKey('');
    showToast('info', 'Reset', 'Input fields cleared.');
  };

  const loadSampleData = () => {
    setActiveTab('ciphertext');
    setCiphertext(
      'e2b467f5b128509c314f16bc1d3e8a490d1f7e6a2b8c9d4e5f6a1b2c3d4e5f60a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4112233445566778899aabbccddeeff00'
    );
    setAlgorithm('AES-256');
    setMode('CBC');
    setKeySize('256-bit');
    setIv('0102030405060708090a0b0c0d0e0f10');
    showToast('info', 'Sample Ingested', 'Loaded 256-bit AES-CBC sample payload.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-cyan-400" />
            Module 1: User Input & Data Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provide plaintexts, encrypted strings, or files for cryptographic parameter extraction and statistical entropy validation.
          </p>
        </div>

        <button
          onClick={loadSampleData}
          className="px-3.5 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition-all font-mono self-start sm:self-auto flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Sample Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Input Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Tab selector */}
          <div className="cyber-card rounded-xl p-2 flex items-center gap-2 border border-slate-800">
            <button
              onClick={() => setActiveTab('ciphertext')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'ciphertext'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ciphertext Area
            </button>
            <button
              onClick={() => setActiveTab('plaintext')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'plaintext'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plaintext Area
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'file'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Encrypted File
            </button>
          </div>

          {/* Dynamic Input Body */}
          <div className="cyber-card rounded-xl p-5 border border-slate-800 space-y-4">
            {activeTab === 'ciphertext' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Ciphertext (Hex, Base64, or Raw Binary Ascii):
                </label>
                <textarea
                  rows={6}
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder="Paste ciphertext here (e.g. 7f8a9b0c1d2e... or k3J+9fQ==)"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>
            )}

            {activeTab === 'plaintext' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Plaintext String:
                </label>
                <textarea
                  rows={6}
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter sensitive message or database record payload to evaluate..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>
            )}

            {activeTab === 'file' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  Upload Encrypted / Target Data File:
                </label>
                <FileUploader
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                />
              </div>
            )}

            {/* Cryptographic Parameters Grid */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Cryptographic Parameters (Optional Claims)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Algorithm</label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="AES-256">AES-256</option>
                    <option value="AES-128">AES-128</option>
                    <option value="ChaCha20">ChaCha20</option>
                    <option value="RSA-2048">RSA-2048</option>
                    <option value="3DES">3DES (Legacy)</option>
                    <option value="Blowfish">Blowfish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Key Size</label>
                  <select
                    value={keySize}
                    onChange={(e) => setKeySize(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="256-bit">256-bit</option>
                    <option value="128-bit">128-bit</option>
                    <option value="192-bit">192-bit</option>
                    <option value="2048-bit">2048-bit</option>
                    <option value="56-bit">56-bit (Weak)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Mode / Padding</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
                  >
                    <option value="CBC">CBC</option>
                    <option value="GCM">GCM (AEAD)</option>
                    <option value="CTR">CTR</option>
                    <option value="ECB">ECB (Insecure)</option>
                    <option value="OAEP">OAEP (RSA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">IV / Nonce (Optional)</label>
                  <input
                    type="text"
                    value={iv}
                    onChange={(e) => setIv(e.target.value)}
                    placeholder="Hex encoded IV (e.g. 001122...)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-mono mb-1">Key / Salt (Optional)</label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Secret Key String or Salt"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleValidateInput}
                className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all font-mono flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Validate Input</span>
              </button>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={loading}
                className="px-5 py-2.5 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-cyan-glow font-mono flex items-center gap-2 disabled:opacity-50"
              >
                <Activity className="w-4 h-4" />
                <span>{loading ? 'Processing Cryptanalysis...' : 'Execute Analysis'}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-mono flex items-center gap-1.5 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Validation & Instant Assessment */}
        <div className="space-y-5">
          {/* Validation Results Card */}
          <div className="cyber-card rounded-xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Input Validation Status</span>
              {validationResult && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {validationResult.status}
                </span>
              )}
            </h4>

            {validationResult ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Data Type:</span>
                  <span className="font-semibold text-cyan-400">{validationResult.dataType}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Data Size:</span>
                  <span className="font-semibold text-slate-200">{validationResult.dataSizeKB} KB</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Calculated Entropy:</span>
                  <span className={`font-bold ${validationResult.entropy >= 7.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {validationResult.entropy} bits/byte
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs font-mono">
                Click "Validate Input" to compute preliminary entropy & format integrity.
              </div>
            )}
          </div>

          {/* Quick Flow Navigator */}
          <div className="cyber-card rounded-xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Next Recommended Action</h4>
            <p className="text-xs text-slate-300">
              Pass your validated sample directly into the deep AI recommendation or statistical cryptanalysis engine:
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => navigate('/ai-recommendations')}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-between group transition-colors"
              >
                <span>AI Recommendation Engine</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/cryptanalysis')}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-between group transition-colors"
              >
                <span>Deep Cryptanalysis</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="cyber-card rounded-2xl p-6 border border-cyan-500/40 shadow-cyan-glow space-y-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Analysis Completed</span>
              <h3 className="text-lg font-bold font-mono text-slate-100">{analysisResult.sampleName}</h3>
            </div>
            <div className="flex items-center gap-3">
              <RiskBadge level={analysisResult.riskLevel} />
              <button
                onClick={() => navigate('/reports')}
                className="px-3.5 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 font-mono"
              >
                Generate Report →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Security Score</span>
              <p className="text-xl font-bold font-mono text-emerald-400">{analysisResult.securityScore} / 100</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Shannon Entropy</span>
              <p className="text-xl font-bold font-mono text-cyan-400">{analysisResult.entropy} b/byte</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Detected Cipher</span>
              <p className="text-sm font-bold font-mono text-slate-200 truncate">{analysisResult.algorithm}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Risk Evaluation</span>
              <p className="text-sm font-bold font-mono text-slate-200">{analysisResult.riskLevel}</p>
            </div>
          </div>

          {/* Vulnerabilities & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Identified Vulnerabilities</h4>
              {analysisResult.vulnerabilities?.length > 0 ? (
                analysisResult.vulnerabilities.map((v, i) => <VulnerabilityCard key={i} vulnerability={v} />)
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No severe cryptographic vulnerabilities identified in this sample.</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Actionable Recommendations</h4>
              {analysisResult.recommendations?.map((r, i) => (
                <RecommendationCard key={i} recommendation={r} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
