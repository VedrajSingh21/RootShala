import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Receipt,
  FileSearch,
  CalendarCheck,
  Boxes,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { EscalationItem, Severity } from '../../types';

interface NeedsAttentionProps {
  escalations: EscalationItem[];
  onResolveEscalation: (id: string) => void;
  onOpenCommandCenter: (prompt?: string) => void;
}

export const NeedsAttention: React.FC<NeedsAttentionProps> = ({
  escalations,
  onResolveEscalation,
  onOpenCommandCenter
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const unresolvedEscalations = escalations.filter(
    (e) => e.status === 'UNRESOLVED' && (filterSeverity === 'ALL' || e.severity === filterSeverity)
  );

  const getCategoryIcon = (category: EscalationItem['category']) => {
    switch (category) {
      case 'FEE_MISMATCH':
        return <Receipt className="w-4 h-4 text-slate-500" />;
      case 'OCR_REVIEW':
        return <FileSearch className="w-4 h-4 text-slate-500" />;
      case 'TEACHER_ABSENT':
        return <CalendarCheck className="w-4 h-4 text-slate-500" />;
      case 'MISSING_DOC':
        return <FileSearch className="w-4 h-4 text-slate-500" />;
      case 'PARENT_COMPLAINT':
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
      case 'SUPPLY_SHORTAGE':
        return <Boxes className="w-4 h-4 text-slate-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-50 text-red-700 border border-red-200">Critical</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">High</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Needs Attention</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
              {unresolvedEscalations.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Linear-style inbox for operational escalations requiring human sign-off.
          </p>
        </div>

        <button
          onClick={() => onOpenCommandCenter("Build Needs Attention summary")}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs self-start sm:self-auto interaction-btn-secondary"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI Prioritize</span>
        </button>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60 overflow-x-auto">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterSeverity === sev
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {sev === 'ALL' ? 'All Items' : sev.charAt(0) + sev.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Escalation Cards List */}
      <div className="space-y-3">
        {unresolvedEscalations.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">Inbox Zero</h3>
            <p className="text-xs text-slate-400">All administrative escalations have been reviewed.</p>
          </div>
        ) : (
          unresolvedEscalations.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4 interaction-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      {getSeverityBadge(item.severity)}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {item.entityName} • Logged {item.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {item.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Problem, Reason, AI Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
                  <div className="font-semibold text-slate-700">Problem & Reason:</div>
                  <p className="text-slate-600 leading-relaxed">{item.reason}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Source: {item.source}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Recommended Action:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.suggestedAction}</p>
                  {item.requiresApproval && (
                    <div className="text-[10px] font-medium text-emerald-700 pt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Human approval required (&lt;90% confidence threshold)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Approve / Reject Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => onResolveEscalation(item.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium interaction-btn-secondary border border-transparent"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => onResolveEscalation(item.id)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs interaction-btn-primary"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Action</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

