import express from 'express';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateIntelligentDecisionFallback, generateStressTestFallback } from './src/utils/fallbackGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client with proper User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Timeout wrapper helper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Operation exceeded ${ms}ms limit`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// High-speed generation with automatic model fallback to guarantee sub-20s turnaround
async function callGeminiFast(params: any) {
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config = { ...params.config };
      if (model.includes('3.1')) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
      } else if (model.includes('3.8')) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }
      return await ai!.models.generateContent({
        ...params,
        model,
        config,
      });
    } catch (err: any) {
      lastError = err;
      const errStr = JSON.stringify(err) + (err?.message || '');
      console.warn(`Model ${model} failed (${err?.status || errStr.substring(0, 80)}), trying next candidate...`);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error('All model candidates failed.');
}

// POST /api/analyze-decision
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { decisionPrompt, options, context, customCriteria } = req.body;

    if (!decisionPrompt || typeof decisionPrompt !== 'string' || decisionPrompt.trim().length === 0) {
      return res.status(400).json({ error: 'A decision prompt or question is required.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in your environment.',
      });
    }

    const optionsList = Array.isArray(options) && options.filter(Boolean).length > 0
      ? options.filter(Boolean)
      : ['Option A', 'Option B'];

    const userPrompt = `
You are "The Tiebreaker", an analytical decision strategist.
Provide a sharp, incisive decision breakdown for:

DECISION: "${decisionPrompt.trim()}"
OPTIONS: ${optionsList.map((opt: string, i: number) => `(${i + 1}) ${opt}`).join('; ')}
CONTEXT: ${context ? context.trim() : 'Standard real-world trade-offs.'}
CRITERIA OF INTEREST: ${customCriteria && customCriteria.length > 0 ? customCriteria.join(', ') : 'Top 4 pivotal criteria.'}

GUIDELINES FOR SPEED & PRECISION:
- Be dense, punchy, and direct. Explanations must be 1-2 tight sentences maximum.
- Provide exactly 3 high-leverage pros and 3 critical cons per option (weights 1-5).
- Provide 2 crisp SWOT items per quadrant per option with actionable takeaways.
- Provide 4 core criteria in the comparison matrix with 1-10 scores and concise rationales.
- Give a decisive ruling, 2 conditional if-then rules, and 1 gut-check question.
`;

    let rawData: any = null;
    try {
      const response: any = await withTimeout(
        callGeminiFast({
          contents: userPrompt,
          config: {
            systemInstruction: 'You are The Tiebreaker. Deliver fast, high-density decision analyses. Avoid fluff. Return strict valid JSON.',
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
            },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Crisp, professional title of the decision' },
                summary: { type: Type.STRING, description: 'Executive 2-sentence summary framing the tension' },
                decisionType: {
                  type: Type.OBJECT,
                  properties: {
                    classification: { type: Type.STRING, description: 'Type 1 (One-way door) or Type 2 (Two-way door)' },
                    reversibilityScore: { type: Type.NUMBER, description: '1 to 10 (1 = nearly irreversible, 10 = effortlessly rolled back)' },
                    rationale: { type: Type.STRING, description: 'Explanation of reversibility and long-term consequences' },
                  },
                  required: ['classification', 'reversibilityScore', 'rationale'],
                },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      tagline: { type: Type.STRING, description: 'Punchy 3-6 word summary of this path' },
                      pros: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            weight: { type: Type.NUMBER, description: '1 to 5' },
                            category: { type: Type.STRING, description: 'e.g. Financial, Growth, Fulfillment, Risk, Time' },
                            explanation: { type: Type.STRING },
                          },
                          required: ['id', 'text', 'weight', 'category'],
                        },
                      },
                      cons: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            weight: { type: Type.NUMBER, description: '1 to 5' },
                            category: { type: Type.STRING, description: 'e.g. Financial, Risk, Stress, Opportunity Cost' },
                            explanation: { type: Type.STRING },
                            mitigation: { type: Type.STRING, description: 'Practical action to soften or bypass this downside' },
                          },
                          required: ['id', 'text', 'weight', 'category'],
                        },
                      },
                      swot: {
                        type: Type.OBJECT,
                        properties: {
                          strengths: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                title: { type: Type.STRING },
                                detail: { type: Type.STRING },
                                action: { type: Type.STRING },
                              },
                              required: ['title', 'detail', 'action'],
                            },
                          },
                          weaknesses: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                title: { type: Type.STRING },
                                detail: { type: Type.STRING },
                                action: { type: Type.STRING },
                              },
                              required: ['title', 'detail', 'action'],
                            },
                          },
                          opportunities: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                title: { type: Type.STRING },
                                detail: { type: Type.STRING },
                                action: { type: Type.STRING },
                              },
                              required: ['title', 'detail', 'action'],
                            },
                          },
                          threats: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                title: { type: Type.STRING },
                                detail: { type: Type.STRING },
                                action: { type: Type.STRING },
                              },
                              required: ['title', 'detail', 'action'],
                            },
                          },
                        },
                        required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                      },
                    },
                    required: ['id', 'name', 'tagline', 'pros', 'cons', 'swot'],
                  },
                },
                comparisonMatrix: {
                  type: Type.OBJECT,
                  properties: {
                    criteria: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          weight: { type: Type.NUMBER, description: 'Importance 1 to 5' },
                          description: { type: Type.STRING },
                        },
                        required: ['id', 'name', 'weight', 'description'],
                      },
                    },
                    scores: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          criteriaId: { type: Type.STRING },
                          optionScores: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                optionId: { type: Type.STRING },
                                score: { type: Type.NUMBER, description: 'Rating 1 to 10' },
                                rationale: { type: Type.STRING },
                              },
                              required: ['optionId', 'score', 'rationale'],
                            },
                          },
                        },
                        required: ['criteriaId', 'optionScores'],
                      },
                    },
                  },
                  required: ['criteria', 'scores'],
                },
                tiebreakerVerdict: {
                  type: Type.OBJECT,
                  properties: {
                    recommendedOptionId: { type: Type.STRING },
                    confidence: { type: Type.STRING, description: 'High, Moderate, or Close Call' },
                    ruling: { type: Type.STRING, description: 'Clear definitive recommendation' },
                    decidingFactor: { type: Type.STRING, description: 'The pivot point that tips the balance' },
                    conditionalRules: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          condition: { type: Type.STRING },
                          recommendation: { type: Type.STRING },
                        },
                        required: ['condition', 'recommendation'],
                      },
                    },
                    theOneQuestion: { type: Type.STRING, description: 'The ultimate gut-check introspective question' },
                  },
                  required: ['recommendedOptionId', 'confidence', 'ruling', 'decidingFactor', 'conditionalRules', 'theOneQuestion'],
                },
              },
              required: ['title', 'summary', 'decisionType', 'options', 'comparisonMatrix', 'tiebreakerVerdict'],
            },
          },
        }),
        18000
      );

      const text = response?.text;
      if (text) {
        rawData = JSON.parse(text);
      }
    } catch (modelErr: any) {
      console.warn('AI call timed out or capacity busy, using instant smart synthesis fallback:', modelErr.message);
      const fallbackDecision = generateIntelligentDecisionFallback(
        decisionPrompt,
        optionsList,
        context,
        customCriteria
      );
      return res.json(fallbackDecision);
    }

    // Normalize comparisonMatrix.scores to keyed record format
    const normalizedScores = (rawData.comparisonMatrix.scores || []).map((s: any) => {
      const optionScoresRecord: Record<string, { score: number; rationale: string }> = {};
      if (Array.isArray(s.optionScores)) {
        s.optionScores.forEach((item: any) => {
          optionScoresRecord[item.optionId] = {
            score: Number(item.score) || 5,
            rationale: item.rationale || '',
          };
        });
      } else if (s.optionScores && typeof s.optionScores === 'object') {
        Object.keys(s.optionScores).forEach((key) => {
          optionScoresRecord[key] = {
            score: Number(s.optionScores[key].score) || 5,
            rationale: s.optionScores[key].rationale || '',
          };
        });
      }
      return {
        criteriaId: s.criteriaId,
        optionScores: optionScoresRecord,
      };
    });

    // Generate unique ID and timestamps
    const decision = {
      id: `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: rawData.title || decisionPrompt,
      summary: rawData.summary || '',
      context: context || '',
      decisionType: rawData.decisionType,
      options: rawData.options || [],
      comparisonMatrix: {
        criteria: rawData.comparisonMatrix.criteria || [],
        scores: normalizedScores,
      },
      tiebreakerVerdict: rawData.tiebreakerVerdict,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res.json(decision);
  } catch (error: any) {
    console.error('Error generating decision analysis:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

// POST /api/stress-test
app.post('/api/stress-test', async (req, res) => {
  try {
    const { decision, question } = req.body;

    if (!question || !decision) {
      return res.status(400).json({ error: 'Decision data and question are required.' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `
You are The Tiebreaker, stress-testing a decision already analyzed.
Decision Title: "${decision.title}"
Options: ${decision.options.map((o: any) => o.name).join(', ')}
Current Tiebreaker Ruling: "${decision.tiebreakerVerdict?.ruling}"

USER'S FOLLOW-UP CHALLENGE / SCENARIO / QUESTION:
"${question}"

Analyze how this specific question or scenario reshapes the decision.
Provide:
1. A direct, honest answer / scenario analysis (2-3 paragraphs).
2. Key unconsidered risks or hidden traps this scenario exposes.
3. A counterfactual perspective ("What would have to be true for the other option to become the obvious winner?").
4. 2-3 concrete next steps or immediate test experiments the user can run before committing.
`;

    try {
      const response: any = await withTimeout(
        callGeminiFast({
          contents: prompt,
          config: {
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
            },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                answer: { type: Type.STRING },
                keyRisks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                counterFactual: { type: Type.STRING },
                nextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['answer', 'keyRisks', 'counterFactual', 'nextSteps'],
            },
          },
        }),
        10000
      );

      const text = response?.text;
      if (text) {
        return res.json(JSON.parse(text));
      }
    } catch (err: any) {
      console.warn('Stress test fallback triggered:', err.message);
      return res.json(generateStressTestFallback(decision.title, question));
    }

    return res.json(generateStressTestFallback(decision.title, question));
  } catch (error: any) {
    console.error('Error in stress test:', error);
    return res.json(generateStressTestFallback(req.body?.decision?.title || 'Decision', req.body?.question || 'Scenario'));
  }
});

// Vite Middleware for development
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Serve static dist in production
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`The Tiebreaker server running on http://localhost:${port}`);
});
