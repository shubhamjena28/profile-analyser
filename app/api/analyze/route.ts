import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import { analyzeProfileDeterministically, extractExperienceBullets } from '@/lib/deterministicAnalyzer';

// In-memory cache to prevent redundant LLM API calls during rapid testing
const requestCache = new Map<string, any>();

function generateDynamicMock(jd: string, resume: string, targetObjective: string) {
  const isInternship = targetObjective === 'Internship Readiness';
  
  if (jd.length < 15 || resume.length < 15) {
    return {
      score: 12,
      verdict: "REJECT / HOLD",
      scoreBreakdown: { coreCompetencies: 2, domainFrameworks: 2, projectComplexity: 5, academicsFundamentals: 3 },
      resumeMetrics: {
        completenessScore: 30, atsScore: 10, jobMatchScore: 10,
        completenessChecklist: [{ item: "Contact Info", status: false, recommendation: "Add your contact info" }]
      },
      insights: { strengths: [], weaknesses: ["Input too brief"], recommendations: ["Provide detailed resume"] },
      keywordAnalysis: { matched: [], missing: ["Python"], stronglyMatchedSkills: [], partiallyMatchedSkills: [], missingSkills: ["All"], reasoning: "No text" },
      jobMatching: { skillsMatch: 10, projectsMatch: 10, experienceMatch: 10, educationMatch: 10, keywordsMatch: 10 },
      skillGap: { 
        strong: [], 
        developing: [], 
        missing: [{ 
          skill: "Any", 
          impact: "Crucial", 
          theoryCheck: "Read up on the fundamentals.", 
          projectBuild: "Build a simple \"HelloWorld\" to test basic understanding.", 
          profileInjection: "Implemented foundational concepts in a test environment." 
        }] 
      },
      learningRoadmap: [{ phase: "Foundation", title: "Basics", topics: ["Syntax"], priority: "High", difficulty: "Beginner" }],
      projectCritique: [],
      careerPaths: [],
      skills: [
        { pillar: "Input Data", evidence: "Input was too brief.", gapLevel: "Missing", priorityWeight: "High", candidateLevel: 10, targetThreshold: 80, tooltipText: "Gap" }
      ],
      atsOptimization: [
        { gap: "No meaningful text found", enhancement: "Provide a detailed resume with real projects." }
      ],
      marketViability: { startupProbability: 10, midMarketProbability: 10, maangProbability: 0, strategicAdvice: "Improve resume" },
      interviewSimulator: [
        { question: "Can you provide more details about your experience?", corePillars: ["Communication", "Experience"] }
      ]
    };
  }

  const resumeLower = resume.toLowerCase();
  const hasPython = resumeLower.includes('python');
  const hasReact = resumeLower.includes('react') || resumeLower.includes('next.js');
  
  let score = 65;
  if (hasPython) score += 15;
  if (hasReact) score += 12;
  
  const verdict = score >= 85 
    ? (isInternship ? "INTERNSHIP READY" : "PRODUCTION READY") 
    : score >= 70 
      ? (isInternship ? "TRAINEE LEVEL" : "ASSOCIATE LEVEL") 
      : "CRITICAL ADJUSTMENTS NEEDED";

  return {
    score,
    verdict,
    scoreBreakdown: {
      coreCompetencies: hasPython ? 25 : 10,
      domainFrameworks: hasReact ? 20 : 5,
      projectComplexity: 15,
      academicsFundamentals: 10
    },
    resumeMetrics: {
      completenessScore: 85,
      atsScore: hasPython ? 75 : 40,
      jobMatchScore: score,
      completenessChecklist: [
        { item: "Education", status: true, recommendation: "Great" },
        { item: "GitHub Link", status: false, recommendation: "Add your GitHub profile" }
      ]
    },
    insights: {
      strengths: hasPython ? ["Strong Python skills", "Good academic foundation"] : ["Good academic foundation"],
      weaknesses: hasReact ? ["Missing cloud deployment"] : ["No frontend framework", "Missing cloud deployment"],
      recommendations: ["Deploy your projects using Docker", "Add quantified metrics to your bullet points"]
    },
    keywordAnalysis: {
      matched: hasPython ? ["Python", "Algorithms"] : ["Algorithms"],
      missing: hasReact ? ["Docker", "AWS"] : ["React", "Docker", "AWS"],
      stronglyMatchedSkills: hasPython ? ["Python"] : [],
      partiallyMatchedSkills: ["Data Structures"],
      missingSkills: ["Cloud", "CI/CD"],
      reasoning: "Found basic programming but lacking infrastructure keywords."
    },
    jobMatching: {
      skillsMatch: hasPython ? 80 : 40,
      projectsMatch: 60,
      experienceMatch: 50,
      educationMatch: 90,
      keywordsMatch: hasReact ? 70 : 30
    },
    skillGap: {
      strong: hasPython ? ["Python"] : [],
      developing: ["SQL"],
      missing: [{ 
        skill: "Docker", 
        impact: "Required for production deployment",
        theoryCheck: "Review Docker architecture (Images vs Containers), Dockerfiles, and basic networking.",
        projectBuild: "Containerize a simple Express server and spin it up using docker-compose.",
        profileInjection: "Containerized backend services utilizing Docker and docker-compose to ensure consistent staging environments."
      }]
    },
    learningRoadmap: [
      { phase: "Phase 1 - Foundation", title: "Backend Systems", topics: ["Node.js", "Express"], priority: "High", difficulty: "Medium" },
      { phase: "Phase 2 - Specialization", title: "Cloud Deployment", topics: ["Docker", "AWS EC2"], priority: "High", difficulty: "Hard" }
    ],
    projectCritique: [
      { projectName: "Generic Machine Learning Model", weakness: "Lacks metrics", suggestedRewrite: "Trained Random Forest model on 10k records, improving accuracy by 15%", complexityScore: 60 }
    ],
    careerPaths: [
      { role: "Software Engineer", matchPercentage: score, matchingSkills: ["Programming"], missingSkills: ["Cloud"], reasoning: "Good foundational skills" },
      { role: "Data Analyst", matchPercentage: hasPython ? 75 : 40, matchingSkills: hasPython ? ["Python"] : [], missingSkills: ["SQL", "Tableau"], reasoning: "Python is useful here" }
    ],
    skills: [
      { pillar: "Core Programming", evidence: hasPython ? "Mentioned Python in resume" : "Not explicitly found", gapLevel: hasPython ? "Met" : "Missing", priorityWeight: "High", candidateLevel: hasPython ? 85 : 20, targetThreshold: 80, tooltipText: hasPython ? "Exceeds baseline threshold" : "Significant gap in core language" },
      { pillar: "Frontend Engineering", evidence: hasReact ? "React/Next.js detected" : "No frontend framework detected", gapLevel: hasReact ? "Met" : "Needs Project Validation", priorityWeight: "Medium", candidateLevel: hasReact ? 75 : 40, targetThreshold: 70, tooltipText: hasReact ? "Solid foundation, needs deployment validation" : "Below market expectations" },
      { pillar: "System Architecture", evidence: "Lacks explicit deployment infrastructure details", gapLevel: "Missing", priorityWeight: "High", candidateLevel: 30, targetThreshold: 85, tooltipText: "Lacks production infrastructure evidence" }
    ],
    marketViability: {
      startupProbability: score + 10 > 100 ? 100 : score + 10,
      midMarketProbability: score > 100 ? 100 : score,
      maangProbability: score - 20 < 0 ? 0 : score - 20,
      strategicAdvice: "As a student applicant, focusing your projects on runtime complexity will shift your enterprise viability from Moderate to High."
    },
    atsOptimization: [
      { gap: "Lacks explicit mention of model evaluation metrics", enhancement: "Quantified project impact by implementing accuracy and F1 score evaluation pipelines, improving model reliability by 15%." },
      { gap: "Missing CI/CD pipeline documentation", enhancement: "Automated testing and deployment utilizing GitHub Actions, ensuring zero-downtime releases." }
    ],
    interviewSimulator: [
      { 
        question: "How do you handle state management in large applications and what are the tradeoffs?", 
        corePillars: ["State Context", "Performance", "Component Lifecycle"]
      }
    ]
  };
}

export const runtime = 'nodejs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  let jobDescription = '';
  let resumeText = '';
  let userName = 'Candidate';
  let userStatus = 'Student';
  let targetObjective = 'Internship Readiness';
  let randomSeed = Date.now().toString();

  let promptContent: any[] = [];
  
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await request.json();
      jobDescription = data.jobDescription || '';
      resumeText = data.text || data.resumeText || '';
      userName = data.userName || 'Candidate';
      userStatus = data.userStatus || 'Student';
      targetObjective = data.targetObjective || 'Internship Readiness';
      randomSeed = request.headers.get('x-random-seed') || Date.now().toString();
      
      promptContent = [
        { text: `RESUME TEXT:\n${resumeText}` }
      ];
    } else {
      const formData = await request.formData();
      jobDescription = (formData.get('jobDescription') as string) || '';
      resumeText = (formData.get('resumeText') as string) || '';
      userName = formData.get('userName') as string || 'Candidate';
      userStatus = formData.get('userStatus') as string || 'Student';
      targetObjective = formData.get('targetObjective') as string || 'Internship Readiness';
      randomSeed = request.headers.get('x-random-seed') || Date.now().toString();
      
      const file = formData.get('file') as File;
      if (file && file.size > 0 && !resumeText) {
        // Fallback to raw PDF buffer processing
        const arrayBuffer = await file.arrayBuffer();
        const base64Pdf = Buffer.from(arrayBuffer).toString('base64');
        promptContent = [
          { inlineData: { mimeType: file.type || 'application/pdf', data: base64Pdf } }
        ];
      } else {
        promptContent = [
          { text: `RESUME TEXT:\n${resumeText}` }
        ];
      }
    }

    if (!jobDescription || (!resumeText && promptContent.length === 0)) {
      return NextResponse.json({ error: "Invalid payload format. Please ensure your Resume and Job Description are provided." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload format. Please ensure your Resume and Job Description are provided." }, { status: 400 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      await sleep(800); 
      const deterministicResult = analyzeProfileDeterministically(resumeText, targetObjective, jobDescription, userName);
      return NextResponse.json(deterministicResult);
    }

    // Normalized SHA-256 Cache Key (matches get_cache_key: resume.strip()::jd.strip())
    const cacheKey = crypto
      .createHash('sha256')
      .update(`${resumeText.trim()}::${jobDescription.trim()}::${targetObjective}`)
      .digest('hex');
    if (requestCache.has(cacheKey)) {
      console.log("Fast path: Returning cached analysis result");
      const cachedData = requestCache.get(cacheKey);
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate',
        }
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let response: any;

    const filteredBullets = extractExperienceBullets(resumeText);
    const inputBulletsJson = JSON.stringify(filteredBullets.map((b, i) => ({ index: i, original: b })), null, 2);

    const promptText = `You are CareerPulse, an elite AI Placement & Readiness Analyzer. 
Evaluate this candidate (${userName}, ${userStatus}) targeting "${targetObjective}" against the provided Job Description.

Use this dynamic variation seed [${randomSeed}] to guarantee the predictive interview script is completely unique and unpredictable across multiple runs, while maintaining the strict scoring logic.

JD: ${jobDescription}

REWRITE BULLET POINTS (STRICT 1-TO-1 GOOGLE XYZ FORMULA):
Rewrite each of the following ${filteredBullets.length} resume bullet points independently using Google's XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]").
STRICT RULES:
1. Return 'bulletRewrites' array with EXACTLY ${filteredBullets.length} items, matching the exact order of the input bullets.
2. Each rewritten bullet MUST be strictly derived from its corresponding original bullet's specific technology and context. NEVER reuse or repeat the same rewritten sentence across different bullets.
3. Generate a unique, context-specific impact badge (e.g., "+25% Inference Speed", "-40% Manual Latency") for each bullet in 'impactGain'.

INPUT BULLETS:
${inputBulletsJson}

CRITICAL INSTRUCTIONS FOR SPEED AND SCORING:
- Keep all text justifications extremely concise (maximum 15-20 words per bullet point/item).
- Shorter, high-impact evaluations are strongly required. Do NOT generate lengthy paragraphs.
- For the scoreBreakdown, you MUST enforce strict mathematical upper bounds. Return a raw integer for each. coreCompetencies (0-25), domainFrameworks (0-25), projectComplexity (0-35), academicsFundamentals (0-15).
- Do not invent or fabricate information that does not exist in the resume. Be brutally honest.
- Provide highly specific, actionable recommendations, not generic advice.

You are a dynamic profile analyzer. Extract the top 4 core competency pillars required for the specific JD.
Calculate the 'score' (out of 100) and aggressively map all required intelligence nodes comparing the candidate resume against the JD.`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        score: { type: "INTEGER" },
        scoreBreakdown: {
          type: "OBJECT",
          properties: {
            coreCompetencies: { type: "INTEGER" },
            domainFrameworks: { type: "INTEGER" },
            projectComplexity: { type: "INTEGER" },
            academicsFundamentals: { type: "INTEGER" }
          },
          required: ["coreCompetencies", "domainFrameworks", "projectComplexity", "academicsFundamentals"]
        },
        resumeMetrics: {
          type: "OBJECT",
          properties: {
            completenessScore: { type: "INTEGER" },
            atsScore: { type: "INTEGER" },
            jobMatchScore: { type: "INTEGER" },
            completenessChecklist: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  item: { type: "STRING" },
                  status: { type: "BOOLEAN" },
                  recommendation: { type: "STRING" }
                },
                required: ["item", "status", "recommendation"]
              }
            }
          },
          required: ["completenessScore", "atsScore", "jobMatchScore", "completenessChecklist"]
        },
        insights: {
          type: "OBJECT",
          properties: {
            strengths: { type: "ARRAY", items: { type: "STRING" } },
            weaknesses: { type: "ARRAY", items: { type: "STRING" } },
            recommendations: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["strengths", "weaknesses", "recommendations"]
        },
        keywordAnalysis: {
          type: "OBJECT",
          properties: {
            matched: { type: "ARRAY", items: { type: "STRING" } },
            missing: { type: "ARRAY", items: { type: "STRING" } },
            stronglyMatchedSkills: { type: "ARRAY", items: { type: "STRING" } },
            partiallyMatchedSkills: { type: "ARRAY", items: { type: "STRING" } },
            missingSkills: { type: "ARRAY", items: { type: "STRING" } },
            reasoning: { type: "STRING" }
          },
          required: ["matched", "missing", "stronglyMatchedSkills", "partiallyMatchedSkills", "missingSkills", "reasoning"]
        },
        jobMatching: {
          type: "OBJECT",
          properties: {
            skillsMatch: { type: "INTEGER" },
            projectsMatch: { type: "INTEGER" },
            experienceMatch: { type: "INTEGER" },
            educationMatch: { type: "INTEGER" },
            keywordsMatch: { type: "INTEGER" }
          },
          required: ["skillsMatch", "projectsMatch", "experienceMatch", "educationMatch", "keywordsMatch"]
        },
        skillGap: {
          type: "OBJECT",
          properties: {
            strong: { type: "ARRAY", items: { type: "STRING" } },
            developing: { type: "ARRAY", items: { type: "STRING" } },
            missing: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  skill: { type: "STRING" },
                  impact: { type: "STRING" },
                  theoryCheck: { type: "STRING" },
                  projectBuild: { type: "STRING" },
                  profileInjection: { type: "STRING" }
                },
                required: ["skill", "impact", "theoryCheck", "projectBuild", "profileInjection"]
              }
            }
          },
          required: ["strong", "developing", "missing"]
        },
        learningRoadmap: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              phase: { type: "STRING" },
              title: { type: "STRING" },
              topics: { type: "ARRAY", items: { type: "STRING" } },
              priority: { type: "STRING" },
              difficulty: { type: "STRING" }
            },
            required: ["phase", "title", "topics", "priority", "difficulty"]
          }
        },
        projectCritique: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              projectName: { type: "STRING" },
              weakness: { type: "STRING" },
              suggestedRewrite: { type: "STRING" },
              complexityScore: { type: "INTEGER" }
            },
            required: ["projectName", "weakness", "suggestedRewrite", "complexityScore"]
          }
        },
        careerPaths: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              role: { type: "STRING" },
              matchPercentage: { type: "INTEGER" },
              matchingSkills: { type: "ARRAY", items: { type: "STRING" } },
              missingSkills: { type: "ARRAY", items: { type: "STRING" } },
              reasoning: { type: "STRING" }
            },
            required: ["role", "matchPercentage", "matchingSkills", "missingSkills", "reasoning"]
          }
        },
        skills: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              pillar: { type: "STRING" },
              evidence: { type: "STRING" },
              gapLevel: { type: "STRING" },
              priorityWeight: { type: "STRING" },
              candidateLevel: { type: "INTEGER" },
              targetThreshold: { type: "INTEGER" },
              tooltipText: { type: "STRING" }
            },
            required: ["pillar", "evidence", "gapLevel", "priorityWeight", "candidateLevel", "targetThreshold", "tooltipText"]
          }
        },
        atsOptimization: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              gap: { type: "STRING" },
              enhancement: { type: "STRING" }
            },
            required: ["gap", "enhancement"]
          }
        },
        marketViability: {
          type: "OBJECT",
          properties: {
            startupProbability: { type: "INTEGER" },
            midMarketProbability: { type: "INTEGER" },
            maangProbability: { type: "INTEGER" },
            strategicAdvice: { type: "STRING" }
          },
          required: ["startupProbability", "midMarketProbability", "maangProbability", "strategicAdvice"]
        },
        interviewSimulator: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              corePillars: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["question", "corePillars"]
          }
        },
        bulletRewrites: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              index: { type: "INTEGER" },
              original: { type: "STRING" },
              improvedXYZ: { type: "STRING" },
              impactGain: { type: "STRING" }
            },
            required: ["original", "improvedXYZ", "impactGain"]
          }
        }
      },
      required: [
        "score", "scoreBreakdown", "resumeMetrics", "insights", "keywordAnalysis", 
        "jobMatching", "skillGap", "learningRoadmap", "projectCritique", "careerPaths",
        "skills", "atsOptimization", "marketViability", "interviewSimulator"
      ]
    };

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
    let lastError: any = null;
    let parsedData: any = null;

    const timeoutPromise = (ms: number) => new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout: Model did not respond within ${ms}ms`)), ms)
    );

    for (const modelName of candidateModels) {
      try {
        console.log(`Attempting analysis with model: ${modelName}...`);
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: [
            ...promptContent,
            { text: promptText }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema as any,
            temperature: 0.1,
            seed: 42,
            maxOutputTokens: 5000,
          }
        });

        // Enforce a 30-second timeout per model so requests don't prematurely abort during JSON generation
        const response: any = await Promise.race([generatePromise, timeoutPromise(30000)]);
        
        if (response && response.text) {
          const rawText = response.text.trim();
          const sanitizedText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
          parsedData = JSON.parse(sanitizedText);
          console.log(`Success and parsed valid JSON with model: ${modelName}`);
          break; // Stop loop on success
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
        await sleep(500);
      }
    }

    const deterministicBaseline = analyzeProfileDeterministically(resumeText, targetObjective, jobDescription, userName);

    if (!parsedData) {
      console.warn("All model attempts failed or could not be parsed. Generating high-fidelity fallback analysis.", lastError?.message);
      parsedData = deterministicBaseline;
    } else {
      // Normalize with baseline so newly expected fields (atsBreakdown, radarMetrics, etc.) are guaranteed
      parsedData = {
        ...deterministicBaseline,
        ...parsedData,
        overallScore: parsedData.overallScore ?? parsedData.score ?? deterministicBaseline.overallScore,
        score: parsedData.overallScore ?? parsedData.score ?? deterministicBaseline.overallScore,
        atsBreakdown: parsedData.atsBreakdown || deterministicBaseline.atsBreakdown,
        radarMetrics: parsedData.radarMetrics || deterministicBaseline.radarMetrics,
        matchedKeywords: parsedData.matchedKeywords || parsedData.keywordAnalysis?.matched || deterministicBaseline.matchedKeywords,
        missingKeywords: parsedData.missingKeywords || parsedData.keywordAnalysis?.missing || deterministicBaseline.missingKeywords,
        loopholes: (parsedData.loopholes && parsedData.loopholes.length > 0) ? parsedData.loopholes : deterministicBaseline.loopholes,
        bulletRewrites: (parsedData.bulletRewrites && parsedData.bulletRewrites.length > 0) 
          ? parsedData.bulletRewrites.map((b: any) => ({
              original: b.original,
              improvedXYZ: b.improvedXYZ || b.rewritten || b.original,
              impactGain: b.impactGain || b.impact_badge || "+35% Quantifiable Impact"
            }))
          : deterministicBaseline.bulletRewrites,
        interviewQuestions: (parsedData.interviewQuestions && parsedData.interviewQuestions.length > 0) ? parsedData.interviewQuestions : deterministicBaseline.interviewQuestions
      };
    }

    // Enforce strictly deterministic verdict based on the AI's numerical score
    if (typeof parsedData.score === 'number') {
      const isInternship = targetObjective === 'Internship Readiness';
      parsedData.verdict = parsedData.score >= 85 
        ? (isInternship ? "INTERNSHIP READY" : "PRODUCTION READY") 
        : parsedData.score >= 70 
          ? (isInternship ? "TRAINEE LEVEL" : "ASSOCIATE LEVEL") 
          : "CRITICAL ADJUSTMENTS NEEDED";
    }

    // Save successful response to in-memory cache
    requestCache.set(cacheKey, parsedData);

    return NextResponse.json(parsedData, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      }
    });

  } catch (error: any) {
    console.error('CRITICAL LOGIC FAILURE IN /api/analyze, triggering deterministic zero-fail engine:', error);
    const safeFallback = analyzeProfileDeterministically(resumeText, targetObjective, jobDescription, userName);
    return NextResponse.json(safeFallback);
  }
}
