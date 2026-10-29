import React, { useState } from 'react';
import { Grid2X2, Shield, Wrench, TrendingUp, AlertTriangle, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Decision, SWOTItem, OptionData } from '../types/decision';

interface SWOTViewProps {
  decision: Decision;
  onUpdateDecision: (updated: Decision) => void;
}

export const SWOTView: React.FC<SWOTViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(decision.options[0]?.id || '');

  // Add new SWOT item state
  const [addingQuadrant, setAddingQuadrant] = useState<'strengths' | 'weaknesses' | 'opportunities' | 'threats' | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newAction, setNewAction] = useState('');

  const currentOption = decision.options.find((o) => o.id === activeOptionId) || decision.options[0];

  const handleAddItem = (quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    if (!newTitle.trim()) return;

    const newItem: SWOTItem = {
      id: `swot_${Date.now()}`,
      title: newTitle.trim(),
      detail: newDetail.trim() || 'Custom strategic factor',
      action: newAction.trim() || 'Monitor and adapt',
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return {
        ...opt,
        swot: {
          ...opt.swot,
          [quadrant]: [...opt.swot[quadrant], newItem],
        },
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });

    setNewTitle('');
    setNewDetail('');
    setNewAction('');
    setAddingQuadrant(null);
  };

  const handleDeleteItem = (quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      return {
        ...opt,
        swot: {
          ...opt.swot,
          [quadrant]: opt.swot[quadrant].filter((_, i) => i !== index),
        },
      };
    });

    onUpdateDecision({
      ...decision,
      options: updatedOptions,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header & Option Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Grid2X2 className="w-4 h-4 text-indigo-400" />
            <span>Strategic SWOT Framework</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal Strengths & Weaknesses vs. External Opportunities & Threats with tactical response plays.
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto w-full sm:w-auto">
          {decision.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveOptionId(opt.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                currentOption.id === opt.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 SWOT Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quadrant 1: Strengths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Strengths</h3>
                <span className="text-[11px] text-slate-400">Internal Positive Drivers</span>
              </div>
            </div>
            <button
              onClick={() => setAddingQuadrant(addingQuadrant === 'strengths' ? null : 'strengths')}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* New Strength Form */}
          {addingQuadrant === 'strengths' && (
            <div className="p-3 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-2 text-xs animate-fadeIn">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Strength headline (e.g., Unrivaled Autonomy)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Context or evidence"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Tactical action: How to leverage this"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAddingQuadrant(null)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('strengths')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                >
                  Save Strength
                </button>
              </div>
            </div>
          )}

          {/* Strengths List */}
          <div className="space-y-3">
            {currentOption.swot.strengths.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteItem('strengths', idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.detail}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-emerald-300 font-medium">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span><strong>Tactical Action:</strong> {item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: Weaknesses */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                W
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Weaknesses</h3>
                <span className="text-[11px] text-slate-400">Internal Friction & Deficits</span>
              </div>
            </div>
            <button
              onClick={() => setAddingQuadrant(addingQuadrant === 'weaknesses' ? null : 'weaknesses')}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* New Weakness Form */}
          {addingQuadrant === 'weaknesses' && (
            <div className="p-3 bg-slate-950/80 border border-amber-500/30 rounded-xl space-y-2 text-xs animate-fadeIn">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Weakness headline (e.g., Absence of SRE Support)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Context or impact"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Tactical action: How to mitigate"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAddingQuadrant(null)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('weaknesses')}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium"
                >
                  Save Weakness
                </button>
              </div>
            </div>
          )}

          {/* Weaknesses List */}
          <div className="space-y-3">
            {currentOption.swot.weaknesses.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteItem('weaknesses', idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.detail}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-amber-300 font-medium">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span><strong>Tactical Action:</strong> {item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Opportunities */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                O
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Opportunities</h3>
                <span className="text-[11px] text-slate-400">External Tailwinds & Upside</span>
              </div>
            </div>
            <button
              onClick={() => setAddingQuadrant(addingQuadrant === 'opportunities' ? null : 'opportunities')}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* New Opportunity Form */}
          {addingQuadrant === 'opportunities' && (
            <div className="p-3 bg-slate-950/80 border border-blue-500/30 rounded-xl space-y-2 text-xs animate-fadeIn">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Opportunity headline (e.g., Executive VP Track)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Context or catalyst"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Tactical action: How to seize this"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAddingQuadrant(null)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('opportunities')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Save Opportunity
                </button>
              </div>
            </div>
          )}

          {/* Opportunities List */}
          <div className="space-y-3">
            {currentOption.swot.opportunities.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteItem('opportunities', idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.detail}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-blue-300 font-medium">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
                  <span><strong>Tactical Action:</strong> {item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: Threats */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                T
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Threats</h3>
                <span className="text-[11px] text-slate-400">External Risks & Market Hazards</span>
              </div>
            </div>
            <button
              onClick={() => setAddingQuadrant(addingQuadrant === 'threats' ? null : 'threats')}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* New Threat Form */}
          {addingQuadrant === 'threats' && (
            <div className="p-3 bg-slate-950/80 border border-rose-500/30 rounded-xl space-y-2 text-xs animate-fadeIn">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Threat headline (e.g., Venture Financing Contraction)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Risk context"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Tactical action: How to defend against this"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAddingQuadrant(null)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('threats')}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
                >
                  Save Threat
                </button>
              </div>
            </div>
          )}

          {/* Threats List */}
          <div className="space-y-3">
            {currentOption.swot.threats.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteItem('threats', idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.detail}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-rose-300 font-medium">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <span><strong>Tactical Action:</strong> {item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
