import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { aiApi } from '../api/endpoints';
import { AIRecommendationResult } from '../types';
import { AlgorithmCard } from '../components/ui/AlgorithmCard';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export const AIRecommendations: React.FC = () => {
  const [dataSensitivity, setDataSensitivity] = useState('High');
  const [dataType, setDataType] = useState('Database');
  const [requiredSecurityLevel, setRequiredSecurityLevel] = useState('Enhanced');
  const [performancePriority, setPerformancePriority] = useState('Balanced');
  const [keySizePreference, setKeySizePreference] = useState('256-bit');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationResult | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await aiApi.getRecommendation({
        dataSensitivity,
        dataType,
        requiredSecurityLevel,
        performancePriority,
        keySizePreference,
      });

      if (res.data.success) {
        setResult(res.data.data);
        showToast('success', 'Recommendation Generated', 'AI multi-criteria evaluation completed.');
      }
    } catch (err: any) {
      showToast('error', 'Generation Failed', err.response?.data?.message || 'Failed to compute algorithm recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            Module 2: AI Cryptographic Recommendation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Specify compliance criteria, performance budgets, and threat profiles to receive mathematically tuned cipher recommendations.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>Rule-Based & ML Ready Engine</span>
        </div>
      </div>

      {/* Input Requirements Form */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Define Security & Architecture Requirements
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Data Sensitivity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
              1. Data Sensitivity
            </label>
            <select
              value={dataSensitivity}
              onChange={(e) => setDataSensitivity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
            >
              <option value="Low">Low (Public Telemetry / Logs)</option>
              <option value="Medium">Medium (Internal Corporate Data)</option>
              <option value="High">High (PII, Financial Records, HIPAA)</option>
              <option value="Critical">Critical (Classified, Master Keys, Banking PINs)</option>
            </select>
          </div>

          {/* Data Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
              2. Data Target Domain
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
            >
              <option value="Database">Database (Column / Table at Rest)</option>
              <option value="Communication">Communication (TLS / Real-Time Wire Stream)</option>
              <option value="File">File Storage (Disks, Backups, Cloud S3)</option>
              <option value="Text">Text (Messages, Tokens, API Payloads)</option>
            </select>
          </div>

          {/* Required Security Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
              3. Required Security Mandate
            </label>
            <select
              value={requiredSecurityLevel}
              onChange={(e) => setRequiredSecurityLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
            >
              <option value="Standard">Standard (Commercial Grade)</option>
              <option value="Enhanced">Enhanced (NIST SP 800-57 Compliant)</option>
              <option value="Military/Top-Secret">Military / Top-Secret (FIPS 140-3 Level 3)</option>
              <option value="Post-Quantum Prepared">Post-Quantum Prepared (High Key Entropy)</option>
            </select>
          </div>

          {/* Performance Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
              4. Performance Priority
            </label>
            <select
              value={performancePriority}
              onChange={(e) => setPerformancePriority(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
            >
              <option value="Balanced">Balanced (Throughput vs Strong Crypto)</option>
              <option value="Maximum Throughput">Maximum Throughput (High-Speed Wire)</option>
              <option value="Maximum Security">Maximum Security (Latency Insensitive)</option>
              <option value="Low Resource / IoT">Low Resource / IoT (ARM / Embedded Without AES-NI)</option>
            </select>
          </div>

          {/* Key Size Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1.5">
              5. Key Size Preference
            </label>
            <select
              value={keySizePreference}
              onChange={(e) => setKeySizePreference(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:border-cyan-400"
            >
              <option value="256-bit">256-bit (Recommended Standard)</option>
              <option value="128-bit">128-bit (Fast Lightweight)</option>
              <option value="2048-bit (Asymmetric)">2048-bit (Asymmetric Public Key)</option>
              <option value="4096-bit (Asymmetric)">4096-bit (High Security Asymmetric)</option>
              <option value="Auto">Auto (Let Engine Decide)</option>
            </select>
          </div>

          {/* Submit Trigger */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs font-mono transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50 h-[42px]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Recommendation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recommendation Results Banner */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Recommendation Highlight Card */}
          <div className="cyber-card-glow rounded-2xl p-6 border border-cyan-500/40 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Optimal Algorithm Match
                </span>
                <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1">
                  {result.recommendedAlgorithm.name}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Recommendation Score</span>
                  <p className="text-2xl font-bold text-cyan-400">{result.recommendationScore} / 100</p>
                </div>
                <button
                  onClick={() => navigate('/encryption')}
                  className="px-4 py-2 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl font-mono shadow-cyan-glow flex items-center gap-1.5"
                >
                  <span>Deploy in Module 4</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Recommended Key Size:</span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">{result.recommendedAlgorithm.keySize}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Security Level:</span>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">{result.recommendedAlgorithm.securityLevel}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Recommended Mode:</span>
                <p className="font-bold text-cyan-300 text-sm mt-0.5">{result.recommendedAlgorithm.recommendedMode}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-[#091326] border border-cyan-500/20">
              <h5 className="text-xs font-bold font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Decision Matrix Rationale:
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
            </div>
          </div>

          {/* Alternative Algorithms Comparison */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Alternative Algorithms Comparison Matrix
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.alternatives.map((alt, idx) => (
                <AlgorithmCard
                  key={idx}
                  algorithm={alt}
                  isRecommended={alt.name.includes(result.recommendedAlgorithm.name.split('-')[0])}
                  onSelect={() => navigate('/encryption')}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
