export interface ProConItem {
  id: string;
  text: string;
  weight: number; // 1 to 5
  category: string;
  explanation?: string;
  mitigation?: string;
}

export interface SWOTItem {
  id?: string;
  title: string;
  detail: string;
  action: string;
}

export interface SWOTAnalysis {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface OptionData {
  id: string;
  name: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SWOTAnalysis;
}

export interface CriteriaEvaluation {
  id: string;
  name: string;
  weight: number; // 1 to 5
  description: string;
}

export interface CriteriaScore {
  criteriaId: string;
  optionScores: Record<string, { score: number; rationale: string }>;
}

export interface DecisionType {
  classification: 'Type 1 (One-way door)' | 'Type 2 (Two-way door)';
  reversibilityScore: number; // 1 to 10 (1 = nearly irreversible, 10 = effortlessly rolled back)
  rationale: string;
}

export interface ConditionalRule {
  condition: string;
  recommendation: string;
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  confidence: 'High' | 'Moderate' | 'Close Call';
  ruling: string;
  decidingFactor: string;
  conditionalRules: ConditionalRule[];
  theOneQuestion: string;
}

export interface Decision {
  id: string;
  title: string;
  summary: string;
  context?: string;
  decisionType: DecisionType;
  options: OptionData[];
  comparisonMatrix: {
    criteria: CriteriaEvaluation[];
    scores: CriteriaScore[];
  };
  tiebreakerVerdict: TiebreakerVerdict;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRequest {
  decisionPrompt: string;
  options: string[];
  context?: string;
  customCriteria?: string[];
}

export interface StressTestResponse {
  answer: string;
  keyRisks: string[];
  counterFactual: string;
  nextSteps: string[];
}
