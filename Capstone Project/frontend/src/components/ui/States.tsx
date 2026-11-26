import React from 'react';
import { ShieldAlert, AlertOctagon, Inbox, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string; submessage?: string }> = ({
  message = 'Executing Cryptographic Analysis...',
  submessage = 'Analyzing Shannon entropy, index of coincidence & frequency distribution',
}) => {
  return (
    <div className="cyber-card rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-100 font-mono tracking-wide">{message}</h4>
        <p className="text-xs text-slate-400 max-w-sm">{submessage}</p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div className="cyber-card rounded-xl p-10 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
        <Inbox className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-200 font-mono">{title}</h4>
        <p className="text-xs text-slate-400 max-w-md">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all font-mono"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = 'Failed to communicate with Cryptographic Core Service', onRetry }) => {
  return (
    <div className="cyber-card rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3 border-rose-500/30 bg-rose-950/10">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-100 font-mono">Service Error Encountered</h4>
        <p className="text-xs text-rose-300 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
