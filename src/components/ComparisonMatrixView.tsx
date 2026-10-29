import React, { useState } from 'react';
import { Table2, Plus, Star, Trash2, Info, ChevronRight, HelpCircle } from 'lucide-react';
import { Decision, CriteriaEvaluation, CriteriaScore } from '../types/decision';

interface ComparisonMatrixViewProps {
  decision: Decision;
  onUpdateDecision: (updated: Decision) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const { comparisonMatrix, options } = decision;
  const [editingCell, setEditingCell] = useState<{ criteriaId: string; optionId: string } | null>(null);

  // Add new criterion state
  const [isAddingCriterion, setIsAddingCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(4);
  const [newCritDesc, setNewCritDesc] = useState('');

  // Handle criterion weight update
  const handleWeightChange = (critId: string, newWeight: number) => {
    const updatedCriteria = comparisonMatrix.criteria.map((c) =>
      c.id === critId ? { ...c, weight: newWeight } : c
    );

    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        ...comparisonMatrix,
        criteria: updatedCriteria,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle cell score update
  const handleScoreChange = (critId: string, optionId: string, newScore: number) => {
    const updatedScores = comparisonMatrix.scores.map((s) => {
      if (s.criteriaId !== critId) return s;
      return {
        ...s,
        optionScores: {
          ...s.optionScores,
          [optionId]: {
            score: newScore,
            rationale: s.optionScores[optionId]?.rationale || 'Adjusted by user',
          },
        },
      };
    });

    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        ...comparisonMatrix,
        scores: updatedScores,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Add custom criterion
  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newId = `crit_usr_${Date.now()}`;
    const newCriterion: CriteriaEvaluation = {
      id: newId,
      name: newCritName.trim(),
      weight: newCritWeight,
      description: newCritDesc.trim() || 'Custom user criterion',
    };

    // Initialize scores for all options
    const optionScoresRecord: Record<string, { score: number; rationale: string }> = {};
    options.forEach((opt) => {
      optionScoresRecord[opt.id] = {
        score: 7,
        rationale: 'User added criterion - default baseline score',
      };
    });

    const newScoreRow: CriteriaScore = {
      criteriaId: newId,
      optionScores: optionScoresRecord,
    };

    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        criteria: [...comparisonMatrix.criteria, newCriterion],
        scores: [...comparisonMatrix.scores, newScoreRow],
      },
      updatedAt: new Date().toISOString(),
    });

    setNewCritName('');
    setNewCritDesc('');
    setIsAddingCriterion(false);
  };

  // Delete criterion
  const handleDeleteCriterion = (critId: string) => {
    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        criteria: comparisonMatrix.criteria.filter((c) => c.id !== critId),
        scores: comparisonMatrix.scores.filter((s) => s.criteriaId !== critId),
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Calculate composite weighted score for each option
  const computeCompositeScores = () => {
    const results: Record<string, { totalWeighted: number; maxPossible: number; normalizedPercent: number }> = {};

    options.forEach((opt) => {
      let totalWeighted = 0;
      let totalWeights = 0;

      comparisonMatrix.criteria.forEach((crit) => {
        const scoreRow = comparisonMatrix.scores.find((s) => s.criteriaId === crit.id);
        const cell = scoreRow?.optionScores[opt.id];
        const score = cell ? cell.score : 5;
        totalWeighted += score * crit.weight;
        totalWeights += crit.weight * 10;
      });

      const normalizedPercent = totalWeights > 0 ? Math.round((totalWeighted / totalWeights) * 100) : 0;
      results[opt.id] = { totalWeighted, maxPossible: totalWeights, normalizedPercent };
    });

    return results;
  };

  const compositeScores = computeCompositeScores();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Table2 className="w-4 h-4 text-indigo-400" />
            <span>Multi-Criteria Decision Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side evaluation scored from 1 to 10 against critical operational and personal criteria.
          </p>
        </div>

        <button
          onClick={() => setIsAddingCriterion(!isAddingCriterion)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Custom Criterion</span>
        </button>
      </div>

      {/* Add Criterion Form */}
      {isAddingCriterion && (
        <form
          onSubmit={handleAddCriterion}
          className="p-4 bg-slate-900 border border-indigo-500/30 rounded-xl space-y-3 animate-fadeIn"
        >
          <div className="text-xs font-semibold text-indigo-300">
            Add New Evaluation Dimension
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newCritName}
                onChange={(e) => setNewCritName(e.target.value)}
                placeholder="Criterion Name (e.g., Relocation Friction, Tech Stack Modernity)"
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <select
                value={newCritWeight}
                onChange={(e) => setNewCritWeight(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              >
                {[1, 2, 3, 4, 5].map((w) => (
                  <option key={w} value={w}>
                    Weight {w} {w === 5 ? '(Critical)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <input
              type="text"
              value={newCritDesc}
              onChange={(e) => setNewCritDesc(e.target.value)}
              placeholder="Brief description of what this criterion measures"
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingCriterion(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
            >
              Insert Dimension
            </button>
          </div>
        </form>
      )}

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70">
                <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-wider w-1/3 min-w-[240px]">
                  Evaluation Criteria & Importance
                </th>
                {options.map((opt) => (
                  <th
                    key={opt.id}
                    className="p-4 text-xs font-bold text-slate-200 min-w-[240px] border-l border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{opt.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                      {opt.tagline}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {comparisonMatrix.criteria.map((crit) => {
                const scoreRow = comparisonMatrix.scores.find((s) => s.criteriaId === crit.id);
                return (
                  <tr key={crit.id} className="hover:bg-slate-800/30 transition-colors group">
                    {/* Criterion info column */}
                    <td className="p-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-100 text-sm">
                            {crit.name}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                            {crit.description}
                          </div>
                        </div>
                        {comparisonMatrix.criteria.length > 2 && (
                          <button
                            onClick={() => handleDeleteCriterion(crit.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                            title="Remove criterion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Weight selector */}
                      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60">
                        <span className="text-[11px] text-slate-500 font-medium">Weight:</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((w) => (
                            <button
                              key={w}
                              onClick={() => handleWeightChange(crit.id, w)}
                              className={`p-0.5 rounded transition-colors ${
                                w <= crit.weight ? 'text-indigo-400' : 'text-slate-700 hover:text-slate-500'
                              }`}
                              title={`Set weight to ${w}`}
                            >
                              <Star className="w-3 h-3 fill-current" />
                            </button>
                          ))}
                        </div>
                        <span className="font-mono tabular-nums text-[11px] text-slate-300 font-semibold ml-1">
                          {crit.weight}x
                        </span>
                      </div>
                    </td>

                    {/* Option scores */}
                    {options.map((opt) => {
                      const cell = scoreRow?.optionScores[opt.id] || { score: 5, rationale: '' };
                      const isEditing =
                        editingCell?.criteriaId === crit.id && editingCell?.optionId === opt.id;

                      return (
                        <td
                          key={opt.id}
                          className="p-4 align-top border-l border-slate-800/60 bg-slate-950/20"
                        >
                          <div className="space-y-2">
                            {/* Score Display and Mini Stepper */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center justify-center font-mono tabular-nums text-sm font-extrabold px-2 py-0.5 rounded-md ${
                                    cell.score >= 8
                                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                      : cell.score >= 5
                                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  }`}
                                >
                                  {cell.score}
                                  <span className="text-[10px] font-normal opacity-70 ml-0.5">/10</span>
                                </span>
                              </div>

                              {/* Quick adjuster slider/buttons */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    handleScoreChange(crit.id, opt.id, Math.max(1, cell.score - 1))
                                  }
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                                  title="Decrease score"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() =>
                                    handleScoreChange(crit.id, opt.id, Math.min(10, cell.score + 1))
                                  }
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold"
                                  title="Increase score"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Qualitative Rationale */}
                            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                              {cell.rationale}
                            </p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Summary / Total Row */}
              <tr className="bg-slate-950/90 font-bold border-t-2 border-slate-800 text-slate-100">
                <td className="p-4">
                  <div className="text-sm font-bold text-white uppercase tracking-wider">
                    Overall Weighted Fit
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                    Normalized score factoring all criterion importance multipliers
                  </div>
                </td>
                {options.map((opt) => {
                  const comp = compositeScores[opt.id];
                  const isWinner = opt.id === decision.tiebreakerVerdict.recommendedOptionId;
                  return (
                    <td
                      key={opt.id}
                      className={`p-4 border-l border-slate-800 ${
                        isWinner ? 'bg-indigo-950/40' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xl font-extrabold text-white tabular-nums">
                            {comp?.normalizedPercent}%
                          </span>
                          {isWinner && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Top Scorer
                            </span>
                          )}
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isWinner
                                ? 'bg-indigo-500'
                                : 'bg-slate-600'
                            }`}
                            style={{ width: `${comp?.normalizedPercent || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
