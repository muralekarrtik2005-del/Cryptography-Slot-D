import React, { useState } from 'react';
import {
  Binary,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap,
  BarChart2,
  FileCheck,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { cryptanalysisApi } from '../api/endpoints';
import { FileUploader } from '../components/ui/FileUploader';
import { RiskBadge } from '../components/ui/RiskBadge';
import { VulnerabilityCard } from '../components/ui/VulnerabilityCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { ChartCard } from '../components/ui/ChartCard';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export const Cryptanalysis: React.FC = () => {
  const [ciphertext, setCiphertext] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('Full Statistical Suite');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleStartAnalysis = async () => {
    if (!selectedFile && !ciphertext.trim()) {
      showToast('warning', 'Input Required', 'Please paste ciphertext or upload an encrypted file.');
      return;
    }

    setLoading(true);
    setProgress(20);

    const timer1 = setTimeout(() => setProgress(55), 300);
    const timer2 = setTimeout(() => setProgress(85), 600);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('ciphertext', ciphertext);
      }
      formData.append('analysisType', analysisType);

      const res = await cryptanalysisApi.runAnalysis(formData);
      if (res.data.success) {
        setProgress(100);
        setResult(res.data.data);
        showToast('success', 'Cryptanalysis Completed', 'Statistical assessment and vulnerability detection complete.');
      }
    } catch (err: any) {
      showToast('error', 'Analysis Error', err.response?.data?.message || 'Failed to complete cryptanalysis.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setTimeout(() => setLoading(false), 400);
    }
  };

  const loadPreset = (type: 'aes' | 'ecb' | 'plaintext') => {
    if (type === 'aes') {
      setCiphertext('4a6f23b8901cdef84561237890abcdef1234567890abcdef4a6f23b8901cdef8c0a80101fedcba987654321012345678');
      showToast('info', 'Loaded Sample', 'Ingested modern pseudo-random AES ciphertext payload.');
    } else if (type === 'ecb') {
      setCiphertext('deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef41414141414141414141414141414141');
      showToast('warning', 'Loaded ECB Sample', 'Ingested repeated-block Electronic Codebook sample.');
    } else {
      setCiphertext('Hello World! This is unencrypted plain ASCII text with obvious English character frequencies.');
      showToast('warning', 'Loaded Plaintext', 'Ingested unencrypted low-entropy plaintext.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            Module 3: Cryptanalysis & Security Assessment
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Perform statistical randomness analysis, Shannon entropy calculation, frequency testing, and vulnerability heuristic detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPreset('aes')}
            className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 rounded-lg"
          >
            AES Sample
          </button>
          <button
            onClick={() => loadPreset('ecb')}
            className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 rounded-lg"
          >
            ECB Leak Sample
          </button>
          <button
            onClick={() => loadPreset('plaintext')}
            className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 border border-slate-700 hover:border-rose-400 text-slate-300 rounded-lg"
          >
            Plaintext Sample
          </button>
        </div>
      </div>

      {/* Scope Disclaimer Alert */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-slate-100 font-mono">Academic / SOC Scope Notice:</strong> This module performs statistical cryptanalysis (entropy metrics, index of coincidence, character distribution, and pattern periodicity). Modern ciphers like AES-256 with CSPRNG keys are mathematically resistant to ciphertext-only decryption.
        </p>
      </div>

      {/* Cryptanalysis Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="cyber-card rounded-xl p-5 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Ciphertext Hex / Base64 / Stream:
              </label>
              <textarea
                rows={5}
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                placeholder="Paste raw ciphertext string or enter hex encoded bytes..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Or Upload Encrypted Data File:
              </label>
              <FileUploader
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 font-mono mb-1">
                  Analysis Suite / Profile
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
                >
                  <option value="Full Statistical Suite">Full Statistical Suite</option>
                  <option value="Frequency Analysis">Frequency Analysis</option>
                  <option value="Entropy Analysis">Entropy Analysis</option>
                  <option value="Pattern & Block Periodicity">Pattern & Block Periodicity</option>
                  <option value="Cipher Identification">Cipher Identification</option>
                  <option value="Weakness & CVE Detection">Weakness & CVE Detection</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={loading}
                  className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs font-mono transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50 h-[38px]"
                >
                  <Activity className="w-4 h-4" />
                  <span>Start Cryptanalysis</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            {loading && (
              <div className="space-y-1.5 pt-2 font-mono">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Executing Statistical Heuristics...</span>
                  <span className="text-cyan-400">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Quick Info Cards */}
        <div className="space-y-4">
          <div className="cyber-card rounded-xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Inspection Criteria</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Shannon Entropy (Max: 8.0 bits/byte)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Index of Coincidence (IoC)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Chi-Square Goodness of Fit</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>16-Byte Block Repetitions (ECB)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cryptanalysis Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Banner */}
          <div className="cyber-card-glow rounded-2xl p-6 border border-cyan-500/40 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Heuristic Classification</span>
                <h3 className="text-xl font-bold font-mono text-slate-100 mt-1">
                  Detected Algorithm: {result.detectedAlgorithm}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Family: {result.detectedCipherFamily} | Processed Size: {result.inputSize} Bytes ({result.analysisDurationMs}ms)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <RiskBadge level={result.riskLevel} size="lg" />
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Security Strength</span>
                  <p className="text-2xl font-bold text-cyan-400">{result.securityScore} / 100</p>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Shannon Entropy</span>
                <p className="font-bold text-slate-100 text-lg mt-0.5">{result.entropy} <span className="text-xs text-slate-400">b/B</span></p>
                <span className="text-[10px] text-slate-500">Ideal &gt; 7.9</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Index of Coincidence</span>
                <p className="font-bold text-slate-100 text-lg mt-0.5">{result.ioc}</p>
                <span className="text-[10px] text-slate-500">Random ~ 0.0039</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Predictability Rating</span>
                <p className="font-bold text-amber-400 text-lg mt-0.5">
                  {result.patternAnalysis?.predictabilityScore || 0}%
                </p>
                <span className="text-[10px] text-slate-500">Lower is better</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Repeated 16B Blocks</span>
                <p className={`font-bold text-lg mt-0.5 ${result.patternAnalysis?.repeatedSequences > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.patternAnalysis?.repeatedSequences || 0}
                </p>
                <span className="text-[10px] text-slate-500">0 in secure cipher</span>
              </div>
            </div>
          </div>

          {/* Frequency Analysis Chart */}
          {result.characterFrequency && result.characterFrequency.length > 0 && (
            <ChartCard
              title="Byte / Character Frequency Distribution"
              subtitle="Top frequency occurrences in analyzed sample (Flat distribution denotes high entropy)"
            >
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={result.characterFrequency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="char" stroke="#64748B" fontSize={11} fontStyle="mono" tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="percentage" fill="#00F0FF" radius={[4, 4, 0, 0]} name="Percentage (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Vulnerabilities & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Vulnerability Assessment & Weaknesses
              </h4>
              {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
                result.vulnerabilities.map((v: any, idx: number) => (
                  <VulnerabilityCard key={idx} vulnerability={v} />
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>No cryptographic weakness or pattern leakage detected.</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Actionable Hardening Guidance
              </h4>
              {result.recommendations && result.recommendations.map((r: any, idx: number) => (
                <RecommendationCard key={idx} recommendation={r} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
