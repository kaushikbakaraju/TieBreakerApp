import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, X, ChevronDown, ChevronUp, Compass, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { PRESET_PROMPTS } from '../data/sampleDecisions';

interface DecisionCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    decisionPrompt: string;
    options: string[];
    context: string;
    customCriteria: string[];
  }) => Promise<void>;
  isLoading: boolean;
}

export const DecisionCreator: React.FC<DecisionCreatorProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [decisionPrompt, setDecisionPrompt] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCriteria, setCustomCriteria] = useState<string[]>([]);
  const [criterionInput, setCriterionInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer effect when loading
  React.useEffect(() => {
    let timer: any = null;
    if (isLoading) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleAddCriterion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = criterionInput.trim();
    if (trimmed && !customCriteria.includes(trimmed)) {
      setCustomCriteria([...customCriteria, trimmed]);
      setCriterionInput('');
    }
  };

  const handleRemoveCriterion = (item: string) => {
    setCustomCriteria(customCriteria.filter((c) => c !== item));
  };

  const handleLoadPreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setDecisionPrompt(preset.prompt);
    setOptions(preset.options);
    setContext(preset.context);
    setCustomCriteria(preset.criteria);
    setShowAdvanced(true);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validPrompt = decisionPrompt.trim();
    if (!validPrompt) {
      setErrorMessage('Please describe the decision you need to make.');
      return;
    }

    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      setErrorMessage('Please provide at least 2 distinct options to compare (e.g., Option A vs Option B).');
      return;
    }

    try {
      await onSubmit({
        decisionPrompt: validPrompt,
        options: validOptions,
        context: context.trim(),
        customCriteria,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze decision. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <Compass className="w-4 h-4" />
              <span>Frame Your Dilemma</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              What decision do you need to break?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Provide your question and candidate paths. The Tiebreaker will analyze pros, cons, comparison metrics, and SWOT forces.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset quick picks */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Or test with a popular real-world scenario:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className="text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.options.join(' vs ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {errorMessage && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Decision Question */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Decision Question <span className="text-indigo-400">*</span>
            </label>
            <textarea
              rows={2}
              value={decisionPrompt}
              onChange={(e) => setDecisionPrompt(e.target.value)}
              placeholder="e.g., Should I switch careers into product management or stay on the technical staff track?"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
              required
            />
          </div>

          {/* Options List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Options to Compare <span className="text-indigo-400">*</span>
              </label>
              {options.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Path</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-400 shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)} (e.g. ${
                      index === 0 ? 'Accept the Series A Offer' : 'Stay at Current Company'
                    })`}
                    className="flex-1 px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Constraints Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              <span>{showAdvanced ? 'Hide' : 'Add'} Context & Evaluation Criteria (Optional)</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Circumstances & Constraints
                  </label>
                  <textarea
                    rows={2}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Financial runway: 10 months; have two young kids; risk tolerance is moderate; want to prioritize long-term autonomy."
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specific Criteria to Score Against
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={criterionInput}
                      onChange={(e) => setCriterionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCriterion();
                        }
                      }}
                      placeholder="e.g., Career Longevity, Stress, Cash Flow, Autonomy"
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCriterion()}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {customCriteria.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {customCriteria.map((crit, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md"
                        >
                          <span>{crit}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCriterion(crit)}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Loading status bar with elapsed seconds */}
          {isLoading && (
            <div className="p-3 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-medium flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Synthesizing pros & cons, matrix, and SWOT...</span>
                </span>
                <span className="font-mono text-slate-400 tabular-nums text-[11px]">
                  {elapsedSeconds}s / &lt;60s
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(Math.max((elapsedSeconds / 15) * 100, 10), 95)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing ({elapsedSeconds}s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Break the Tie</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
