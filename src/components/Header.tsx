import React from 'react';
import { Scale, Sparkles, Plus, History, Download, Compass, GitCompare, Table2, Grid2X2, HelpCircle } from 'lucide-react';
import { Decision } from '../types/decision';

export type ActiveTab = 'verdict' | 'proscons' | 'matrix' | 'swot' | 'stresstest';

interface HeaderProps {
  decision: Decision | null;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onExport: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  decision,
  activeTab,
  onTabChange,
  onNewDecision,
  onOpenHistory,
  onExport,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                The Tiebreaker
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide text-indigo-400/90 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Decision Studio
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (when decision loaded) */}
        {decision ? (
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => onTabChange('verdict')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'verdict'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Verdict & Reversibility
            </button>
            <button
              onClick={() => onTabChange('proscons')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'proscons'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              Pros & Cons
            </button>
            <button
              onClick={() => onTabChange('matrix')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Comparison Table
            </button>
            <button
              onClick={() => onTabChange('swot')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'swot'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              SWOT Matrix
            </button>
            <button
              onClick={() => onTabChange('stresstest')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'stresstest'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Stress Test & Q&A
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Clarify</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Weigh Trade-offs</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Break Indecision</span>
          </div>
        )}

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-all whitespace-nowrap"
            title="View saved decisions"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Saved</span>
            <span className="font-mono tabular-nums text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-md">
              {savedCount}
            </span>
          </button>

          {decision && (
            <button
              onClick={onExport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-all whitespace-nowrap"
              title="Export report"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all whitespace-nowrap cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Decision</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      {decision && (
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pt-3 pb-1 border-t border-slate-800/80 mt-3 no-scrollbar">
          <button
            onClick={() => onTabChange('verdict')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'verdict' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Verdict
          </button>
          <button
            onClick={() => onTabChange('proscons')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'proscons' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Pros & Cons
          </button>
          <button
            onClick={() => onTabChange('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => onTabChange('swot')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'swot' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            SWOT
          </button>
          <button
            onClick={() => onTabChange('stresstest')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'stresstest' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            Stress Test
          </button>
        </div>
      )}
    </header>
  );
};
