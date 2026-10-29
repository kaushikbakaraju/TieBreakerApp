import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Plus, Trash2, ShieldCheck, ChevronDown, ChevronUp, Scale, Star } from 'lucide-react';
import { Decision, OptionData, ProConItem } from '../types/decision';

interface ProsConsViewProps {
  decision: Decision;
  onUpdateDecision: (updated: Decision) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [activeOptionTab, setActiveOptionTab] = useState<string>(decision.options[0]?.id || '');
  const [expandedMitigations, setExpandedMitigations] = useState<Record<string, boolean>>({});

  // New item draft states
  const [newProText, setNewProText] = useState('');
  const [newProWeight, setNewProWeight] = useState(3);
  const [newProCategory, setNewProCategory] = useState('General');

  const [newConText, setNewConText] = useState('');
  const [newConWeight, setNewConWeight] = useState(3);
  const [newConCategory, setNewConCategory] = useState('General');
  const [newConMitigation, setNewConMitigation] = useState('');

  const [addingType, setAddingType] = useState<'pro' | 'con' | null>(null);

  const toggleMitigation = (id: string) => {
    setExpandedMitigations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentOption = decision.options.find((o) => o.id === activeOptionTab) || decision.options[0];

  const handleWeightChange = (optionId: string, itemId: string, isPro: boolean, newWeight: number) => {
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (isPro) {
        return {
          ...opt,
          pros: opt.pros.map((p) => (p.id === itemId ? { ...p, weight: newWeight } : p)),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) => (c.id === itemId ? { ...c, weight: newWeight } : c)),
        };
      }
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteItem = (optionId: string, itemId: string, isPro: boolean) => {
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: isPro ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
        cons: !isPro ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddPro = (optionId: string) => {
    if (!newProText.trim()) return;

    const newItem: ProConItem = {
      id: `pro_usr_${Date.now()}`,
      text: newProText.trim(),
      weight: newProWeight,
      category: newProCategory,
      explanation: 'User-defined custom factor',
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: [...opt.pros, newItem],
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });

    setNewProText('');
    setAddingType(null);
  };

  const handleAddCon = (optionId: string) => {
    if (!newConText.trim()) return;

    const newItem: ProConItem = {
      id: `con_usr_${Date.now()}`,
      text: newConText.trim(),
      weight: newConWeight,
      category: newConCategory,
      explanation: 'User-defined custom downside',
      mitigation: newConMitigation.trim() || undefined,
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        cons: [...opt.cons, newItem],
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });

    setNewConText('');
    setNewConMitigation('');
    setAddingType(null);
  };

  // Helper to compute weighted score for an option
  const computeScores = (opt: OptionData) => {
    const proSum = opt.pros.reduce((acc, p) => acc + (p.weight || 1), 0);
    const conSum = opt.cons.reduce((acc, c) => acc + (c.weight || 1), 0);
    const net = proSum - conSum;
    return { proSum, conSum, net };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Card & Option Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Weighted Pros & Cons Breakdown</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust individual importance weights (1 to 5) to observe how personal priorities shift the net balance.
          </p>
        </div>

        {/* Tab switch for options */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto w-full sm:w-auto">
          {decision.options.map((opt) => {
            const { net } = computeScores(opt);
            return (
              <button
                key={opt.id}
                onClick={() => setActiveOptionTab(opt.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  (activeOptionTab || decision.options[0].id) === opt.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{opt.name}</span>
                <span
                  className={`font-mono tabular-nums text-[10px] px-1.5 py-0.2 rounded ${
                    net > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {net > 0 ? `+${net}` : net}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Option Summary Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Evaluating Path
          </div>
          <div className="text-lg font-bold text-white mt-0.5">
            {currentOption.name}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {currentOption.tagline}
          </div>
        </div>

        {/* Score Tally */}
        {(() => {
          const { proSum, conSum, net } = computeScores(currentOption);
          return (
            <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-400 block">Pros Total</span>
                <span className="font-mono text-sm font-bold text-emerald-300 tabular-nums">+{proSum}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-rose-400 block">Cons Total</span>
                <span className="font-mono text-sm font-bold text-rose-300 tabular-nums">-{conSum}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Net Weighted</span>
                <span
                  className={`font-mono text-base font-extrabold tabular-nums ${
                    net > 0 ? 'text-emerald-400' : net < 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {net > 0 ? `+${net}` : net}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2-Column Pros & Cons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Pros Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-tight">
              <ThumbsUp className="w-4 h-4" />
              <span>Pros & Advantages ({currentOption.pros.length})</span>
            </div>
            <button
              onClick={() => setAddingType(addingType === 'pro' ? null : 'pro')}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pro</span>
            </button>
          </div>

          {/* New Pro Form */}
          {addingType === 'pro' && (
            <div className="p-3.5 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-2.5 animate-fadeIn">
              <div className="text-xs font-semibold text-emerald-300">New Advantage</div>
              <input
                type="text"
                value={newProText}
                onChange={(e) => setNewProText(e.target.value)}
                placeholder="e.g. Higher equity ownership or shorter commute"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Weight (1-5):</span>
                  <select
                    value={newProWeight}
                    onChange={(e) => setNewProWeight(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map((w) => (
                      <option key={w} value={w}>
                        {w} {w === 5 ? '(Dealmaker)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingType(null)}
                    className="px-2.5 py-1 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPro(currentOption.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                  >
                    Save Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pros List */}
          <div className="space-y-3">
            {currentOption.pros.map((pro) => (
              <div
                key={pro.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-medium text-emerald-400/90">{pro.category}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {pro.text}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(currentOption.id, pro.id, true)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {pro.explanation && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pro.explanation}
                  </p>
                )}

                {/* Weight selector */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-500">Importance Weight:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleWeightChange(currentOption.id, pro.id, true, star)}
                        className={`p-0.5 rounded transition-colors ${
                          star <= pro.weight ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'
                        }`}
                        title={`Set weight to ${star}`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ))}
                    <span className="font-mono text-slate-300 font-semibold ml-1 tabular-nums">
                      {pro.weight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cons Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm tracking-tight">
              <ThumbsDown className="w-4 h-4" />
              <span>Cons & Drawbacks ({currentOption.cons.length})</span>
            </div>
            <button
              onClick={() => setAddingType(addingType === 'con' ? null : 'con')}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Con</span>
            </button>
          </div>

          {/* New Con Form */}
          {addingType === 'con' && (
            <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 rounded-xl space-y-2.5 animate-fadeIn">
              <div className="text-xs font-semibold text-rose-300">New Drawback</div>
              <input
                type="text"
                value={newConText}
                onChange={(e) => setNewConText(e.target.value)}
                placeholder="e.g. Higher burnout risk or loss of liquid salary"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={newConMitigation}
                onChange={(e) => setNewConMitigation(e.target.value)}
                placeholder="Optional mitigation strategy to soften this risk"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Severity (1-5):</span>
                  <select
                    value={newConWeight}
                    onChange={(e) => setNewConWeight(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map((w) => (
                      <option key={w} value={w}>
                        {w} {w === 5 ? '(Dealbreaker)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingType(null)}
                    className="px-2.5 py-1 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCon(currentOption.id)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
                  >
                    Save Con
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cons List */}
          <div className="space-y-3">
            {currentOption.cons.map((con) => (
              <div
                key={con.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-medium text-rose-400/90">{con.category}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {con.text}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(currentOption.id, con.id, false)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {con.explanation && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {con.explanation}
                  </p>
                )}

                {/* Mitigation Accordion */}
                {con.mitigation && (
                  <div className="pt-1">
                    <button
                      onClick={() => toggleMitigation(con.id)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Mitigation Strategy</span>
                      {expandedMitigations[con.id] ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    {expandedMitigations[con.id] && (
                      <div className="mt-1.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed animate-fadeIn">
                        {con.mitigation}
                      </div>
                    )}
                  </div>
                )}

                {/* Severity weight selector */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-500">Severity Weight:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleWeightChange(currentOption.id, con.id, false, star)}
                        className={`p-0.5 rounded transition-colors ${
                          star <= con.weight ? 'text-rose-400' : 'text-slate-700 hover:text-slate-500'
                        }`}
                        title={`Set severity to ${star}`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ))}
                    <span className="font-mono text-slate-300 font-semibold ml-1 tabular-nums">
                      {con.weight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
