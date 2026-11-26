import React from 'react';
import { Shield, Zap, Lock, Award, ArrowRight } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { AlgorithmAlternative } from '../../types';

interface AlgorithmCardProps {
  algorithm: AlgorithmAlternative;
  isRecommended?: boolean;
  onSelect?: () => void;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  algorithm,
  isRecommended = false,
  onSelect,
}) => {
  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
        isRecommended
          ? 'bg-gradient-to-b from-[#0F1E38] to-[#0B1120] border-cyan-500/40 shadow-cyan-glow'
          : 'cyber-card'
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-400 text-black text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
          <Award className="w-3 h-3" />
          <span>Top AI Recommendation</span>
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h4 className="text-base font-bold text-slate-100 font-mono flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              {algorithm.name}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Key: <span className="font-mono text-cyan-300 font-semibold">{algorithm.keySize}</span></p>
          </div>
          <RiskBadge level={algorithm.riskLevel} size="sm" />
        </div>

        <div className="space-y-2 text-xs py-2 border-y border-slate-800/80 my-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Security Rating:</span>
            <span className="font-semibold text-slate-200">{algorithm.securityLevel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Performance:</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {algorithm.performance}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 pt-1">
            <span className="text-slate-400">Best Use Case:</span>
            <p className="text-[11px] text-slate-300 italic">{algorithm.recommendedUseCase}</p>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs font-mono">
          <span className="text-slate-400">Match Score: </span>
          <span className="font-bold text-cyan-400">{algorithm.matchScore}%</span>
        </div>

        {onSelect && (
          <button
            onClick={onSelect}
            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Use Cipher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
