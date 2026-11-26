import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Skull } from 'lucide-react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level = 'Low', size = 'md' }) => {
  const normalized = level.toLowerCase();

  const getStyle = () => {
    if (normalized.includes('low') || normalized.includes('secure')) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: ShieldCheck,
        text: 'LOW RISK',
      };
    }
    if (normalized.includes('medium') || normalized.includes('warning')) {
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: AlertTriangle,
        text: 'MEDIUM RISK',
      };
    }
    if (normalized.includes('high')) {
      return {
        bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        icon: ShieldAlert,
        text: 'HIGH RISK',
      };
    }
    return {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
      icon: Skull,
      text: 'CRITICAL',
    };
  };

  const config = getStyle();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-semibold uppercase tracking-wider ${
        config.bg
      } ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.text}</span>
    </span>
  );
};
