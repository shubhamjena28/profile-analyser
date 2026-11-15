import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { generateDefaultQuestionSets } from '@/lib/deterministicAnalyzer';
import { QuestionSet } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resumeText = body.resume_text || body.resumeText || '';
    const jobDescription = body.jd_text || body.jobDescription || '';
    const targetRole = body.target_role || body.targetRole || 'Software Engineer';
    const excludeQuestions: string[] = body.exclude_questions || body.excludedQuestions || [];

    const apiKey = process.env.GEMINI_API_KEY;

    const randomSeed = Date.now().toString() + Math.random().toString();
    const setId = Date.now() % 10000;

    // Deterministic fallback generator for single unique set
    const getFallbackSet = (): QuestionSet => {
      const allDefaultSets = generateDefaultQuestionSets(targetRole, ["Python", "FastAPI", "React", "Docker", "SQL"], resumeText);
      // Pick a set that has questions not yet in excludeQuestions, or shift them
      const candidateSet = allDefaultSets.find(s => 
        !s.questions.some(q => excludeQuestions.includes(q.question))
      ) || allDefaultSets[Math.floor(Math.random() * allDefaultSets.length)];

      return {
        set_id: setId,
        theme: `Applied ${targetRole} Problem-Solving & Edge Cases`,
        questions: candidateSet.questions.map((q, i) => ({
          ...q,
          id: `buf_${setId}_${i}`,
          question: excludeQuestions.includes(q.question) 
            ? `In high-scale ${targetRole} environments: ${q.question}` 
            : q.question
        }))
      };
    };

    if (!apiKey) {
      return NextResponse.json({ question_set: getFallbackSet() });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `Act as an elite Technical Hiring Manager and Staff Engineer. Generate EXACTLY ONE cohesive, high-signal set of 3-4 interview questions tailored to this candidate and target role.

### STRICT RULES:
1. Zero Repetition: NEVER repeat or rephrase any question from the excluded list below.
2. Structure: Return 3 or 4 questions testing unique architectural trade-offs, debugging scenarios, and core domain depth.
3. Every question must include:
   - Target Keywords (4-6 high-signal terms the interviewer is listening for).
   - Sample Strong Answer (Concise 3-4 sentence model response matching the candidate's actual projects).

### INPUTS:
- Candidate Resume: ${resumeText.slice(0, 2500) || "Candidate with technical projects."}
- Target Job Description: ${jobDescription.slice(0, 1500) || targetRole}
- PREVIOUSLY ASKED QUESTIONS (DO NOT DUPLICATE):
${JSON.stringify(excludeQuestions.slice(-20))}
- Variation Seed: ${randomSeed}`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        question_set: {
          type: "OBJECT",
          properties: {
            set_id: { type: "INTEGER" },
            theme: { type: "STRING" },
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  question: { type: "STRING" },
                  difficulty: { type: "STRING", enum: ["Easy", "Medium", "Hard"] },
                  target_keywords: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  sample_answer: { type: "STRING" }
                },
                required: ["id", "question", "difficulty", "target_keywords", "sample_answer"]
              }
            }
          },
          required: ["set_id", "theme", "questions"]
        }
      },
      required: ["question_set"]
    };

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
    let parsedData = null;

    const timeoutPromise = (ms: number) => new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout: Model did not respond within ${ms}ms`)), ms)
    );

    for (const modelName of candidateModels) {
      try {
        console.log(`Pre-fetching single question set with model: ${modelName}...`);
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema as any,
            temperature: 0.35,
            maxOutputTokens: 2500,
          }
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise(20000)]);
        if (response && response.text) {
          const raw = response.text.trim();
          const firstBrace = raw.indexOf('{');
          const lastBrace = raw.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            parsedData = JSON.parse(raw.substring(firstBrace, lastBrace + 1));
          } else {
            parsedData = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim());
          }
          if (parsedData?.question_set?.questions?.length > 0) {
            break;
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} pre-fetch pass failed:`, err.message);
      }
    }

    if (!parsedData || !parsedData.question_set) {
      return NextResponse.json({ question_set: getFallbackSet() });
    }

    return NextResponse.json(parsedData, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (err: any) {
    console.error("Critical error in /api/generate-single-set:", err);
    const fallback = generateDefaultQuestionSets("AI/ML Engineer", ["Python", "FastAPI"], "")[0];
    return NextResponse.json({ question_set: fallback });
  }
}
