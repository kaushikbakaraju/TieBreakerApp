/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { VerdictView } from './components/VerdictView';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SWOTView } from './components/SWOTView';
import { StressTestView } from './components/StressTestView';
import { DecisionCreator } from './components/DecisionCreator';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { Decision } from './types/decision';
import { SAMPLE_DECISION } from './data/sampleDecisions';
import { Scale, Sparkles, Plus, AlertCircle, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_decisions_v1';

export default function App() {
  const [savedDecisions, setSavedDecisions] = useState<Decision[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return [SAMPLE_DECISION];
  });

  const [activeDecisionId, setActiveDecisionId] = useState<string>(
    savedDecisions[0]?.id || SAMPLE_DECISION.id
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('verdict');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedDecisions]);

  const activeDecision =
    savedDecisions.find((d) => d.id === activeDecisionId) || savedDecisions[0] || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateDecision = async (data: {
    decisionPrompt: string;
    options: string[];
    context: string;
    customCriteria: string[];
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to synthesize decision.');
      }

      const newDecision: Decision = await res.json();
      setSavedDecisions((prev) => [newDecision, ...prev]);
      setActiveDecisionId(newDecision.id);
      setActiveTab('verdict');
      showToast('Decision synthesized successfully!');
    } catch (err: any) {
      console.error('Decision creation failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDecision = (updated: Decision) => {
    setSavedDecisions((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleDeleteDecision = (id: string) => {
    const remaining = savedDecisions.filter((d) => d.id !== id);
    setSavedDecisions(remaining);
    if (activeDecisionId === id) {
      setActiveDecisionId(remaining[0]?.id || '');
    }
    showToast('Decision removed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navigation */}
      <Header
        decision={activeDecision}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewDecision={() => setIsCreatorOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExport={() => setIsExportOpen(true)}
        savedCount={savedDecisions.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-semibold text-white shadow-xl shadow-indigo-950/40 animate-fadeIn flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {activeDecision ? (
          <div>
            {activeTab === 'verdict' && (
              <VerdictView decision={activeDecision} />
            )}
            {activeTab === 'proscons' && (
              <ProsConsView
                decision={activeDecision}
                onUpdateDecision={handleUpdateDecision}
              />
            )}
            {activeTab === 'matrix' && (
              <ComparisonMatrixView
                decision={activeDecision}
                onUpdateDecision={handleUpdateDecision}
              />
            )}
            {activeTab === 'swot' && (
              <SWOTView
                decision={activeDecision}
                onUpdateDecision={handleUpdateDecision}
              />
            )}
            {activeTab === 'stresstest' && (
              <StressTestView decision={activeDecision} />
            )}
          </div>
        ) : (
          /* Empty State when no decision exists */
          <div className="text-center py-20 px-4 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              No Active Decisions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Start by framing any career, business, architectural, or life dilemma. The Tiebreaker will build a weighted pros & cons list, multi-criteria table, and SWOT matrix.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsCreatorOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                + Frame Your First Decision
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-4 lg:px-8 py-5 mt-auto bg-slate-950/60 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">The Tiebreaker</span>
            <span>·</span>
            <span>Intelligent Decision Studio</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>·</span>
            <span>Bezos Type 1 & 2 Framework</span>
            <span>·</span>
            <span>Client Persistence</span>
          </div>
        </div>
      </footer>

      {/* Decision Creator Modal */}
      <DecisionCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSubmit={handleCreateDecision}
        isLoading={isLoading}
      />

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        activeDecisionId={activeDecision?.id || null}
        onSelectDecision={(d) => {
          setActiveDecisionId(d.id);
          setActiveTab('verdict');
        }}
        onDeleteDecision={handleDeleteDecision}
        onNewDecision={() => {
          setIsHistoryOpen(false);
          setIsCreatorOpen(true);
        }}
      />

      {/* Export Report Modal */}
      {activeDecision && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          decision={activeDecision}
        />
      )}
    </div>
  );
}
