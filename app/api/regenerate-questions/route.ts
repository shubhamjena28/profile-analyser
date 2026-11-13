import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { generateDefaultQuestionSets } from '@/lib/deterministicAnalyzer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { 
      resumeText = '', 
      jobDescription = '', 
      targetRole = 'AI/ML Engineer',
      excludedQuestions = [] 
    } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackSets = generateDefaultQuestionSets(targetRole, ["Python", "FastAPI", "Docker", "SQL"], resumeText);
      return NextResponse.json({ question_sets: fallbackSets });
    }

    const ai = new GoogleGenAI({ apiKey });
    const randomSeed = Date.now().toString() + Math.random().toString();

    const promptText = `Act as a Senior Technical Recruiter and Engineering Hiring Manager. Based on the candidate's resume and target job description, generate 4 distinct, non-overlapping sets of interview questions (3 questions per set, 12 questions total).

### STRICT RULES:
1. Zero Repetition: Every question across all 4 sets must test a unique skill, project decision, or scenario. Never rephrase or repeat any previously seen questions.
2. Progressive Variety:
   - Set 1 (Technical Foundations & Resume Verification): Questions validating core languages, tools, and fundamentals claimed on the resume.
   - Set 2 (Project Architecture & Trade-offs): Deep-dive questions into how the candidate built their specific projects, bottlenecks, and design choices.
   - Set 3 (Problem-Solving & Role-Specific Scenarios): Practical debugging, system design, or ML/SDE edge-case scenarios from the target JD.
   - Set 4 (Behavioral & Impact — STAR Format): Questions evaluating ownership, teamwork, and measurable impact.
3. Structured Answer Guidance: For every question, provide:
   - Target Keywords: 4–6 high-signal technical or domain terms the interviewer is listening for.
   - Sample Strong Answer: A concise, natural 3–4 sentence model response tailored to the candidate's actual resume experience.

### INPUTS:
- Candidate Resume: ${resumeText.slice(0, 3000) || "Candidate with software engineering & ML projects."}
- Target Job Description: ${jobDescription.slice(0, 1500) || targetRole}
- Previously Seen Questions (DO NOT REPEAT): ${JSON.stringify(excludedQuestions.slice(0, 15))}
- Random Variation Seed: ${randomSeed}`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        question_sets: {
          type: "ARRAY",
          items: {
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
        }
      },
      required: ["question_sets"]
    };

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
    let parsedData = null;

    const timeoutPromise = (ms: number) => new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout: Model did not respond within ${ms}ms`)), ms)
    );

    for (const modelName of candidateModels) {
      try {
        console.log(`Generating interview bank with model: ${modelName}...`);
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema as any,
            temperature: 0.3,
            maxOutputTokens: 4000,
          }
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise(25000)]);
        if (response && response.text) {
          const rawText = response.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
          parsedData = JSON.parse(rawText);
          if (parsedData?.question_sets && parsedData.question_sets.length > 0) {
            console.log(`Successfully generated interview bank with model: ${modelName}`);
            break;
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed for interview generation:`, err.message);
      }
    }

    if (!parsedData || !parsedData.question_sets) {
      console.warn("Using deterministic question sets fallback.");
      parsedData = {
        question_sets: generateDefaultQuestionSets(targetRole, ["Python", "FastAPI", "Docker", "SQL"], resumeText)
      };
    }

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Failure in /api/regenerate-questions, returning deterministic fallback:', error);
    const fallbackSets = generateDefaultQuestionSets("AI/ML Engineer", ["Python", "FastAPI", "Docker", "SQL"], "");
    return NextResponse.json({ question_sets: fallbackSets });
  }
}
