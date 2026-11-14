import { ProfileAnalysisResult, QuestionSet } from './types';

export function generateDefaultQuestionSets(
  targetRole: string = "AI/ML Engineer",
  detectedSkills: string[] = ["Python", "FastAPI", "Docker", "SQL"],
  resumeText: string = ""
): QuestionSet[] {
  const primaryLang = detectedSkills[0] || "Python";
  const secondaryTool = detectedSkills[1] || "Docker";

  return [
    {
      set_id: 1,
      theme: "Technical Foundations & Resume Verification",
      questions: [
        {
          id: "q1_1",
          question: `How does memory management and concurrency work in ${primaryLang}, and how do you prevent thread starvation or resource leaks in high-throughput workloads?`,
          difficulty: "Medium",
          target_keywords: ["Memory Profiling", "Event Loop", "Garbage Collection", "Thread Pool", "GIL/Concurrency"],
          sample_answer: `In ${primaryLang}, resource lifecycle management relies on reference counting and automated garbage collection. When architecting high-throughput workloads, I utilize asynchronous non-blocking event loops and configure bounded connection pools to prevent thread starvation. In previous projects, profiling with memory heap benchmarks allowed us to identify uncollected circular references before staging deployment.`
        },
        {
          id: "q1_2",
          question: `Walk me through how you design and enforce schema validation and serialization efficiency in RESTful/gRPC interfaces.`,
          difficulty: "Easy",
          target_keywords: ["Serialization", "Data Validation", "Pydantic/DTOs", "Protocol Buffers", "HTTP Status Contracts"],
          sample_answer: `I enforce strict contract isolation using typed DTOs and schema validators to sanitize inputs at the network boundary. For latency-sensitive inter-service communication, I prioritize binary serialization like Protobuf over JSON to cut payload sizes by up to 60%. This guarantees contract predictability while minimizing deserialization overhead under high request throughput.`
        },
        {
          id: "q1_3",
          question: `When executing complex joins and aggregations in relational databases, what steps do you take to prevent full-table scans?`,
          difficulty: "Medium",
          target_keywords: ["B-Tree Indexes", "EXPLAIN ANALYZE", "Query Optimization", "Composite Keys", "Covering Indexes"],
          sample_answer: `I begin by running EXPLAIN ANALYZE to inspect the query plan and identify sequential scans on large tables. I then introduce targeted B-Tree or composite indexes aligned with the WHERE and JOIN predicates, ensuring high-cardinality columns are ordered efficiently. In past database refactors, rewriting subqueries into indexed common table expressions reduced execution time from seconds down to milliseconds.`
        }
      ]
    },
    {
      set_id: 2,
      theme: "Project Architecture & Trade-offs",
      questions: [
        {
          id: "q2_1",
          question: `Walk me through the most significant technical trade-off you made in your featured project. Why did you choose this architecture over the obvious alternative?`,
          difficulty: "Hard",
          target_keywords: ["Decoupling", "Microservices vs Monolith", "Trade-Off Analysis", "Latency", "Maintainability"],
          sample_answer: `In my featured project, we evaluated deploying an all-in-one monolithic backend versus separating inference workers into asynchronous queues. While a monolith would have shortened initial build time by a few days, decoupling via worker queues isolated heavy compute tasks and protected API responsiveness. This trade-off ensured our user-facing endpoints consistently met <85ms P99 latency SLA targets under sudden traffic spikes.`
        },
        {
          id: "q2_2",
          question: `How did you configure caching and state management in your services to prevent cache stampedes and stale data reads?`,
          difficulty: "Medium",
          target_keywords: ["Redis Caching", "TTL Expiration", "Write-Through Cache", "Cache Invalidation", "Stampede Protection"],
          sample_answer: `We integrated an in-memory Redis layer using a cache-aside pattern paired with randomized TTL jitter to prevent simultaneous key expirations. For critical reads, we implemented probabilistic early recomputation and mutex locks around cache misses so only one worker queried the primary database. This design reduced database read pressure by over 70% while maintaining fresh data guarantees.`
        },
        {
          id: "q2_3",
          question: `How do you guarantee fault isolation and graceful degradation when a downstream dependency or third-party service fails?`,
          difficulty: "Hard",
          target_keywords: ["Circuit Breaker", "Exponential Backoff", "Fallback Strategy", "Idempotency", "Graceful Degradation"],
          sample_answer: `I implement the circuit breaker pattern paired with exponential backoff and jitter to protect against cascading service outages. If a downstream service latency exceeds defined thresholds, the circuit trips and serves cached fallback responses or queued asynchronous retries. Every retry payload carries a unique idempotency key to prevent duplicate writes or transactions upon recovery.`
        }
      ]
    },
    {
      set_id: 3,
      theme: "Problem-Solving & Role-Specific Scenarios",
      questions: [
        {
          id: "q3_1",
          question: `Your production service suddenly experiences a 400% surge in traffic, causing P99 latency to spike from 50ms to 2.5s. How do you triage and resolve this in real time?`,
          difficulty: "Hard",
          target_keywords: ["P99 Latency Spike", "Root Cause Analysis", "Horizontal Pod Autoscaling", "Rate Limiting", "APM Tracing"],
          sample_answer: `My immediate triage step is checking APM distributed traces to determine whether the bottleneck stems from database connection exhaustion, CPU saturation, or third-party latency. If it's pure request volume, I trigger horizontal scaling while enabling token-bucket rate limiting on non-critical endpoints to shed excess load. Once stabilized, we review query contention and scale read replicas to permanently absorb the traffic baseline.`
        },
        {
          id: "q3_2",
          question: `A critical data pipeline or model prediction service starts silently returning default/null values without throwing server errors. How do you detect and fix this?`,
          difficulty: "Medium",
          target_keywords: ["Data Drift", "Schema Validation", "Silent Failure Detection", "Synthetic Probes", "Observability Alerting"],
          sample_answer: `Silent data failures are prevented by implementing schema assertion checks and synthetic health probes that validate payload distributions rather than just HTTP 200 codes. When this occurred in a previous pipeline, we established CloudWatch alerts on null-percentage metric thresholds to immediately catch malformed upstream inputs. We then added defensive fallback defaults and integration regression suites to prevent silent propagation.`
        },
        {
          id: "q3_3",
          question: `How would you secure a public-facing API against brute-force abuse, unauthorized privilege escalation, and token leakage?`,
          difficulty: "Medium",
          target_keywords: ["JWT Token Signing", "Role-Based Access Control", "Rate Limiting", "CORS/Sanitization", "HTTPS/TLS"],
          sample_answer: `I enforce defense-in-depth by placing an API gateway with IP-based rate limiting and WAF rules in front of the application. All authentication tokens use cryptographically signed asymmetric JWTs with short expiration times and secure HttpOnly cookie storage to prevent XSS exfiltration. Within the business logic, fine-grained Role-Based Access Control (RBAC) middleware strictly validates user scopes on every protected resource.`
        }
      ]
    },
    {
      set_id: 4,
      theme: "Behavioral & Impact — STAR Format",
      questions: [
        {
          id: "q4_1",
          question: `Tell me about a time you had to deliver a critical engineering milestone with vague or rapidly changing requirements. How did you navigate the uncertainty?`,
          difficulty: "Medium",
          target_keywords: ["STAR Method", "Ambiguity", "Rapid Prototyping", "Stakeholder Alignment", "Milestone Delivery"],
          sample_answer: `In a previous project sprint, our team needed to build an analytics dashboard before the client finalized their metrics criteria. I scheduled a rapid alignment session with stakeholders to establish minimum viable outputs, then implemented modular interface boundaries that allowed underlying logic to change without altering UI contracts. We delivered the prototype a week ahead of schedule, enabling leadership to test live interactions and finalize criteria with zero rework.`
        },
        {
          id: "q4_2",
          question: `Describe a situation where you disagreed with a teammate's architectural proposal or code review feedback. How did you achieve resolution?`,
          difficulty: "Medium",
          target_keywords: ["Code Review", "Constructive Feedback", "Benchmarking Data", "Consensus", "Team Collaboration"],
          sample_answer: `During a sprint review, a teammate suggested storing analytical event logs directly in our operational relational database, which I was concerned would degrade core transactional performance. Rather than debating opinions, I built a quick load-testing benchmark script demonstrating table lock contention under high write volume. Reviewing the objective latency data together led us to unanimously agree on adopting a dedicated asynchronous log store.`
        },
        {
          id: "q4_3",
          question: `Can you share an instance where code you deployed introduced an unforced error or regression in production? How did you respond?`,
          difficulty: "Hard",
          target_keywords: ["Blameless Post-Mortem", "Incident Response", "Automated Rollback", "Root Cause Analysis", "Regression Prevention"],
          sample_answer: `During an off-hours release, an untested edge case in a database migration script caused query timeouts for a segment of authenticated users. I immediately executed our automated rollback script to restore full service within 6 minutes of alert notification. Afterwards, I authored a blameless post-mortem document and added automated migration staging verification checks in our CI pipeline so the issue could never recur.`
        }
      ]
    }
  ];
}

// Predefined role skill expectations
export const ROLE_SKILL_REQUIREMENTS: Record<string, string[]> = {
  "AI/ML Engineer": [
    "Python", "PyTorch", "TensorFlow", "Machine Learning", "Deep Learning", 
    "NLP", "Computer Vision", "Docker", "FastAPI", "SQL", "Git", "Data Pipelines"
  ],
  "Full-Stack Developer": [
    "React", "TypeScript", "Node.js", "Next.js", "REST APIs", 
    "Tailwind CSS", "PostgreSQL", "MongoDB", "Git", "Docker", "CI/CD", "System Architecture"
  ],
  "Data Scientist": [
    "Python", "SQL", "Pandas", "Scikit-Learn", "Data Visualization", 
    "Statistical Modeling", "A/B Testing", "Tableau", "BigQuery", "Machine Learning", "Git"
  ],
  "Cloud/DevOps Intern": [
    "Linux", "Docker", "Kubernetes", "AWS", "Terraform", 
    "CI/CD", "Bash", "Networking", "Git", "Prometheus", "Python", "Cloud Security"
  ],
  "Backend Engineer": [
    "Node.js", "Go", "Java", "Python", "PostgreSQL", 
    "Redis", "Microservices", "Docker", "Distributed Systems", "SQL", "REST APIs", "Git"
  ]
};

export function extractExperienceBullets(resumeText: string): string[] {
  const bullets: string[] = [];
  // 1. Only scan after EXPERIENCE, WORK EXPERIENCE, or PROJECTS sections begin
  const sections = resumeText.split(/\n(?=(?:EXPERIENCE|WORK EXPERIENCE|PROJECTS)\b)/i);
  const targetText = sections.length > 1 ? sections.slice(1).join('\n') : resumeText;

  for (const line of targetText.split(/\r?\n/)) {
    const clean = line.trim();
    // Keep lines starting with bullet symbols and having meaningful length (>35 chars)
    if (/^[•\-\*\u2022]\s+/.test(clean) && clean.length > 35) {
      // Strip leading bullet symbol
      const bulletText = clean.replace(/^[•\-\*\u2022]\s+/, '').trim();
      const lower = bulletText.toLowerCase();
      // Exclude coursework or skill lists
      if (!lower.startsWith("relevant coursework") && !lower.startsWith("coursework") && !lower.startsWith("technologies") && !lower.startsWith("skills")) {
        bullets.push(bulletText);
      }
    }
  }

  // Fallback: If resume didn't use standard bullet symbols, scan for action-verb sentences (>35 chars)
  if (bullets.length === 0) {
    for (const line of targetText.split(/\r?\n/)) {
      const clean = line.trim();
      if (clean.length > 35 && clean.length < 240 && /^(developed|built|designed|implemented|engineered|created|led|optimized|architected|maintained|integrated|automated|spearheaded|deployed)\b/i.test(clean)) {
        bullets.push(clean);
      }
    }
  }

  return bullets.slice(0, 5); // Cap at top 5 bullets for fast LLM generation
}

function deriveDynamicXYZ(orig: string, idx: number): { improvedXYZ: string; impactGain: string } {
  const clean = orig.trim().replace(/[.,;]+$/, "");
  const lower = clean.toLowerCase();

  // Extract detected technologies in this specific bullet
  const techTerms = ["python", "react", "next.js", "node.js", "typescript", "fastapi", "docker", "aws", "postgresql", "mongodb", "redis", "graphql", "kubernetes", "sql", "git", "ci/cd", "pytorch", "tensorflow"];
  const matchedTech = techTerms.filter(t => lower.includes(t));
  const primaryTech = matchedTech.length > 0 
    ? matchedTech.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" & ") 
    : "production stack";

  // Context-specific metrics and action transformations
  if (lower.includes("api") || lower.includes("backend") || lower.includes("server") || lower.includes("endpoint") || lower.includes("database") || lower.includes("query")) {
    const metric = 30 + ((idx * 7 + clean.length) % 35);
    return {
      improvedXYZ: `Accelerated API throughput and query efficiency, slashing p99 latency by ${metric}% under simulated high-concurrency traffic by re-architecting ${primaryTech} endpoints and indexing database schemas.`,
      impactGain: `-${metric}% Query Latency`
    };
  }

  if (lower.includes("model") || lower.includes("ml") || lower.includes("ai") || lower.includes("predict") || lower.includes("data") || lower.includes("pipeline")) {
    const accuracy = (89 + ((idx * 3 + clean.length) % 8)).toFixed(1);
    const boost = 20 + ((idx * 5 + clean.length) % 25);
    return {
      improvedXYZ: `Achieved ${accuracy}% model accuracy and reduced inference latency by ${boost}%, by engineering automated feature extraction pipelines and hyperparameter tuning in ${primaryTech}.`,
      impactGain: `+${boost}% Inference Speed`
    };
  }

  if (lower.includes("ui") || lower.includes("frontend") || lower.includes("component") || lower.includes("page") || lower.includes("web") || lower.includes("dashboard")) {
    const speedScore = 25 + ((idx * 6 + clean.length) % 30);
    return {
      improvedXYZ: `Elevated client-side load performance and Core Web Vitals by ${speedScore}%, by developing modular, accessible components and implementing code-splitting in ${primaryTech}.`,
      impactGain: `+${speedScore}% Lighthouse Score`
    };
  }

  if (lower.includes("deploy") || lower.includes("ci") || lower.includes("cd") || lower.includes("test") || lower.includes("docker") || lower.includes("cloud")) {
    const timeSaved = 40 + ((idx * 4 + clean.length) % 35);
    return {
      improvedXYZ: `Reduced deployment cycle duration by ${timeSaved}% and eradicated release rollbacks, by standardizing automated CI/CD validation checks and containerized orchestration via ${primaryTech}.`,
      impactGain: `-${timeSaved}% Build Overhead`
    };
  }

  // Dynamic derivation preserving original bullet's exact subject
  const words = clean.split(" ");
  const actionNoun = words.slice(0, Math.min(words.length, 6)).join(" ");
  const percent = 28 + ((idx * 9 + clean.length) % 32);

  return {
    improvedXYZ: `Engineered end-to-end optimizations across ${actionNoun}, boosting measurable operational reliability by ${percent}% by refactoring legacy logic into decoupled, test-driven ${primaryTech} modules.`,
    impactGain: `+${percent}% Operational Velocity`
  };
}

export function analyzeProfileDeterministically(
  resumeText: string,
  targetRole: string = "AI/ML Engineer",
  jobDescription: string = "",
  candidateName: string = "Candidate"
): ProfileAnalysisResult {
  const textLower = resumeText.toLowerCase();
  
  // 1. Skill Cluster Detection
  const allKnownSkills = [
    { name: "Python", regex: /\bpython\b/i },
    { name: "Java", regex: /\bjava\b/i },
    { name: "C++", regex: /\bc\+\+\b/i },
    { name: "JavaScript", regex: /\b(javascript|js)\b/i },
    { name: "TypeScript", regex: /\b(typescript|ts)\b/i },
    { name: "React", regex: /\breact(\.js)?\b/i },
    { name: "Next.js", regex: /\bnext(\.js)?\b/i },
    { name: "Node.js", regex: /\bnode(\.js)?\b/i },
    { name: "FastAPI", regex: /\bfastapi\b/i },
    { name: "Django", regex: /\bdjango\b/i },
    { name: "SQL", regex: /\b(sql|mysql|postgresql|postgres)\b/i },
    { name: "MongoDB", regex: /\bmongodb\b/i },
    { name: "Redis", regex: /\bredis\b/i },
    { name: "Machine Learning", regex: /\b(machine learning|ml)\b/i },
    { name: "Deep Learning", regex: /\b(deep learning|neural networks)\b/i },
    { name: "PyTorch", regex: /\bpytorch\b/i },
    { name: "TensorFlow", regex: /\btensorflow\b/i },
    { name: "NLP", regex: /\b(nlp|natural language processing)\b/i },
    { name: "Computer Vision", regex: /\b(computer vision|opencv|yolo|yolov8)\b/i },
    { name: "AWS", regex: /\b(aws|amazon web services)\b/i },
    { name: "Docker", regex: /\bdocker\b/i },
    { name: "Kubernetes", regex: /\b(kubernetes|k8s)\b/i },
    { name: "Git", regex: /\bgit(hub|lab)?\b/i },
    { name: "CI/CD", regex: /\b(ci\/cd|github actions|jenkins)\b/i },
    { name: "REST APIs", regex: /\b(rest|restful|api)\b/i },
    { name: "GraphQL", regex: /\bgraphql\b/i },
    { name: "DSA", regex: /\b(dsa|data structures|algorithms)\b/i },
    { name: "Pandas", regex: /\bpandas\b/i },
    { name: "Scikit-Learn", regex: /\b(scikit-learn|sklearn)\b/i },
    { name: "Linux", regex: /\blinux\b/i }
  ];

  const detectedSkills = allKnownSkills
    .filter(s => s.regex.test(textLower))
    .map(s => s.name);

  // Expected skills for target role
  const targetExpected = ROLE_SKILL_REQUIREMENTS[targetRole] || ROLE_SKILL_REQUIREMENTS["Full-Stack Developer"];
  
  // Also incorporate any custom JD keywords
  const jdKeywords: string[] = [];
  if (jobDescription && jobDescription.length > 20) {
    allKnownSkills.forEach(s => {
      if (s.regex.test(jobDescription.toLowerCase()) && !targetExpected.includes(s.name)) {
        jdKeywords.push(s.name);
      }
    });
  }
  const combinedRequirements = Array.from(new Set([...targetExpected, ...jdKeywords]));

  const matchedKeywords = combinedRequirements.filter(skill => detectedSkills.includes(skill));
  const missingKeywords = combinedRequirements.filter(skill => !detectedSkills.includes(skill));

  // 2. Metrics & Quantified Results Scan
  const metricMatches = resumeText.match(/\b\d+(\.\d+)?(%|\+|x|k|ms|s|gb|mb|users|requests|stars|qps)\b|\$\d+|\b(improved|reduced|increased|accelerated)\s+by\s+\d+/gi) || [];
  const metricsCount = metricMatches.length;

  // 3. Action Verbs Scan
  const actionVerbs = [
    "engineered", "deployed", "optimized", "architected", "automated", 
    "implemented", "spearheaded", "accelerated", "designed", "scaled", "reduced", "led"
  ];
  const detectedVerbs = actionVerbs.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(textLower));

  // 4. Section Completeness Scan
  const hasEducation = /\b(education|university|college|b\.tech|bachelor|degree|gpa|cgpa)\b/i.test(textLower);
  const hasProjects = /\b(projects|personal projects|academic projects)\b/i.test(textLower);
  const hasExperience = /\b(experience|internship|work history|employment)\b/i.test(textLower);
  const hasSkills = /\b(skills|technical skills|technologies)\b/i.test(textLower);
  const hasLinks = /\b(github\.com|linkedin\.com|portfolio|http)\b/i.test(textLower);

  // 5. Calculate Sub-Scores (0-100)
  // Impact Quantification: based on frequency of numerical metrics and strong action verbs
  const impactScore = Math.min(100, Math.max(25, metricsCount * 12 + detectedVerbs.length * 6));
  
  // Technical Stack Match: ratio of matched keywords to required keywords
  const techMatchRatio = combinedRequirements.length > 0 ? (matchedKeywords.length / combinedRequirements.length) : 0.6;
  const techScore = Math.min(100, Math.max(30, Math.round(techMatchRatio * 85 + (detectedSkills.length > 5 ? 15 : 5))));

  // Project Architecture Depth: based on presence of system design, deployment, DB, and project sections
  const hasSystemDepth = /\b(docker|kubernetes|aws|microservices|distributed|pipeline|architecture|database|redis)\b/i.test(textLower);
  const projectDepthScore = Math.min(100, Math.max(20, 
    (hasProjects ? 35 : 10) + 
    (hasSystemDepth ? 35 : 10) + 
    (detectedSkills.length >= 6 ? 20 : 10) + 
    (metricsCount >= 2 ? 10 : 0)
  ));

  // ATS Formatting Readiness: structure, sections, length, cleanliness
  let formatScore = 50;
  if (hasEducation) formatScore += 10;
  if (hasProjects) formatScore += 10;
  if (hasExperience) formatScore += 10;
  if (hasSkills) formatScore += 10;
  if (hasLinks) formatScore += 10;
  formatScore = Math.min(100, formatScore);

  // Overall Score (Weighted combination)
  const overallScore = Math.round(
    techScore * 0.35 +
    projectDepthScore * 0.25 +
    impactScore * 0.25 +
    formatScore * 0.15
  );

  const verdict = overallScore >= 85 
    ? "PRODUCTION READY" 
    : overallScore >= 70 
      ? "ASSOCIATE LEVEL" 
      : "CRITICAL ADJUSTMENTS NEEDED";

  // 6. 6-Axis Radar Metrics
  const coreCsScore = Math.min(100, Math.max(30, (detectedSkills.includes("DSA") || /\b(algorithm|data structure|tree|graph)\b/i.test(textLower) ? 40 : 15) + (hasEducation ? 35 : 15) + 20));
  const aimlScore = Math.min(100, Math.max(15, (detectedSkills.includes("Machine Learning") ? 30 : 0) + (detectedSkills.includes("Python") ? 25 : 5) + (detectedSkills.includes("PyTorch") || detectedSkills.includes("TensorFlow") ? 30 : 5) + 10));
  const sysArchScore = Math.min(100, Math.max(25, (hasSystemDepth ? 40 : 15) + (detectedSkills.includes("Docker") ? 25 : 5) + (detectedSkills.includes("SQL") ? 20 : 10)));
  const projImpactScore = impactScore;
  const cloudDevOpsScore = Math.min(100, Math.max(15, (detectedSkills.includes("Docker") ? 30 : 0) + (detectedSkills.includes("AWS") ? 30 : 0) + (detectedSkills.includes("CI/CD") ? 25 : 5) + 15));
  const atsDensityScore = formatScore;

  const radarMetrics = [
    { subject: "Core CS & DSA", score: coreCsScore, fullMark: 100 },
    { subject: "AI/ML & Data", score: aimlScore, fullMark: 100 },
    { subject: "System Architecture", score: sysArchScore, fullMark: 100 },
    { subject: "Project Impact", score: projImpactScore, fullMark: 100 },
    { subject: "Cloud & DevOps", score: cloudDevOpsScore, fullMark: 100 },
    { subject: "ATS Keyword Density", score: atsDensityScore, fullMark: 100 }
  ];

  // 7. Dynamic Bullet Rewrites (100% Derived from actual extracted bullets)
  const extractedBullets = extractExperienceBullets(resumeText);
  const bulletsToRewrite = extractedBullets.length > 0 ? extractedBullets : [
    "Developed software services and assisted team with application code maintenance.",
    "Built features for user interfaces and connected frontend components to backend endpoints.",
    "Wrote automated tests and resolved bugs identified during integration testing."
  ];

  const bulletRewrites = bulletsToRewrite.map((orig, idx) => {
    const { improvedXYZ, impactGain } = deriveDynamicXYZ(orig, idx);
    return {
      original: orig,
      improvedXYZ,
      impactGain
    };
  });

  // 8. Generate Prioritized Loophole Roadmap (with High/Medium/Low badges)
  const loopholes = [
    {
      severity: (missingKeywords.length > 2 ? "Critical" : "Moderate") as 'Critical' | 'Moderate',
      title: `Missing ${missingKeywords[0] || "Cloud Stack"} Alignment`,
      fix: `Inject targeted implementation evidence for ${missingKeywords[0] || "production cloud orchestration"} into project section.`,
      sprint: "15-Min Fix",
      issue: `Missing Mission-Critical Stack Alignment: [${missingKeywords.slice(0, 3).join(", ") || "Cloud Architecture"}]`,
      fixAction: `Inject targeted implementation evidence for ${missingKeywords[0] || "production cloud orchestration"} into project section.`,
      timeframe: "15-Min Fix",
      skill: missingKeywords[0] || "Cloud Architecture",
      impact: "High priority for baseline screening automation filters.",
      theoryCheck: `Master operational trade-offs and concurrency models in ${missingKeywords[0] || "Cloud systems"}.`,
      projectBuild: `Build a dockerized micro-service implementing ${missingKeywords[0] || "scalable API endpoints"}.`,
      profileInjection: `Demonstrate hands-on benchmark metrics and deployment links in resume.`
    },
    {
      severity: (metricsCount < 3 ? "Critical" : "Moderate") as 'Critical' | 'Moderate',
      title: "Quantified Impact Metrics",
      fix: "Rewrite top 3 project bullets using Google XYZ quantified formula with concrete percentages.",
      sprint: "15-Min Fix",
      issue: "Impact Metric Deficit: Project bullets lack measurable business/performance metrics",
      fixAction: "Reformat project descriptions using the Google XYZ formula (X accomplished, Y measured, Z done).",
      timeframe: "15-Min Fix",
      skill: "Quantified Engineering",
      impact: "Distinguishes junior code writers from impact-driven software engineers.",
      theoryCheck: "Study system observability, benchmarking, and throughput calculation.",
      projectBuild: "Instrument existing projects with latency metrics or load testing benchmarks.",
      profileInjection: "Update resume bullet points with concrete latency, scale, and accuracy figures."
    },
    {
      severity: "Moderate" as 'Critical' | 'Moderate',
      title: "Production Deployment Signals",
      fix: "Add GitHub Actions workflows and Dockerfiles to top pinned repositories.",
      sprint: "2-Day Sprint",
      issue: "DevOps & Production Delivery Signals: Limited proof of CI/CD or containerization",
      fixAction: "Add GitHub Actions workflows and Dockerfiles to top pinned repositories.",
      timeframe: "2-Day Sprint",
      skill: "Containerization & CI/CD",
      impact: "Essential for modern engineering team workflows and zero-friction onboarding.",
      theoryCheck: "Understand multi-stage Docker builds and automated lint/test validation.",
      projectBuild: "Create a GitHub Actions pipeline triggering linting, unit tests, and Docker image builds.",
      profileInjection: "Highlight 'Docker, GitHub Actions CI/CD' directly under the Technical Skills section."
    }
  ];

  // 9. Customized Technical Interview Questions
  const interviewQuestions = [
    {
      category: "Project Deep-Dive",
      question: `Walk me through the most technically complex architectural decision in your featured project. What trade-offs did you evaluate?`,
      expectedAnswerKeyPoints: "Clear breakdown of bottlenecks identified, alternative patterns considered (e.g. monolith vs microservices, SQL vs NoSQL), and quantifiable outcomes achieved.",
      corePillars: ["Architecture", "Trade-Off Analysis", "Performance"]
    },
    {
      category: "Technical Core",
      question: `How would you optimize data access patterns when scaling ${detectedSkills[0] || "backend services"} to handle a 10x traffic spike without degrading latency?`,
      expectedAnswerKeyPoints: "Indexing strategies, caching layers (Redis), database read-replicas, connection pooling, and asynchronous message queues.",
      corePillars: ["Scaling", "Concurrency", "Database Optimization"]
    },
    {
      category: "Scenario",
      question: `Describe a scenario where a deployment or model pipeline failed in staging/production. How did you debug the root cause?`,
      expectedAnswerKeyPoints: "Systematic root cause analysis using structured logs, metrics rollback verification, and post-mortem safeguards (e.g., automated health-checks).",
      corePillars: ["Observability", "Debugging", "Reliability"]
    }
  ];

  // 10. Backward Compatibility Layer for Existing UI
  return {
    candidateName,
    targetRole,
    overallScore,
    score: overallScore,
    verdict,
    atsBreakdown: {
      impactQuantification: impactScore,
      technicalStackMatch: techScore,
      projectArchitectureDepth: projectDepthScore,
      formattingReadiness: formatScore
    },
    radarMetrics,
    matchedKeywords,
    missingKeywords,
    loopholes,
    bulletRewrites,
    interviewQuestions,
    scoreBreakdown: {
      coreCompetencies: Math.round(techScore * 0.25),
      domainFrameworks: Math.round(projectDepthScore * 0.25),
      projectComplexity: Math.round(impactScore * 0.35),
      academicsFundamentals: Math.round(formatScore * 0.15)
    },
    resumeMetrics: {
      completenessScore: formatScore,
      atsScore: Math.round((techScore + formatScore) / 2),
      jobMatchScore: techScore,
      completenessChecklist: [
        { item: "Contact & Portfolio Links", status: hasLinks, recommendation: "Ensure GitHub and LinkedIn links are clickable." },
        { item: "Technical Skill Categorization", status: detectedSkills.length >= 5, recommendation: "Group skills into Languages, Frameworks, and Cloud/Tools." },
        { item: "Quantifiable Impact Bullets", status: metricsCount >= 3, recommendation: "Incorporate %, $, or latency metrics in at least 3 bullets." },
        { item: "Deployment & Production Artifacts", status: hasSystemDepth, recommendation: "Include live preview links or Docker setup instructions." }
      ]
    },
    insights: {
      strengths: [
        `Strong technical foundation demonstrated with ${detectedSkills.slice(0, 4).join(", ") || "core programming skills"}.`,
        metricsCount > 0 ? `Good evidence of quantified outcomes in ${metricsCount} instances across projects.` : "Clear chronological narrative across project achievements.",
        `Demonstrated compatibility with target role '${targetRole}'.`
      ],
      weaknesses: [
        missingKeywords.length > 0 ? `Lacks explicitly demonstrated competency in ${missingKeywords.slice(0, 3).join(", ")}.` : "Could benefit from deeper architectural benchmarking.",
        metricsCount < 3 ? "Several project bullet points describe passive duties rather than quantified results." : "Limited mention of observability and automated test suites."
      ],
      recommendations: [
        `Adopt Google XYZ formula rewrites across project descriptions to boost ATS scoring.`,
        `Address priority loopholes by adding containerized Docker deployments to GitHub repositories.`,
        `Practice scenario-based architectural trade-offs using the customized interview simulator.`
      ]
    },
    keywordAnalysis: {
      matched: matchedKeywords,
      missing: missingKeywords,
      stronglyMatchedSkills: matchedKeywords.slice(0, 3),
      partiallyMatchedSkills: matchedKeywords.slice(3),
      missingSkills: missingKeywords,
      reasoning: `Profile exhibits strong affinity for ${matchedKeywords.slice(0, 3).join(", ") || "software fundamentals"}, with strategic headroom in ${missingKeywords.slice(0, 2).join(", ") || "enterprise tooling"}.`
    },
    jobMatching: {
      skillsMatch: techScore,
      projectsMatch: projectDepthScore,
      experienceMatch: Math.min(100, Math.max(40, overallScore - 5)),
      educationMatch: hasEducation ? 90 : 60,
      keywordsMatch: Math.round(techMatchRatio * 100)
    },
    skillGap: {
      strong: matchedKeywords.slice(0, 3),
      developing: matchedKeywords.slice(3),
      missing: loopholes.map(l => ({
        skill: l.skill || "Technical Gap",
        impact: l.impact || l.issue,
        theoryCheck: l.theoryCheck || "Review theoretical concepts.",
        projectBuild: l.projectBuild || "Build a working demonstration.",
        profileInjection: l.profileInjection || l.fixAction
      }))
    },
    learningRoadmap: loopholes.map((l, idx) => ({
      phase: `Phase ${idx + 1}`,
      title: l.timeframe,
      topics: [l.skill || "Core Topic", "Hands-on Project", "Documentation & Verification"],
      priority: l.severity,
      difficulty: idx === 0 ? "Beginner" : "Intermediate"
    })),
    projectCritique: [
      {
        projectName: "Primary Featured Project",
        verdict: projectDepthScore >= 75 ? "STRONG ARCHITECTURE" : "NEEDS QUANTIFICATION",
        critique: "Demonstrates core functionality; recommend adding latency and scale benchmarks to bullets.",
        metricScore: projectDepthScore
      }
    ],
    skills: matchedKeywords.concat(missingKeywords.slice(0, 2)).map((k, idx) => {
      const isMet = matchedKeywords.includes(k);
      return {
        pillar: k,
        evidence: isMet ? `Verified in resume text and project context.` : `Key requirement for ${targetRole}.`,
        gapLevel: isMet ? "Met" : "Missing",
        priorityWeight: idx < 3 ? "High" : "Medium",
        candidateLevel: isMet ? 85 : 30,
        targetThreshold: 80,
        tooltipText: isMet ? `Strong alignment detected.` : `Recommended to add projects demonstrating ${k}.`
      };
    }),
    atsOptimization: bulletRewrites.map(b => ({
      gap: b.original,
      enhancement: b.improvedXYZ
    })),
    marketViability: {
      startupProbability: Math.min(95, overallScore + 5),
      midMarketProbability: Math.min(90, overallScore),
      maangProbability: Math.max(20, overallScore - 15),
      strategicAdvice: "Focus on quantified XYZ formula descriptions and pinned GitHub code samples to stand out in recruiter screening."
    },
    interviewSimulator: interviewQuestions.map(q => ({
      question: q.question,
      corePillars: q.corePillars || ["Technical Architecture", "Problem Solving"]
    })),
    question_sets: generateDefaultQuestionSets(targetRole, detectedSkills, resumeText)
  };
}
