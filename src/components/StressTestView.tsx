import React, { useState } from 'react';
import { HelpCircle, Sparkles, AlertTriangle, ArrowRight, Lightbulb, Loader2, Send } from 'lucide-react';
import { Decision, StressTestResponse } from '../types/decision';

interface StressTestViewProps {
  decision: Decision;
}

const PRESET_QUESTIONS = [
  'What is the single biggest blind spot or hidden trap I am ignoring?',
  'What if the macroeconomic or industry conditions deteriorate by 25%?',
  'What would have to be true for the losing option to become the obvious winner?',
  'What low-risk experiment can I run over the next 14 days before committing?',
  'Is there an unorthodox third hybrid path that combines the best of both?',
];

export const StressTestView: React.FC<StressTestViewProps> = ({ decision }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<StressTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunStressTest = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setQuestion(queryText);

    try {
      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          question: queryText.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Stress test failed.');
      }

      const data = await res.json();
      setActiveResponse(data);
    } catch (err: any) {
      setError(err.message || 'Unable to execute stress test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Decision Stress-Testing & Devil's Advocate</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Robust decisions survive harsh scrutiny. Pressure-test your options against tail-risk scenarios, blind spots, and counterfactuals before making an irreversible commitment.
        </p>

        {/* Preset quick test chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Instant Pressure Tests:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleRunStressTest(q)}
                disabled={isLoading}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRunStressTest(question);
              }
            }}
            placeholder="Pose a custom scenario: 'What if I hate the manager after 3 months?' or 'What if my spouse objects?'"
            className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleRunStressTest(question)}
            disabled={isLoading || !question.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
          <div className="text-xs font-medium text-slate-300">
            Simulating counterfactual scenarios and stress-testing decision boundaries...
          </div>
        </div>
      )}

      {/* Results View */}
      {activeResponse && !isLoading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Direct Analysis */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>Stress-Test Simulation Output</span>
            </div>
            <div className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              {activeResponse.answer}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unconsidered Risks */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
                <span>Unconsidered Risks & Traps</span>
              </div>
              <div className="space-y-2">
                {activeResponse.keyRisks.map((risk, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Counterfactual Inversion */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4" />
                <span>The Counterfactual Inversion</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <p className="text-slate-400 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                  What would have to change for the other path to win:
                </p>
                <p className="text-slate-200 italic">
                  &ldquo;{activeResponse.counterFactual}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Concrete Pre-Commitment Experiments */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>Recommended Pre-Commitment Experiments (Before You Pull The Trigger)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeResponse.nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-1.5"
                >
                  <div className="font-mono text-[10px] text-emerald-400 font-bold">
                    EXPERIMENT 0{idx + 1}
                  </div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
