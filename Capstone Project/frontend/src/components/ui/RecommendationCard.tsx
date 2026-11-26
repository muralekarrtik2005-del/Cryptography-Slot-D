import React from 'react';
import { Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { RecommendationItem } from '../../types';

interface RecommendationCardProps {
  recommendation: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'High':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="cyber-card rounded-xl p-4 border border-slate-800 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs font-semibold text-slate-100 font-mono">{recommendation.title}</h5>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getPriorityStyle(recommendation.priority)}`}>
            {recommendation.priority}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{recommendation.description}</p>
      </div>
    </div>
  );
};
