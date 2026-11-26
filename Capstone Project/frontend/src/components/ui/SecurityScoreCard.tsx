import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface SecurityScoreCardProps {
  score: number;
  status?: string;
  subtitle?: string;
  size?: 'normal' | 'large';
}

export const SecurityScoreCard: React.FC<SecurityScoreCardProps> = ({
  score,
  status,
  subtitle = 'Cryptographic Strength Rating',
  size = 'normal',
}) => {
  const radius = size === 'large' ? 68 : 52;
  const stroke = size === 'large' ? 10 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: '#10B981', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'Secure' };
    if (score >= 60) return { stroke: '#F59E0B', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: 'Warning' };
    return { stroke: '#EF4444', text: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'Critical' };
  };

  const currentStatus = status || getColor().label;
  const config = getColor();

  return (
    <div className="cyber-card rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-center">
      <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Overall Security Score</p>

      <div className="relative flex items-center justify-center my-2">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            stroke="#1E293B"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={config.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black font-mono tracking-tight ${config.text}`}>
            {score}
          </span>
          <span className="text-[10px] font-mono text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}>
          {score >= 80 ? <ShieldCheck className="w-3.5 h-3.5" /> : score >= 60 ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldX className="w-3.5 h-3.5" />}
          <span>Status: {currentStatus}</span>
        </div>
        <p className="text-[11px] text-slate-400 pt-1">{subtitle}</p>
      </div>
    </div>
  );
};
