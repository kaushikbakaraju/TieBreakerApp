import React from 'react';
import { X, Clock, Trash2, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Decision } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: Decision[];
  activeDecisionId: string | null;
  onSelectDecision: (decision: Decision) => void;
  onDeleteDecision: (id: string) => void;
  onNewDecision: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  activeDecisionId,
  onSelectDecision,
  onDeleteDecision,
  onNewDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Saved Decisions ({savedDecisions.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decisions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-medium text-slate-300">No saved decisions yet</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Create a decision analysis to save and track your high-stakes choices.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewDecision();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-sm"
              >
                Create Decision
              </button>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const isActive = dec.id === activeDecisionId;
              const dateStr = new Date(dec.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={dec.id}
                  onClick={() => {
                    onSelectDecision(dec);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 group ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {dec.title}
                    </h4>
                    {savedDecisions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDecision(dec.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete decision"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{dec.options.length} Paths</span>
                    <span>·</span>
                    <span>{dec.decisionType?.classification?.split(' ')[0] || 'Type 2'}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{dateStr}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="line-clamp-1">
                        {dec.options.find((o) => o.id === dec.tiebreakerVerdict?.recommendedOptionId)?.name ||
                          dec.options[0]?.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onNewDecision();
            }}
            className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm text-center transition-colors cursor-pointer"
          >
            + Create New Decision
          </button>
        </div>
      </div>
    </div>
  );
};
