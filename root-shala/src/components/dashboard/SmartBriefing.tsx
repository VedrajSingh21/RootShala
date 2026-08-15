import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Role } from '../../types';
import toast from 'react-hot-toast';

interface BriefingData {
  greeting: string;
  briefingText: string;
  suggestedActions: { label: string; commandToRun: string }[];
}

interface SmartBriefingProps {
  currentRole: Role;
  schoolStats: any;
  onExecuteCommand: (command: string) => void;
}

export function SmartBriefing({ currentRole, schoolStats, onExecuteCommand }: SmartBriefingProps) {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchBriefing = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: currentRole, stats: schoolStats })
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (mounted) setBriefing(data);
      } catch (err) {
        console.error(err);
        // Fallback for demo if API fails
        if (mounted) {
          setBriefing({
            greeting: `Good morning, ${currentRole}!`,
            briefingText: "Your AI operations center is standing by to optimize your daily workflow. Everything looks stable across the school systems.",
            suggestedActions: [
              { label: 'Check for fee defaulters', commandToRun: 'Show fee defaulters' }
            ]
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBriefing();

    return () => { mounted = false; };
  }, [currentRole, schoolStats]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 flex items-center justify-center min-h-[140px] mb-8">
        <div className="flex items-center gap-3 text-indigo-300">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="font-medium">AI is generating your morning operations briefing...</span>
        </div>
      </div>
    );
  }

  if (!briefing) return null;

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-2xl mb-8 group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Left Side: Avatar & Text */}
        <div className="flex-1 flex gap-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shrink-0 shadow-[0_0_25px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              {briefing.greeting}
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
              {briefing.briefingText}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        {briefing.suggestedActions && briefing.suggestedActions.length > 0 && (
          <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1">Recommended Actions</p>
            {briefing.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onExecuteCommand(action.commandToRun);
                  toast.success('Command sent to AI Action Center');
                }}
                className="group/btn relative w-full flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 relative z-10">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">{action.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all relative z-10" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
