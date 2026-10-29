import { Decision } from '../types/decision';

export const SAMPLE_DECISION: Decision = {
  id: 'dec_startup_vs_bigtech',
  title: 'Startup Founding Lead vs Big Tech Staff Engineer',
  summary: 'A classic tension between asymmetrical equity upside & autonomy at an early-stage venture versus premier compensation, stability, and scale at an established tech titan.',
  context: '8 years of engineering experience, financially stable with 9 months of emergency savings, starting to feel stagnant in corporate bureaucracy, but cautious about current market volatility.',
  decisionType: {
    classification: 'Type 2 (Two-way door)',
    reversibilityScore: 7.5,
    rationale: 'While joining an early startup carries operational risk, premier big tech engineers can almost always return to enterprise tech if the startup falters within 18-24 months. The brand pedigree and skills remain highly marketable.',
  },
  options: [
    {
      id: 'opt_startup',
      name: 'Founding Lead at Series A Startup',
      tagline: 'High leverage, rapid equity potential & unfiltered agency',
      pros: [
        {
          id: 'pro_st_1',
          text: 'Vastly expanded scope & end-to-end architecture ownership',
          weight: 5,
          category: 'Career Growth',
          explanation: 'You will shape the entire technical stack, interview early hires, and sit directly in product roadmap discussions.',
        },
        {
          id: 'pro_st_2',
          text: 'Uncapped financial upside via significant equity grant',
          weight: 4,
          category: 'Financial',
          explanation: '1.2% equity stake has 10x-50x multiplier potential in the event of an eventual acquisition or IPO.',
        },
        {
          id: 'pro_st_3',
          text: 'Zero bureaucratic politics & lightning-fast execution cadence',
          weight: 5,
          category: 'Fulfillment',
          explanation: 'No multi-quarter RFC committee approvals; build, ship, and validate code with customers daily.',
        },
        {
          id: 'pro_st_4',
          text: 'Steep learning curve in business fundamentals & fundraising',
          weight: 3,
          category: 'Knowledge',
          explanation: 'Exposure to executive strategy, customer acquisition, and venture mechanics that enterprise roles conceal.',
        },
      ],
      cons: [
        {
          id: 'con_st_1',
          text: '28% reduction in liquid base salary + loss of guaranteed annual RSUs',
          weight: 4,
          category: 'Financial',
          explanation: 'Immediate cash-flow restriction requires tighter budgeting and pausing discretionary luxury investments.',
          mitigation: 'Negotiate early milestone-based salary step-ups tied to Series B financing or key ARR goals.',
        },
        {
          id: 'con_st_2',
          text: 'Elevated working hours and unpredictable on-call fires',
          weight: 4,
          category: 'Work-Life Balance',
          explanation: 'Lean team means you personally triage production incidents and work tight delivery sprints.',
          mitigation: 'Establish a structured on-call rotation with co-founders and mandate automated integration testing early.',
        },
        {
          id: 'con_st_3',
          text: 'Inherent venture failure risk (~65% Series A survival rate)',
          weight: 5,
          category: 'Risk',
          explanation: 'Startups can exhaust runway if product-market fit or sales velocity hits unexpected headwinds.',
          mitigation: 'Verify existing runway (minimum 18 months in bank) and maintain active connections with your former network.',
        },
      ],
      swot: {
        strengths: [
          {
            title: 'Unrivaled Autonomy',
            detail: 'Complete architectural latitude and direct influence over engineering culture.',
            action: 'Codify modern developer tooling and clean CI/CD standards from day one.',
          },
          {
            title: 'Close Customer Proximity',
            detail: 'Direct interaction with early enterprise pilot users builds deep empathy and commercial acumen.',
            action: 'Join sales calls weekly to anchor technical priorities in real enterprise buyer pain points.',
          },
        ],
        weaknesses: [
          {
            title: 'Absence of Infrastructure Guardrails',
            detail: 'No dedicated SRE, compliance, or security teams to offload operational load.',
            action: 'Rely strictly on managed cloud PaaS to minimize unnecessary self-hosted maintenance burdens.',
          },
          {
            title: 'Cash Compensation Discount',
            detail: 'Opportunity cost of forfeiting liquid public company RSUs over the next two years.',
            action: 'Budget strictly off the base salary while treating equity purely as long-term lottery upside.',
          },
        ],
        opportunities: [
          {
            title: 'Executive Trajectory (VP of Eng / CTO)',
            detail: 'Successful growth from 6 to 50 engineers elevates you into a seasoned executive bracket.',
            action: 'Seek an external advisor or mentor who has successfully scaled an engineering org through Series C.',
          },
          {
            title: 'Domain Category Leadership',
            detail: 'Being an early pioneer in the startup’s niche creates strong personal brand recognition.',
            action: 'Publish engineering write-ups and open-source non-proprietary utilities to attract talent.',
          },
        ],
        threats: [
          {
            title: 'Market Financing Crunch',
            detail: 'Venture capital contractions could make follow-on financing difficult despite healthy metrics.',
            action: 'Prioritize unit economics and self-sustaining gross margins over reckless customer acquisition.',
          },
          {
            title: 'Co-founder Misalignment',
            detail: 'Disagreements on technical direction or product pivots between early founders.',
            action: 'Have transparent alignment sessions on equity vesting, decision rights, and conflict resolution before signing.',
          },
        ],
      },
    },
    {
      id: 'opt_bigtech',
      name: 'Staff Software Engineer at Big Tech',
      tagline: 'Predictable high compensation, planetary scale & work-life equilibrium',
      pros: [
        {
          id: 'pro_bt_1',
          text: 'Top-of-market guaranteed compensation ($420k+ total package)',
          weight: 5,
          category: 'Financial',
          explanation: 'Liquid public shares, generous 401(k) matching, comprehensive health benefits, and predictable annual refreshers.',
        },
        {
          id: 'pro_bt_2',
          text: 'Planetary infrastructure scale (hundreds of millions of queries)',
          weight: 4,
          category: 'Engineering Scale',
          explanation: 'Architect solutions running across multiple regions with distributed consensus and extreme resilience standards.',
        },
        {
          id: 'pro_bt_3',
          text: 'Predictable hours & generous parental/sabbatical leaves',
          weight: 4,
          category: 'Work-Life Balance',
          explanation: 'Stable 40-hour work week, clear boundaries, and substantial peer redundancy during time off.',
        },
        {
          id: 'pro_bt_4',
          text: 'Robust internal mobility across diverse product divisions',
          weight: 3,
          category: 'Flexibility',
          explanation: 'If a project is cancelled or feels unrewarding, internal transfers can be arranged without re-interviewing.',
        },
      ],
      cons: [
        {
          id: 'con_bt_1',
          text: 'Heavy organizational friction and prolonged consensus cycles',
          weight: 5,
          category: 'Fulfillment',
          explanation: 'Substantial time spent authoring RFCs, navigating multi-team reviews, and negotiating competing OKRs.',
          mitigation: 'Focus on strategic coalition building and pick 1-2 marquee high-leverage initiatives per quarter.',
        },
        {
          id: 'con_bt_2',
          text: 'Narrowed individual impact relative to company size',
          weight: 3,
          category: 'Impact',
          explanation: 'Moving the company needle is challenging when thousands of engineers contribute to the same portfolio.',
          mitigation: 'Measure impact through multiplier effects: mentoring 5 senior engineers and improving org-wide developer latency.',
        },
        {
          id: 'con_bt_3',
          text: 'Reorganization vulnerabilities & corporate risk aversion',
          weight: 4,
          category: 'Risk',
          explanation: 'Shifting executive priorities can result in defunded products or sudden leadership changes.',
          mitigation: 'Anchor your work in core revenue-generating systems rather than speculative experimental labs.',
        },
      ],
      swot: {
        strengths: [
          {
            title: 'Bulletproof Financial Security',
            detail: 'High certainty of liquid wealth accumulation and compound interest acceleration.',
            action: 'Automate index-fund dollar-cost averaging to maximize long-term financial independence.',
          },
          {
            title: 'Institutional Engineering Tooling',
            detail: 'World-class build systems, automated security pipelines, and specialized internal support teams.',
            action: 'Master internal distributed frameworks and document patterns for cross-org adoption.',
          },
        ],
        weaknesses: [
          {
            title: 'Slowed Rate of Personal Scope Expansion',
            detail: 'Staff progression can stall on politics and calibrated performance calibration stacks.',
            action: 'Explicitly establish a Staff-to-Principal career roadmap with your VP of Engineering.',
          },
          {
            title: 'Risk of Skill Atrophy in Scrappy Problem Solving',
            detail: 'Reliance on custom proprietary internal tooling makes external open-source skills rust.',
            action: 'Maintain active open-source side contributions and keep abreast of modern cloud ecosystem standards.',
          },
        ],
        opportunities: [
          {
            title: 'Cross-Organizational Leadership',
            detail: 'Sponsor org-wide architectural transformations impacting hundreds of engineers.',
            action: 'Lead an engineering guild focused on modernizing legacy query latency across service meshes.',
          },
          {
            title: 'Financial Independence Acceleration',
            detail: 'Liquid comp allows achieving FIRE (financial independence) within 5-7 years with disciplined saving.',
            action: 'Construct a conservative wealth accumulation model that provides ultimate career freedom later.',
          },
        ],
        threats: [
          {
            title: 'Golden Handcuffs Complacency',
            detail: 'The comfort of high pay leading to tolerating intellectual stagnation for years.',
            action: 'Conduct an annual personal audit: if learning rate drops below 50% for 6 consecutive months, force an internal team switch.',
          },
          {
            title: 'Enterprise Restructuring & Role Inflation',
            detail: 'Changing corporate tides can dilute the prestige and authority of Staff titles.',
            action: 'Keep your external visibility high through conference speaking and patent filings.',
          },
        ],
      },
    },
  ],
  comparisonMatrix: {
    criteria: [
      {
        id: 'crit_wealth',
        name: 'Financial Upside & Wealth Creation',
        weight: 5,
        description: 'Comparison of liquid guaranteed compensation versus speculative equity multiplier',
      },
      {
        id: 'crit_autonomy',
        name: 'Autonomy & Speed of Execution',
        weight: 5,
        description: 'Ability to make decisions without multi-layer approval chains and committee signoffs',
      },
      {
        id: 'crit_wlb',
        name: 'Work-Life Balance & Stress',
        weight: 4,
        description: 'Predictability of working hours, on-call burden, and mental energy outside work',
      },
      {
        id: 'crit_reversibility',
        name: 'Career Reversibility & Optionality',
        weight: 4,
        description: 'Ease of pivoting or returning if this choice does not meet expectations',
      },
      {
        id: 'crit_learning',
        name: 'Rate of Holistic Growth',
        weight: 4,
        description: 'Acquisition of rare, highly sought-after commercial, strategic, and technical skills',
      },
    ],
    scores: [
      {
        criteriaId: 'crit_wealth',
        optionScores: {
          opt_startup: { score: 7, rationale: 'Extreme upside potential if successful, but carries high variance and liquidity delay.' },
          opt_bigtech: { score: 9, rationale: 'Guaranteed, liquid $420k+ compensation with predictable quarterly vesting.' },
        },
      },
      {
        criteriaId: 'crit_autonomy',
        optionScores: {
          opt_startup: { score: 10, rationale: 'Unchecked autonomy; direct architecture and product authority.' },
          opt_bigtech: { score: 4, rationale: 'Constrained by extensive compliance, RFC committees, and alignment meetings.' },
        },
      },
      {
        criteriaId: 'crit_wlb',
        optionScores: {
          opt_startup: { score: 4, rationale: 'Demanding startup pace, frequent context shifts, and small-team on-call.' },
          opt_bigtech: { score: 8, rationale: 'Consistent 40h weeks with dedicated SRE operations and backup engineers.' },
        },
      },
      {
        criteriaId: 'crit_reversibility',
        optionScores: {
          opt_startup: { score: 8, rationale: 'High-performing Staff engineers can readily boomerang back to Big Tech.' },
          opt_bigtech: { score: 7, rationale: 'Startup opportunities will always exist, but founding roles require optimal timing.' },
        },
      },
      {
        criteriaId: 'crit_learning',
        optionScores: {
          opt_startup: { score: 9, rationale: 'Intense cross-functional exposure to fundraising, sales, and end-to-end architecture.' },
          opt_bigtech: { score: 6, rationale: 'Deep distributed systems mastery, but narrow business and commercial breadth.' },
        },
      },
    ],
  },
  tiebreakerVerdict: {
    recommendedOptionId: 'opt_startup',
    confidence: 'Moderate',
    ruling: 'Take the Founding Lead role at the Startup. Because this is a Type 2 decision (two-way door with 7.5/10 reversibility) and you have 9 months of financial runway, the upside of professional reinvention vastly outweighs the downside. If the venture fails, your Big Tech market value will actually be enhanced by proven zero-to-one delivery experience.',
    decidingFactor: 'Reversibility & Runway: You have sufficient financial cushion and an elite pedigree. The regret of not testing your limits while you have the energy and flexibility will gnaw at you far more than a temporary salary reduction.',
    conditionalRules: [
      {
        condition: 'If you are planning to take out a major mortgage or have an immediate dependent within the next 12 months',
        recommendation: 'Choose Big Tech for maximum financial liquidity and low operational volatility.',
      },
      {
        condition: 'If you feel your learning curve has flattened to under 30% and you find yourself dreading weekly alignment RFCs',
        recommendation: 'Choose the Startup immediately before risk aversion crystallizes.',
      },
    ],
    theOneQuestion: 'In 10 years, looking back at your career, which scenario will produce deeper regret: failing at an ambitious startup attempt, or remaining comfortably safe in enterprise bureaucracy?',
  },
  createdAt: '2026-10-29T05:00:00.000Z',
  updatedAt: '2026-10-29T05:00:00.000Z',
};

export const PRESET_PROMPTS = [
  {
    title: 'Career: Early Startup Lead vs Big Tech Staff IC',
    prompt: 'Should I leave my stable Staff Engineer position at Big Tech to join an 8-person Series A startup as Founding Lead?',
    options: ['Founding Lead at Series A Startup', 'Staff Software Engineer at Big Tech'],
    context: '8 years of experience, financially comfortable with 9 months of emergency savings, want faster execution but nervous about market volatility.',
    criteria: ['Wealth & Compensation', 'Autonomy & Speed', 'Work-Life Balance', 'Reversibility', 'Rate of Learning'],
  },
  {
    title: 'Real Estate: Buy Home Now vs Rent & Invest Difference',
    prompt: 'Should we purchase a suburban single-family home with a 30-year mortgage or continue renting in the city and aggressively invest in index funds?',
    options: ['Buy Suburban Home (30Y Mortgage)', 'Rent City Apartment & Invest Excess Cash'],
    context: 'Dual-income couple with young toddler, current rent is $2,800/mo, home purchase requires $120k down payment and monthly payment of $4,100.',
    criteria: ['Long-term Net Worth', 'Lifestyle Flexibility', 'Stress & Maintenance Burden', 'Space & Family Comfort', 'Liquidity'],
  },
  {
    title: 'Architecture: Modular Monolith vs Distributed Microservices',
    prompt: 'Should our growing engineering team re-architect our core backend into distributed microservices or double down on a disciplined modular monolith?',
    options: ['Disciplined Modular Monolith', 'Distributed Event-Driven Microservices'],
    context: 'Team of 22 engineers expanding to 35 next year. Deployment pipelines take 18 minutes, occasional merge conflicts, but infrastructure cost is low.',
    criteria: ['Developer Velocity', 'Operational Complexity & SRE Cost', 'Independent Deployability', 'Fault Isolation', 'Cognitive Overhead'],
  },
  {
    title: 'Life: Relocate to London vs Stay in Austin',
    prompt: 'Should our family accept a 3-year international transfer to central London or remain in our established community in Austin, Texas?',
    options: ['International Relocation to London', 'Remain in Austin, Texas'],
    context: 'Both partners can work, kids aged 5 and 7. London offers travel throughout Europe and world culture, but smaller housing and higher taxes.',
    criteria: ['Children Growth & Education', 'Cultural Exposure & Travel', 'Cost of Living & Net Savings', 'Support Network & Family Proximity'],
  },
];
