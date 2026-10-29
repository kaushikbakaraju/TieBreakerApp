import { Decision, StressTestResponse } from '../types/decision';

export function generateIntelligentDecisionFallback(
  decisionPrompt: string,
  options: string[],
  context?: string,
  customCriteria?: string[]
): Decision {
  const optA = options[0] || 'Option A';
  const optB = options[1] || 'Option B';
  const optC = options[2] || null;

  const title = decisionPrompt.length > 70
    ? `${optA} vs ${optB}`
    : decisionPrompt.replace(/\?+$/, '');

  const isIrreversible =
    /buy|purchase|mortgage|marriage|relocat|quit|retire|surgery|children|divorce/i.test(
      decisionPrompt + (context || '')
    );

  const reversibilityScore = isIrreversible ? 3.5 : 7.8;
  const classification = isIrreversible
    ? 'Type 1 (One-way door)'
    : ('Type 2 (Two-way door)' as const);

  const criteriaNames =
    customCriteria && customCriteria.length >= 3
      ? customCriteria.slice(0, 4)
      : [
          'Immediate Execution Velocity',
          'Long-term Upside & Growth',
          'Downside Risk & Reversibility',
          'Cognitive Load & Peace of Mind',
        ];

  const parsedOptions = options.map((optName, idx) => {
    const isFirst = idx === 0;
    const optId = `opt_${idx + 1}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      id: optId,
      name: optName,
      tagline: isFirst
        ? 'High-leverage upside with elevated initial commitment'
        : 'Predictable baseline stability with controlled risk exposure',
      pros: [
        {
          id: `pro_${idx}_1`,
          text: isFirst
            ? `Direct ownership and accelerated learning in ${optName}`
            : `Substantially lower operational friction and established ecosystem`,
          weight: 5,
          category: isFirst ? 'Growth' : 'Stability',
          explanation: `Allows you to capture compounding benefits without organizational inertia.`,
        },
        {
          id: `pro_${idx}_2`,
          text: isFirst
            ? `Unlocks new optionality and career leverage over a 2-3 year horizon`
            : `Preserves bandwidth and protects against downside volatility`,
          weight: 4,
          category: isFirst ? 'Strategic' : 'Risk Management',
          explanation: `Balances trade-offs while keeping commitments manageable.`,
        },
        {
          id: `pro_${idx}_3`,
          text: isFirst
            ? `Avoids the regret of passive inaction`
            : `Provides immediate operational predictability`,
          weight: 4,
          category: 'Fulfillment',
          explanation: `Aligns with realistic capacity constraints and personal priorities.`,
        },
      ],
      cons: [
        {
          id: `con_${idx}_1`,
          text: isFirst
            ? `Steeper initial learning curve and higher transition friction`
            : `Opportunity cost of foregoing the potential upside of ${optA}`,
          weight: 4,
          category: isFirst ? 'Stress' : 'Opportunity Cost',
          explanation: `Transition costs can feel daunting during the first 60-90 days.`,
          mitigation: isFirst
            ? `Define a strict 90-day checkpoint to review measurable progress before escalating commitment.`
            : `Carve out 10% discretionary time to experiment with ${optA} in a sandbox.`,
        },
        {
          id: `con_${idx}_2`,
          text: isFirst
            ? `Less external support infrastructure during early execution`
            : `Risk of eventual stagnation if external conditions shift rapidly`,
          weight: 3,
          category: 'Risk',
          explanation: `Requires discipline to maintain forward momentum.`,
          mitigation: `Set quarterly benchmark audits to ensure goals remain active.`,
        },
        {
          id: `con_${idx}_3`,
          text: isFirst
            ? `Higher cognitive load during the initial rollout`
            : `May postpone a necessary transformation`,
          weight: 3,
          category: 'Time',
          explanation: `Demands emotional resilience and patience.`,
          mitigation: `Focus on incremental milestones rather than an all-or-nothing leap.`,
        },
      ],
      swot: {
        strengths: [
          {
            title: isFirst ? 'Asymmetrical Upside' : 'Proven Resilience',
            detail: isFirst
              ? `Captures outsized returns if execution succeeds.`
              : `Robust foundation with zero unforced errors.`,
            action: isFirst
              ? `Double down on core differentiators in week one.`
              : `Consolidate existing gains into automated routines.`,
          },
          {
            title: 'High Clarity of Action',
            detail: `Clear milestones and immediate feedback loops.`,
            action: `Establish public accountability checkpoints.`,
          },
        ],
        weaknesses: [
          {
            title: isFirst ? 'Resource Intensity' : 'Inertia Bias',
            detail: isFirst
              ? `Requires significant mental and temporal investment.`
              : `Comfortable defaults can mask gradual atrophy.`,
            action: isFirst
              ? `Schedule mandatory rest buffers to prevent burnout.`
              : `Force an annual review of alternative paths.`,
          },
          {
            title: 'Early Uncertainty',
            detail: `Outcomes are probabilistic rather than guaranteed.`,
            action: `Maintain a liquid buffer to absorb variance.`,
          },
        ],
        opportunities: [
          {
            title: 'Market Timing Advantage',
            detail: `Entering early builds compound advantages.`,
            action: `Secure early pilot references or quick wins.`,
          },
          {
            title: 'Skill Modernization',
            detail: `Enhances rare, valuable capabilities for future decisions.`,
            action: `Document learnings publicly to build credibility.`,
          },
        ],
        threats: [
          {
            title: 'External Volatility',
            detail: `Macro factors or industry changes outside your control.`,
            action: `Set clear pre-mortem stop-loss criteria.`,
          },
          {
            title: 'Premature Abandonment',
            detail: `Giving up in the dip before exponential payoff arrives.`,
            action: `Commit to a minimum 6-month trial before evaluating.`,
          },
        ],
      },
    };
  });

  const criteria = criteriaNames.map((name, i) => ({
    id: `crit_${i + 1}`,
    name,
    weight: i === 0 ? 5 : i === 1 ? 5 : 4,
    description: `Evaluates ${name.toLowerCase()} for each path.`,
  }));

  const scores = criteria.map((crit, cIdx) => {
    const optionScores: Record<string, { score: number; rationale: string }> = {};
    parsedOptions.forEach((opt, oIdx) => {
      const baseScore = cIdx === 0 ? (oIdx === 0 ? 8.5 : 7.0) : oIdx === 0 ? 8.0 : 7.5;
      optionScores[opt.id] = {
        score: baseScore,
        rationale:
          oIdx === 0
            ? `${opt.name} delivers higher leverage under ${crit.name.toLowerCase()}.`
            : `${opt.name} maintains superior stability under ${crit.name.toLowerCase()}.`,
      };
    });
    return { criteriaId: crit.id, optionScores };
  });

  const recommendedOption = parsedOptions[0];

  return {
    id: `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    summary: `A core tension between ${optA} (maximizing upside & autonomy) versus ${optB} (minimizing downside volatility & switching cost).`,
    context: context || 'Standard operational realities and personal capacity limits.',
    decisionType: {
      classification,
      reversibilityScore,
      rationale: isIrreversible
        ? `This choice carries compounding secondary consequences that are costly to undo. Treat it as a Type 1 door: deliberate carefully, consult external counsel, and ensure financial/emotional reserves.`
        : `This choice is substantially reversible (Type 2 door). If results lag after 6-12 months, you can course-correct with modest switching cost. Bias for action rather than protracted analysis paralysis.`,
    },
    options: parsedOptions,
    comparisonMatrix: {
      criteria,
      scores,
    },
    tiebreakerVerdict: {
      recommendedOptionId: recommendedOption.id,
      confidence: 'Moderate',
      ruling: `Choose ${optA}. Because ${
        isIrreversible ? 'the long-term upside justifies the calculated risk' : 'this path is reversible and offers superior growth optionality'
      }, the risk of inaction or safe stagnation exceeds the friction of execution. Commit with clear 90-day guardrails.`,
      decidingFactor: `Optionality & Reversibility: The value of testing your upper bound while you have the capability and motivation outweighs the comfort of default preservation.`,
      conditionalRules: [
        {
          condition: `If your financial runway is under 4 months or your baseline stress is already near burnout`,
          recommendation: `Choose ${optB} to consolidate energy and avoid catastrophic downside.`,
        },
        {
          condition: `If you have sufficient emotional support and your primary goal is 3-year compounding growth`,
          recommendation: `Choose ${optA} with immediate bias for action.`,
        },
      ],
      theOneQuestion: `Three years from now, which path would cause deeper regret if you never attempted it?`,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateStressTestFallback(
  decisionTitle: string,
  question: string
): StressTestResponse {
  return {
    answer: `Pressure-testing "${decisionTitle}" against: "${question}".\n\nWhen evaluating high-uncertainty scenarios, the critical vulnerability is rarely the known risks—it is the assumption that baseline conditions remain constant while you execute. If this scenario unfolds, your first priority must be defending your optionality and avoiding debt or burnout spirals before attempting to force an outcome.`,
    keyRisks: [
      `Underestimating the psychological toll of prolonged ambiguity during early execution.`,
      `Failing to define explicit kill-criteria or exit checkpoints before emotions cloud judgment.`,
      `Sunk-cost fallacy leading to doubling down when early assumptions are invalidated.`,
    ],
    counterFactual: `For the alternative path to become the indisputable winner, your primary constraints would need to flip: either severe capital shortages or a 50% drop in your personal risk tolerance.`,
    nextSteps: [
      `Interview 2 people who made this exact choice 18 months ago and ask what they wish they knew.`,
      `Define a concrete "circuit breaker" metric: what specific signal will trigger a pivot without shame?`,
      `Run a 7-day mini-simulation or sandbox trial to experience the day-to-day friction firsthand.`,
    ],
  };
}
