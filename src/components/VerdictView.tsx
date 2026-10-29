import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, HelpCircle, Sparkles, SplitSquareVertical, HeartHandshake } from 'lucide-react';
import { Decision } from '../types/decision';

interface VerdictViewProps {
  decision: Decision;
  onSelectOption?: (optionId: string) => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({ decision }) => {
  const { tiebreakerVerdict, decisionType, options } = decision;
  const recommendedOpt = options.find((o) => o.id === tiebreakerVerdict.recommendedOptionId) || options[0];

  // Coin flip state
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<string | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  const handleCoinFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setFlipResult(options[randomIndex].name);
      setIsFlipping(false);
      setFlipCount((prev) => prev + 1);
    }, 1200);
  };

  const isType1 = decisionType.classification.includes('Type 1');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: The Tiebreaker Ruling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>The Tiebreaker Ruling</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono text-[11px] font-normal">
                Confidence: <strong className="text-indigo-300 font-semibold">{tiebreakerVerdict.confidence}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {decision.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {decision.summary}
            </p>
          </div>

          {/* Recommended Winner Card */}
          <div className="w-full lg:w-auto shrink-0 bg-indigo-950/70 border border-indigo-500/40 rounded-xl p-4 sm:px-6 sm:py-4">
            <div className="text-[11px] font-medium tracking-wide uppercase text-indigo-300">
              Recommended Path
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mt-0.5 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{recommendedOpt.name}</span>
            </div>
            <div className="text-xs text-indigo-200/80 mt-1 max-w-xs">
              {recommendedOpt.tagline}
            </div>
          </div>
        </div>

        {/* Narrative Ruling & Deciding Factor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-400">
              Executive Synthesis
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
              {tiebreakerVerdict.ruling}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-amber-400/90">
              The Deciding Hinge
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              {tiebreakerVerdict.decidingFactor}
            </div>
          </div>
        </div>
      </section>

      {/* Bezos Reversibility & Door Framework */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SplitSquareVertical className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold tracking-tight text-white uppercase">
                Reversibility & Bezos Door Classification
              </h2>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide ${
                isType1
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {decisionType.classification}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {decisionType.rationale}
          </p>

          {/* Reversibility Score Meter */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Reversibility Index</span>
              <span className="font-mono text-sm font-bold text-white tabular-nums">
                {decisionType.reversibilityScore} <span className="text-slate-500 text-xs">/ 10</span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  decisionType.reversibilityScore >= 7
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : decisionType.reversibilityScore >= 4
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-rose-500 to-red-400'
                }`}
                style={{ width: `${Math.min(Math.max(decisionType.reversibilityScore * 10, 5), 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Type 1: One-way Door (High Friction)</span>
              <span>Type 2: Two-way Door (Low Friction)</span>
            </div>
          </div>
        </div>

        {/* The One Piercing Question */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>The Gut-Check Question</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 leading-snug">
              &ldquo;{tiebreakerVerdict.theOneQuestion}&rdquo;
            </h3>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Answer this honestly without intellectualizing. When trade-offs are balanced, your core value hierarchy decides.
          </div>
        </div>
      </section>

      {/* Conditional Decision Rules (If-Then Matrices) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-indigo-400" />
          <span>Conditional Decision Rules</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiebreakerVerdict.conditionalRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="text-xs font-medium text-indigo-300">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider block mb-0.5">Condition</span>
                {rule.condition}
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-200">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rule.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Psychological Coin Flip Simulation */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Still Stuck? Try The Psychological Coin Flip
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Behavioral science shows that when you flip a coin to decide between two options, your subconscious reveals itself: in mid-air, you usually realize which outcome you are praying for.
          </p>
        </div>

        <div className="py-4 flex flex-col items-center justify-center">
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-slate-950 font-extrabold text-sm flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-amber-200 transition-transform duration-500 ${
              isFlipping ? 'animate-spin scale-110' : 'hover:scale-105'
            }`}
          >
            {isFlipping ? '...' : flipResult ? 'RESULT' : 'FLIP'}
          </div>

          <div className="mt-4">
            <button
              onClick={handleCoinFlip}
              disabled={isFlipping}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isFlipping ? 'Flipping in the air...' : 'Flip the Tiebreaker Coin'}
            </button>
          </div>

          {flipResult && (
            <div className="mt-4 p-4 max-w-md bg-slate-950/80 border border-amber-500/30 rounded-xl text-center space-y-2 animate-fadeIn">
              <div className="text-xs text-amber-300 font-medium uppercase tracking-wider">
                Coin Landed On
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {flipResult}
              </div>
              <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
                &ldquo;Notice your visceral reaction right now. Did your heart sink, or did you feel relief? That emotional ping is your true subconscious preference.&rdquo;
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
