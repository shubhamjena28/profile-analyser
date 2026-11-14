export interface AtsBreakdown {
  impactQuantification: number;
  technicalStackMatch: number;
  projectArchitectureDepth: number;
  formattingReadiness: number;
}

export interface RadarMetric {
  subject: string;
  score: number;
  fullMark: number;
}

export interface LoopholeItem {
  severity: 'Critical' | 'Moderate' | 'High' | 'Medium' | 'Low' | string;
  title?: string;
  fix?: string;
  sprint?: string;
  // Backward compatibility fields
  issue?: string;
  fixAction?: string;
  timeframe?: string;
  skill?: string;
  impact?: string;
  theoryCheck?: string;
  projectBuild?: string;
  profileInjection?: string;
}

export interface BulletRewrite {
  original: string;
  improvedXYZ: string;
  impactGain: string;
}

export interface InterviewQuestionItem {
  category: 'Project Deep-Dive' | 'Technical Core' | 'Scenario' | string;
  question: string;
  expectedAnswerKeyPoints: string;
  corePillars?: string[];
}

export interface QuestionItem {
  id: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  target_keywords: string[];
  sample_answer: string;
}

export interface QuestionSet {
  set_id: number;
  theme: string;
  questions: QuestionItem[];
}

export interface ProfileAnalysisResult {
  candidateName: string;
  targetRole: string;
  overallScore: number;
  score?: number; // compatibility alias
  verdict?: string;
  atsBreakdown: AtsBreakdown;
  radarMetrics: RadarMetric[];
  matchedKeywords: string[];
  missingKeywords: string[];
  loopholes: LoopholeItem[];
  bulletRewrites: BulletRewrite[];
  interviewQuestions: InterviewQuestionItem[];
  question_sets?: QuestionSet[];
  
  // Backward compatibility fields for existing UI components
  scoreBreakdown?: {
    coreCompetencies: number;
    domainFrameworks: number;
    projectComplexity: number;
    academicsFundamentals: number;
  };
  resumeMetrics?: {
    completenessScore: number;
    atsScore: number;
    jobMatchScore: number;
    completenessChecklist: { item: string; status: boolean; recommendation: string }[];
  };
  insights?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  keywordAnalysis?: {
    matched: string[];
    missing: string[];
    stronglyMatchedSkills: string[];
    partiallyMatchedSkills: string[];
    missingSkills: string[];
    reasoning: string;
  };
  jobMatching?: {
    skillsMatch: number;
    projectsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    keywordsMatch: number;
  };
  skillGap?: {
    strong: string[];
    developing: string[];
    missing: {
      skill: string;
      impact: string;
      theoryCheck: string;
      projectBuild: string;
      profileInjection: string;
    }[];
  };
  learningRoadmap?: {
    phase: string;
    title: string;
    topics: string[];
    priority: string;
    difficulty: string;
  }[];
  projectCritique?: {
    projectName: string;
    verdict: string;
    critique: string;
    metricScore: number;
  }[];
  skills?: {
    pillar: string;
    evidence: string;
    gapLevel: string;
    priorityWeight: string;
    candidateLevel: number;
    targetThreshold: number;
    tooltipText: string;
  }[];
  atsOptimization?: {
    gap: string;
    enhancement: string;
  }[];
  marketViability?: {
    startupProbability: number;
    midMarketProbability: number;
    maangProbability: number;
    strategicAdvice: string;
  };
  interviewSimulator?: {
    question: string;
    corePillars: string[];
  }[];
}
