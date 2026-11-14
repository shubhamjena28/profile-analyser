"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MatrixBackground from "@/components/MatrixBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TopMetrics } from "@/components/dashboard/TopMetrics";
import { RadarCompetencyChart } from "@/components/dashboard/RadarCompetencyChart";
import { KeywordGapMatrix } from "@/components/dashboard/KeywordGapMatrix";
import { XYZBulletRewriter } from "@/components/dashboard/XYZBulletRewriter";
import { GitHubValidator } from "@/components/dashboard/GitHubValidator";
import { LoopholeRemediation } from "@/components/dashboard/LoopholeRemediation";
import { InterviewQuestionBank } from "@/components/dashboard/InterviewQuestionBank";
import { WorkspaceNavBar, NavSectionId, ViewMode } from "@/components/dashboard/WorkspaceNavBar";
import { AIAssistantWidget } from "@/components/chat/AIAssistantWidget";
import { saveAnalysisHistory, getAnalysisHistory, AnalysisHistory } from "@/lib/utils";
import { analyzeProfileDeterministically, generateDefaultQuestionSets, ROLE_SKILL_REQUIREMENTS } from "@/lib/deterministicAnalyzer";
import { ProfileAnalysisResult, QuestionSet } from "@/lib/types";
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Loader2, CheckCircle2, AlertTriangle, 
  Sparkles, UploadCloud, File as FileIcon, Trash2, Download, 
  Target, ChevronRight, ChevronLeft, User, BookOpen, Building2, Briefcase, GraduationCap,
  FileText, Compass, Layers, ChevronDown, ChevronUp
} from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
}

// Sample Profile & JD for One-Click Demo Mode
const SAMPLE_AI_PROFILE = `ALEX RIVERA
alex.rivera@email.com | github.com/alexrivera | linkedin.com/in/alexrivera

EDUCATION
B.S. in Computer Science & Artificial Intelligence, Expected May 2026
GPA: 3.84 / 4.0 | Relevant Coursework: Data Structures & Algorithms, Deep Learning, Distributed Systems

TECHNICAL SKILLS
Languages: Python, C++, TypeScript, SQL, Bash
Frameworks & ML: PyTorch, TensorFlow, FastAPI, Scikit-Learn, OpenCV, Next.js, React
Developer Tools & Cloud: Docker, Kubernetes, AWS (S3, EC2), Git, Linux, PostgreSQL, Redis

PROJECTS
• Deep Vision Industrial Defect Detection:
Trained and deployed a YOLOv8 real-time computer vision model achieving 94.2% mAP across 25,000 assembly line images. Reduced inference latency from 240ms to 42ms by quantizing PyTorch weights via TensorRT.

• Distributed Vector Semantic Search Engine:
Architected a high-throughput vector retrieval microservice handling 10M+ embeddings with sub-15ms P99 search latency. Implemented HNSW indexing in C++ with a containerized FastAPI backend deployed on AWS EC2.

• Autonomous Navigation Reinforcement Learning:
Engineered deep reinforcement learning policies (PPO) in Isaac Gym, improving simulated robotic obstacle avoidance success rate by 34% over baseline A* algorithms.`;

const SAMPLE_AI_JD = `AI/ML Engineer Associate / Intern
We are seeking an ambitious AI/ML Engineer to design, train, and deploy high-performance computer vision and deep learning pipelines.

Key Responsibilities & Requirements:
- Strong proficiency in Python, PyTorch or TensorFlow, and computer vision or NLP architectures.
- Hands-on experience containerizing inference pipelines using Docker and exposing low-latency REST/gRPC endpoints via FastAPI.
- Familiarity with SQL, vector retrieval systems, and cloud deployment (AWS or GCP).
- Experience measuring and optimizing model throughput, latency, and memory footprint.
- Demonstrated ability to write clean, maintainable code with Git version control and unit test coverage.`;

// Circular Progress Component (Warm Champagne Beige Theme)
const CircularProgress = ({ score }: { score: number }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progressTime = timestamp - startTimestamp;
      const t = Math.min(progressTime / duration, 1);
      const easeOut = 1 - Math.pow(1 - t, 3);
      const currentScore = Math.floor(easeOut * score);
      setProgress(currentScore);

      if (progressTime < duration) {
        window.requestAnimationFrame(step);
      } else {
        setProgress(score);
      }
    };

    window.requestAnimationFrame(step);
  }, [score]);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let colorClass = "text-[#FDA4AF]"; // Coral Rose
  let glowColor = "drop-shadow-[0_0_10px_rgba(253,164,175,0.5)]";
  if (progress >= 85) {
    colorClass = "text-[#6EE7B7]"; // Soft Emerald
    glowColor = "drop-shadow-[0_0_10px_rgba(110,231,183,0.5)]";
  } else if (progress >= 70) {
    colorClass = "text-[#E5D3B3]"; // Warm Champagne Beige
    glowColor = "drop-shadow-[0_0_10px_rgba(229,211,179,0.5)]";
  }

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="transform -rotate-90 w-28 h-28">
        <circle cx="56" cy="56" r={radius} className="stroke-[#141418]" strokeWidth="8" fill="none" />
        <circle 
          cx="56" cy="56" r={radius} 
          className={`stroke-current ${colorClass} transition-colors duration-300 ease-out ${glowColor}`} 
          strokeWidth="8" fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-black font-mono tracking-tighter transition-colors duration-300 ${colorClass}`}>
          {progress}
        </span>
      </div>
    </div>
  );
};

const AIProcessingCard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 w-full bg-transparent">
      <div className="bg-[#121216]/90 backdrop-blur-xl border border-[rgba(229,211,179,0.25)] p-8 rounded-2xl w-full max-w-lg mx-auto shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(229,211,179,0.15)] flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#E5D3B3]/20 rounded-full blur-xl animate-pulse" />
          <div className="bg-[#141418] p-4 rounded-full ring-1 ring-[rgba(229,211,179,0.3)] relative flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-[#E5D3B3] animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-[#F5F2EB] mb-2">Analyzing Profile & Technical Footprint...</h3>
        <p className="text-xs text-[#A39E93] mb-8 animate-pulse max-w-sm">
          Extracting technical stack clusters, calculating 6-axis competency radar, and generating Google XYZ rewrites.
        </p>

        <div className="w-full h-1.5 bg-[#141418] rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#C4AD88] via-[#E5D3B3] to-[#C4AD88] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  // Candidate Profile State
  const [userName, setUserName] = useState("Alex Rivera");
  const [userStatus, setUserStatus] = useState("4th Year");
  const [targetObjective, setTargetObjective] = useState("Full-Time Job Readiness");
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [githubUsername, setGithubUsername] = useState("");
  
  // Input Modes: 'pdf' | 'docx' | 'paste'
  const [inputMode, setInputMode] = useState<"pdf" | "docx" | "paste">("pdf");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedResumeText, setPastedResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow State
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProfileAnalysisResult | null>(null);
  const [historyList, setHistoryList] = useState<AnalysisHistory[]>([]);

  // Navigation & View Mode State
  const [activeNavSection, setActiveNavSection] = useState<NavSectionId>("overview-radar");
  const [viewMode, setViewMode] = useState<ViewMode>("scroll");

  // Scroll State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("overview-radar");

  const handleSelectNavSection = (sectionId: NavSectionId) => {
    setActiveNavSection(sectionId);
    if (viewMode === "scroll") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleResetWorkspace = () => {
    setResult(null);
    setUploadedFile(null);
    setPastedResumeText("");
    setActiveNavSection("overview-radar");
    toast.info("Workspace Reset", { description: "Ready to upload or test another profile." });
  };

  useEffect(() => {
    // Load historical snapshots
    setHistoryList(getAnalysisHistory());
  }, [result]);

  const handleRoleSelect = (role: string) => {
    setTargetRole(role);
    if (!jobDescription || jobDescription === SAMPLE_AI_JD) {
      const skills = ROLE_SKILL_REQUIREMENTS[role] || [];
      setJobDescription(`Target Role: ${role}\nRequired Core Competencies:\n- Proficient in ${skills.slice(0, 4).join(', ')}.\n- Experience with ${skills.slice(4, 8).join(', ')}.\n- Track record of building and deploying reliable production systems.`);
    }
  };

  const handleLoadSample = () => {
    setUserName("Alex Rivera");
    setUserStatus("4th Year");
    setTargetRole("AI/ML Engineer");
    setTargetObjective("Full-Time Job Readiness");
    setPastedResumeText(SAMPLE_AI_PROFILE);
    setJobDescription(SAMPLE_AI_JD);
    setGithubUsername("alexrivera");
    setInputMode("paste");
    setUploadedFile(null);
    toast.success("Sample AI/ML Profile Loaded", {
      description: "Ready to run instant assessment. Click 'Execute Readiness Assessment'."
    });
  };

  const enterWorkspace = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setOnboardingComplete(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('triggerParticleImpulse'));
    }
  };

  const goBackToIntent = () => {
    setOnboardingComplete(false);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isDocx = file.name.endsWith(".docx") || file.name.endsWith(".txt");
    
    if (!isPdf && !isDocx) {
      toast.error("Invalid File Type", { description: "Please upload a PDF, DOCX, or TXT document." });
      return;
    }

    setUploadedFile(file);
    if (isDocx) setInputMode("docx");
    else setInputMode("pdf");
    toast.success("File Selected", { description: `${file.name} ready for processing.` });
  };

  const handleRightPanelScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolled = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    setScrollProgress(progress);
    setShowScrollTop(scrolled > 400);

    if (viewMode === "scroll") {
      const sections: NavSectionId[] = [
        "overview-radar",
        "loophole-roadmap",
        "bullet-rewriter",
        "interview-prep"
      ];
      let current = activeNavSection;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300) {
            current = sections[i];
            break;
          }
        }
      }
      if (current !== activeNavSection) {
        setActiveNavSection(current);
      }
    }
  };

  const scrollToTop = () => {
    const analyticsContainer = document.getElementById('analytics-scroll-container');
    if (analyticsContainer) {
      analyticsContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const dashboardContainer = document.getElementById('dashboard-scroll-container');
    if (dashboardContainer) {
      dashboardContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Main Zero-Fail Analysis Pipeline
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    let extractedText = "";

    try {
      // 1. Text Extraction Layer
      if (inputMode === "paste") {
        extractedText = pastedResumeText.trim();
      } else if (uploadedFile) {
        if (uploadedFile.type === "application/pdf" || uploadedFile.name.endsWith(".pdf")) {
          toast.info("Extracting Resume Text", { description: "Parsing PDF structure locally..." });
          try {
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(" ");
              extractedText += pageText + "\n";
            }
          } catch (pdfErr) {
            console.warn("PDF extraction issue, reading as plain text fallback:", pdfErr);
            extractedText = await uploadedFile.text().catch(() => "");
          }
        } else {
          // Plain text / DOCX
          try {
            extractedText = await uploadedFile.text();
          } catch {
            extractedText = `Document: ${uploadedFile.name}`;
          }
        }
      }

      // 2. Text Length Validation Guard
      if (extractedText.trim().length < 40) {
        toast.error("Text Too Brief or Scanned", {
          description: "Extracted text is under 40 characters. Please paste your text directly or click 'Load Sample Profile'."
        });
        setInputMode("paste");
        setIsAnalyzing(false);
        return;
      }

      const activeJD = jobDescription.trim() || `Target Role: ${targetRole}\nCore Requirements: Technical engineering proficiency, project depth, system design, and communication.`;

      toast.info("Synthesizing Intelligence", { description: "Evaluating ATS density, 6-axis radar, and XYZ rewrites..." });

      // 3. Dual Payload Network Call with Instant Client Fallback
      let data: ProfileAnalysisResult | null = null;

      try {
        const payload = {
          jobDescription: activeJD,
          text: extractedText,
          resumeText: extractedText,
          userName,
          userStatus,
          targetObjective,
          targetRole
        };

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Random-Seed': Date.now().toString()
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          data = await res.json();
        }
      } catch (networkErr) {
        console.warn("Backend API call failed or timed out, activating local deterministic engine:", networkErr);
      }

      // 4. Deterministic Local Fallback Engine (100% Zero-Fail Uptime Guarantee)
      if (!data || !data.atsBreakdown) {
        console.log("Triggering client-side deterministic analyzer fallback.");
        data = analyzeProfileDeterministically(extractedText, targetRole, activeJD, userName);
      }

      setResult(data);
      saveAnalysisHistory(data, targetObjective);
      toast.success("Readiness Analysis Complete", {
        description: `Overall score: ${data.overallScore || data.score}/100. All metrics synchronized.`
      });

    } catch (criticalErr: any) {
      console.error("Critical failure during analysis execution, using emergency fallback:", criticalErr);
      const emergency = analyzeProfileDeterministically(extractedText || SAMPLE_AI_PROFILE, targetRole, jobDescription, userName);
      setResult(emergency);
      toast.success("Analysis Generated", { description: "Readiness profile generated." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchFreshInterviewBatch = async (excludedQuestions: string[]): Promise<QuestionSet[]> => {
    try {
      const res = await fetch('/api/regenerate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: pastedResumeText || (result?.candidateName ? `Candidate: ${result.candidateName}` : ''),
          jobDescription: jobDescription || `Target Role: ${targetRole}`,
          targetRole,
          excludedQuestions
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      return data.question_sets || [];
    } catch (err) {
      console.warn("Falling back to local fresh questions generator:", err);
      return generateDefaultQuestionSets(targetRole, result?.matchedKeywords || ["Python", "FastAPI"], "");
    }
  };

  const downloadPdfReport = async () => {
    try {
      toast.info("Compiling Report", { description: "Generating print-optimized placement document..." });
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('clean-pdf-template');
      if (!element) {
        toast.error("Template Not Found");
        return;
      }
      
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      
      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4] as [number, number, number, number],
        filename: `Placement_Readiness_Report_${userName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      element.style.display = originalDisplay;
      toast.success("Report Downloaded Successfully");
    } catch (e: any) {
      console.error("PDF Export Error:", e);
      toast.error("Export Failed", { description: "Could not export PDF report." });
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen text-[#F5F2EB] font-sans selection:bg-[#E5D3B3]/30 relative bg-[#08080A] overflow-hidden">
        {/* Ambient Radial Lighting Over Deep Obsidian Canvas */}
        <div className="ambient-lighting-layer" />
        <MatrixBackground />

        {/* View Controller */}
        <div className="relative w-full h-screen overflow-hidden z-10">
          <AnimatePresence mode="wait">

            {/* STAGE 1: ONBOARDING INTENT GATE */}
            {!onboardingComplete && (
              <motion.div 
                key="welcome-panel"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4"
              >
                <div className="w-full max-w-md">
                  <Card className="luxury-card rounded-2xl overflow-hidden shadow-2xl">
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#C4AD88] via-[#E5D3B3] to-[#C4AD88]" />
                    
                    <CardHeader className="text-center pb-2 pt-8">
                      <div className="mx-auto bg-[#141418] p-4 rounded-2xl border border-[rgba(229,211,179,0.25)] mb-4 w-fit shadow-[0_0_20px_rgba(229,211,179,0.15)]">
                        <Target className="w-9 h-9 text-[#E5D3B3]" />
                      </div>
                      <CardTitle className="text-3xl font-black tracking-tight text-[#F5F2EB] mb-1">
                        CareerPulse
                      </CardTitle>
                      <CardDescription className="text-[#A39E93] text-sm">
                        AI Placement & Internship Readiness Intelligence Suite
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5 p-7">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#E5D3B3]" /> Candidate Name
                        </label>
                        <Input 
                          type="text" 
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Alex Rivera"
                          className="bg-[#141418] border-[rgba(229,211,179,0.16)] focus:border-[#E5D3B3] text-[#F5F2EB] h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93] flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#E5D3B3]" /> Current Status
                        </label>
                        <select 
                          value={userStatus}
                          onChange={(e) => setUserStatus(e.target.value)}
                          className="w-full bg-[#141418] border border-[rgba(229,211,179,0.16)] rounded-xl px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#E5D3B3] transition-all cursor-pointer"
                        >
                          <option className="bg-[#141418]">1st Year College</option>
                          <option className="bg-[#141418]">2nd Year College</option>
                          <option className="bg-[#141418]">3rd Year College</option>
                          <option className="bg-[#141418]">4th Year (Placement Track)</option>
                          <option className="bg-[#141418]">Recent Graduate</option>
                          <option className="bg-[#141418]">Working Professional</option>
                        </select>
                      </div>

                      {/* Objective Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93]">Target Readiness Track</label>
                        <div className="grid grid-cols-2 gap-2 bg-[#141418] p-1.5 rounded-xl border border-[rgba(229,211,179,0.12)]">
                          <button
                            type="button"
                            onClick={() => setTargetObjective("Internship Readiness")}
                            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                              ${targetObjective === "Internship Readiness" 
                                ? "bg-[#E5D3B3] text-[#08080A] shadow-[0_0_12px_rgba(229,211,179,0.3)]" 
                                : "text-[#A39E93] hover:text-[#F5F2EB]"
                              }`}
                          >
                            <BookOpen className="w-4 h-4" /> Internship
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetObjective("Full-Time Job Readiness")}
                            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                              ${targetObjective === "Full-Time Job Readiness" 
                                ? "bg-[#E5D3B3] text-[#08080A] shadow-[0_0_12px_rgba(229,211,179,0.3)]" 
                                : "text-[#A39E93] hover:text-[#F5F2EB]"
                              }`}
                          >
                            <Briefcase className="w-4 h-4" /> Full-Time
                          </button>
                        </div>
                      </div>

                      <Button 
                        onClick={enterWorkspace}
                        className="btn-luxury-primary w-full h-12 mt-2 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2"
                      >
                        Enter Workspace <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: MAIN WORKSPACE DASHBOARD */}
            {onboardingComplete && (
              <motion.div 
                key="dashboard-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                id="dashboard-scroll-container"
                className="absolute inset-0 z-10 flex flex-col overflow-y-auto custom-scrollbar"
              >
                {/* Fixed Top Header */}
                <header className="border-b border-[rgba(229,211,179,0.12)] bg-[#08080A]/85 backdrop-blur-xl sticky top-0 z-50 shrink-0">
                  <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1500px]">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={goBackToIntent} 
                        className="text-[#A39E93] hover:text-[#F5F2EB] hover:bg-[#141418] rounded-full h-9 w-9"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <div className="bg-[#141418] border border-[rgba(229,211,179,0.25)] p-2 rounded-xl">
                        <Target className="w-4 h-4 text-[#E5D3B3]" />
                      </div>
                      <h1 className="text-lg font-black tracking-tight text-[#F5F2EB]">
                        CareerPulse
                      </h1>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-2 bg-[#121216] border border-[rgba(229,211,179,0.16)] px-3 py-1.5 rounded-full text-xs">
                        <User className="w-3.5 h-3.5 text-[#E5D3B3]" />
                        <span className="font-semibold text-[#F5F2EB]">{userName}</span>
                        <span className="text-[#A39E93]">|</span>
                        <span className="text-[#C4AD88] font-medium">{targetRole}</span>
                      </div>
                    </div>
                  </div>
                </header>

                <main className="flex-1 container mx-auto px-4 py-8 max-w-[1500px]">
                  <div className="grid lg:grid-cols-12 gap-8 min-h-[calc(100vh-8rem)]">

                    {/* LEFT PANEL: RESUME & JOB TARGET INPUTS */}
                    <div className="lg:col-span-4 space-y-6 flex flex-col">
                      <Card className="luxury-card rounded-2xl flex flex-col shadow-2xl">
                        <CardHeader className="pb-4 border-b border-[rgba(229,211,179,0.08)]">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#F5F2EB]">
                              <Building2 className="w-4 h-4 text-[#E5D3B3]" /> Profile & Target
                            </CardTitle>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleLoadSample}
                              className="h-7 px-2.5 text-[11px] font-bold text-[#08080A] bg-[#E5D3B3] hover:bg-[#F0E2C8] border-none rounded-lg shadow-[0_0_10px_rgba(229,211,179,0.25)] flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3 h-3" /> Load Sample Profile
                            </Button>
                          </div>
                          <CardDescription className="text-xs text-[#A39E93]">
                            Select your target role preset or paste custom job requirements.
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-5 space-y-5 flex-1 flex flex-col">
                          {/* 1. Target Role Selector */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93]">
                              Target Role Preset
                            </label>
                            <select
                              value={targetRole}
                              onChange={(e) => handleRoleSelect(e.target.value)}
                              className="w-full bg-[#141418] border border-[rgba(229,211,179,0.16)] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#E5D3B3] transition-all cursor-pointer font-medium"
                            >
                              <option value="AI/ML Engineer">AI/ML Engineer</option>
                              <option value="Full-Stack Developer">Full-Stack Developer</option>
                              <option value="Data Scientist">Data Scientist</option>
                              <option value="Cloud/DevOps Intern">Cloud/DevOps Intern</option>
                              <option value="Backend Engineer">Backend Engineer</option>
                            </select>
                          </div>

                          {/* 2. Optional GitHub Username Input */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <GithubIcon className="w-3.5 h-3.5 text-[#E5D3B3]" /> GitHub Username
                              </span>
                              <span className="text-[10px] text-[#A39E93] normal-case">(Optional Footprint Check)</span>
                            </label>
                            <Input
                              type="text"
                              placeholder="e.g. alexrivera"
                              value={githubUsername}
                              onChange={(e) => setGithubUsername(e.target.value)}
                              className="bg-[#141418] border-[rgba(229,211,179,0.16)] focus:border-[#E5D3B3] text-[#F5F2EB] h-9 rounded-xl text-xs"
                            />
                          </div>

                          {/* 3. Resume Input Modes (PDF / DOCX / Paste) */}
                          <div className="space-y-2 flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93]">
                                Resume Document Source
                              </label>
                            </div>

                            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as any)} className="w-full flex-1 flex flex-col">
                              <TabsList className="grid grid-cols-3 bg-[#141418] border border-[rgba(229,211,179,0.12)] p-1 rounded-xl h-9">
                                <TabsTrigger value="pdf" className="text-[11px] rounded-lg data-[state=active]:bg-[#E5D3B3] data-[state=active]:text-[#08080A] font-bold">
                                  PDF Upload
                                </TabsTrigger>
                                <TabsTrigger value="docx" className="text-[11px] rounded-lg data-[state=active]:bg-[#E5D3B3] data-[state=active]:text-[#08080A] font-bold">
                                  DOCX / TXT
                                </TabsTrigger>
                                <TabsTrigger value="paste" className="text-[11px] rounded-lg data-[state=active]:bg-[#E5D3B3] data-[state=active]:text-[#08080A] font-bold">
                                  Paste Text
                                </TabsTrigger>
                              </TabsList>

                              {/* TAB 1: PDF UPLOAD */}
                              <TabsContent value="pdf" className="mt-3 flex-1">
                                <div 
                                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px]
                                    ${isDragging 
                                      ? 'border-[#E5D3B3] bg-[#E5D3B3]/10' 
                                      : 'border-[rgba(229,211,179,0.2)] bg-[#141418] hover:border-[#E5D3B3]/50'
                                    }`}
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={handleDrop}
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                  />
                                  {uploadedFile && (inputMode === "pdf" || uploadedFile.name.endsWith(".pdf")) ? (
                                    <div className="flex flex-col items-center gap-1.5">
                                      <div className="bg-[#6EE7B7]/15 p-2.5 rounded-full border border-[#6EE7B7]/30">
                                        <FileIcon className="w-6 h-6 text-[#6EE7B7]" />
                                      </div>
                                      <p className="font-semibold text-xs text-[#F5F2EB] mt-1 truncate max-w-[220px]">{uploadedFile.name}</p>
                                      <p className="text-[10px] text-[#A39E93]">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="mt-1 text-xs text-[#FDA4AF] hover:text-[#FDA4AF] hover:bg-[#FDA4AF]/10 h-7 px-2"
                                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2">
                                      <UploadCloud className="w-7 h-7 text-[#E5D3B3]" />
                                      <div>
                                        <p className="text-xs font-semibold text-[#F5F2EB]">Drag & Drop PDF Resume</p>
                                        <p className="text-[10px] text-[#A39E93] mt-0.5">Supports PDF up to 10MB</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>

                              {/* TAB 2: DOCX / TXT UPLOAD */}
                              <TabsContent value="docx" className="mt-3 flex-1">
                                <div 
                                  className="border-2 border-dashed border-[rgba(229,211,179,0.2)] bg-[#141418] hover:border-[#E5D3B3]/50 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  {uploadedFile && (uploadedFile.name.endsWith(".docx") || uploadedFile.name.endsWith(".txt")) ? (
                                    <div className="flex flex-col items-center gap-1.5">
                                      <div className="bg-[#6EE7B7]/15 p-2.5 rounded-full border border-[#6EE7B7]/30">
                                        <FileText className="w-6 h-6 text-[#6EE7B7]" />
                                      </div>
                                      <p className="font-semibold text-xs text-[#F5F2EB] mt-1 truncate max-w-[220px]">{uploadedFile.name}</p>
                                      <p className="text-[10px] text-[#A39E93]">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="mt-1 text-xs text-[#FDA4AF] hover:text-[#FDA4AF] hover:bg-[#FDA4AF]/10 h-7 px-2"
                                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2">
                                      <FileText className="w-7 h-7 text-[#E5D3B3]" />
                                      <div>
                                        <p className="text-xs font-semibold text-[#F5F2EB]">Select Word (.docx) or Text (.txt)</p>
                                        <p className="text-[10px] text-[#A39E93] mt-0.5">Click to browse file</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>

                              {/* TAB 3: DIRECT PASTE TEXT FALLBACK */}
                              <TabsContent value="paste" className="mt-3 flex-1">
                                <Textarea
                                  placeholder="Paste raw resume text here directly if you don't have a PDF or if text extraction is blocked..."
                                  value={pastedResumeText}
                                  onChange={(e) => setPastedResumeText(e.target.value)}
                                  className="w-full min-h-[160px] bg-[#141418] border-[rgba(229,211,179,0.16)] focus:border-[#E5D3B3] text-[#F5F2EB] text-xs p-3 rounded-xl resize-none font-mono placeholder:text-[#A39E93]/50"
                                />
                              </TabsContent>
                            </Tabs>
                          </div>

                          {/* 4. Target Job Description Textarea */}
                          <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#A39E93]">
                              Job Description / Alignment Requirements
                            </label>
                            <Textarea
                              placeholder="Paste the target job description or requirements here..."
                              value={jobDescription}
                              onChange={(e) => setJobDescription(e.target.value)}
                              className="w-full min-h-[140px] bg-[#141418] border-[rgba(229,211,179,0.16)] focus:border-[#E5D3B3] text-[#F5F2EB] text-xs p-3 rounded-xl resize-none placeholder:text-[#A39E93]/50"
                            />
                          </div>

                          {/* Execute Button */}
                          <Button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing || (!uploadedFile && !pastedResumeText.trim())}
                            className="btn-luxury-primary w-full h-12 text-sm font-bold rounded-xl mt-2 disabled:opacity-40"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating Profile...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" /> Execute Readiness Assessment
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* RIGHT PANEL: DEEP INTELLIGENCE DASHBOARD */}
                    <div className="lg:col-span-8 flex flex-col">
                      <Card className="luxury-card rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
                        {isAnalyzing ? (
                          <AIProcessingCard />
                        ) : !result ? (
                          <div className="flex flex-col items-center justify-center h-full text-center p-12 min-h-[500px]">
                            <div className="w-16 h-16 rounded-2xl bg-[#141418] border border-[rgba(229,211,179,0.2)] flex items-center justify-center mx-auto mb-4 text-[#E5D3B3] shadow-[0_0_20px_rgba(229,211,179,0.1)]">
                              <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#F5F2EB] mb-1">Awaiting Candidate Profile</h3>
                            <p className="text-xs text-[#A39E93] max-w-md mx-auto mb-6">
                              Upload a resume or click &quot;Load Sample Profile&quot; on the left to generate your complete placement readiness intelligence report.
                            </p>
                            <Button
                              onClick={handleLoadSample}
                              className="btn-luxury-primary px-5 py-2 rounded-xl text-xs font-bold"
                            >
                              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Test With Sample Profile
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
                            
                            {/* OVERALL SCORE & VERDICT BANNER */}
                            <div className="p-6 border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent flex-shrink-0">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A39E93]">
                                  Candidate: <span className="text-[#F5F2EB] font-bold">{userName}</span> &bull; Track: <span className="text-[#E5D3B3] font-bold">{targetRole}</span>
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={downloadPdfReport}
                                    className="h-8 px-3 text-xs font-bold bg-[#141418] hover:bg-[#E5D3B3] hover:text-[#08080A] text-[#E5D3B3] border border-[rgba(229,211,179,0.25)] rounded-xl transition-all"
                                  >
                                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download Report PDF
                                  </Button>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-6">
                                <CircularProgress score={result.overallScore ?? result.score ?? 75} />
                                
                                <div className="flex-1 text-center sm:text-left space-y-2">
                                  <div className="text-xs font-bold uppercase tracking-wider text-[#A39E93]">
                                    Placement & Market Readiness Verdict
                                  </div>
                                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold border shadow-lg
                                    ${(result.overallScore ?? result.score ?? 0) >= 85 
                                      ? 'bg-[#6EE7B7]/15 text-[#6EE7B7] border-[#6EE7B7]/30' 
                                      : (result.overallScore ?? result.score ?? 0) >= 70 
                                        ? 'bg-[#E5D3B3]/15 text-[#E5D3B3] border-[#E5D3B3]/30' 
                                        : 'bg-[#FDA4AF]/15 text-[#FDA4AF] border-[#FDA4AF]/30'}
                                  `}>
                                    {(result.overallScore ?? result.score ?? 0) >= 85 ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                      <AlertTriangle className="w-4 h-4" />
                                    )}
                                    {result.verdict || "PRODUCTION READY"}
                                  </div>
                                  <p className="text-xs text-[#A39E93] leading-relaxed max-w-xl">
                                    {result.marketViability?.strategicAdvice || "Profile demonstrates strong baseline foundations with targeted room for quantifiable project optimizations."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* SCROLLABLE DETAILED ANALYTICS VIEW */}
                            <div 
                              id="analytics-scroll-container"
                              className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
                              style={{ scrollBehavior: 'smooth' }}
                              onScroll={handleRightPanelScroll}
                            >
                              {/* Sticky Glassmorphic Floating Navbar */}
                              <WorkspaceNavBar 
                                activeSection={activeNavSection}
                                onSelectSection={handleSelectNavSection}
                                loopholeCount={result.loopholes?.length || 0}
                                viewMode={viewMode}
                                onToggleViewMode={setViewMode}
                                onReset={handleResetWorkspace}
                              />

                              {/* SECTION 1: Overview & Radar */}
                              <div 
                                id="overview-radar" 
                                className="scroll-mt-24 space-y-6"
                                style={{ display: viewMode === "tabs" && activeNavSection !== "overview-radar" ? "none" : "block" }}
                              >
                                {viewMode === "tabs" ? (
                                  <motion.div
                                    key="tab-overview"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-6"
                                  >
                                    <TopMetrics result={result} />
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                      <div className="lg:col-span-6">
                                        <RadarCompetencyChart metrics={result.radarMetrics} />
                                      </div>
                                      <div className="lg:col-span-6">
                                        <KeywordGapMatrix 
                                          matchedKeywords={result.matchedKeywords}
                                          missingKeywords={result.missingKeywords}
                                          targetRole={targetRole}
                                        />
                                      </div>
                                    </div>
                                    <GitHubValidator 
                                      claimedSkills={result.matchedKeywords} 
                                      initialUsername={githubUsername}
                                    />
                                  </motion.div>
                                ) : (
                                  <>
                                    <TopMetrics result={result} />
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                      <div className="lg:col-span-6">
                                        <RadarCompetencyChart metrics={result.radarMetrics} />
                                      </div>
                                      <div className="lg:col-span-6">
                                        <KeywordGapMatrix 
                                          matchedKeywords={result.matchedKeywords}
                                          missingKeywords={result.missingKeywords}
                                          targetRole={targetRole}
                                        />
                                      </div>
                                    </div>
                                    <GitHubValidator 
                                      claimedSkills={result.matchedKeywords} 
                                      initialUsername={githubUsername}
                                    />
                                  </>
                                )}
                              </div>

                              {/* SECTION 2: Loophole Roadmap */}
                              <div 
                                id="loophole-roadmap" 
                                className="scroll-mt-24"
                                style={{ display: viewMode === "tabs" && activeNavSection !== "loophole-roadmap" ? "none" : "block" }}
                              >
                                {viewMode === "tabs" ? (
                                  <motion.div
                                    key="tab-roadmap"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                  >
                                    <LoopholeRemediation 
                                      loopholes={result.loopholes}
                                      missingGaps={result.skillGap?.missing as any}
                                      onNavigateSection={(target) => handleSelectNavSection(target)}
                                    />
                                  </motion.div>
                                ) : (
                                  <LoopholeRemediation 
                                    loopholes={result.loopholes}
                                    missingGaps={result.skillGap?.missing as any}
                                    onNavigateSection={(target) => handleSelectNavSection(target)}
                                  />
                                )}
                              </div>

                              {/* SECTION 3: XYZ Bullet Rewriter */}
                              <div 
                                id="bullet-rewriter" 
                                className="scroll-mt-24"
                                style={{ display: viewMode === "tabs" && activeNavSection !== "bullet-rewriter" ? "none" : "block" }}
                              >
                                {viewMode === "tabs" ? (
                                  <motion.div
                                    key="tab-bullets"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                  >
                                    <XYZBulletRewriter rewrites={result.bulletRewrites} />
                                  </motion.div>
                                ) : (
                                  <XYZBulletRewriter rewrites={result.bulletRewrites} />
                                )}
                              </div>

                              {/* SECTION 4: Interview Prep */}
                              <div 
                                id="interview-prep" 
                                className="scroll-mt-24"
                                style={{ display: viewMode === "tabs" && activeNavSection !== "interview-prep" ? "none" : "block" }}
                              >
                                {viewMode === "tabs" ? (
                                  <motion.div
                                    key="tab-interview"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                  >
                                    <InterviewQuestionBank 
                                      initialSets={result.question_sets || generateDefaultQuestionSets(targetRole, result.matchedKeywords || ["Python", "FastAPI"], pastedResumeText)}
                                      onFetchFreshBatch={fetchFreshInterviewBatch}
                                    />
                                  </motion.div>
                                ) : (
                                  <InterviewQuestionBank 
                                    initialSets={result.question_sets || generateDefaultQuestionSets(targetRole, result.matchedKeywords || ["Python", "FastAPI"], pastedResumeText)}
                                    onFetchFreshBatch={fetchFreshInterviewBatch}
                                  />
                                )}
                              </div>

                            </div>
                          </div>
                        )}
                      </Card>
                    </div>

                  </div>
                </main>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Clean PDF Template (Hidden from screen view, rendered for html2pdf export) */}
        {result && (
          <div className="hidden" style={{ display: 'none' }}>
            <div id="clean-pdf-template" className="p-8 bg-white text-black font-sans w-[800px]">
              <div className="border-b-2 border-black pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide">Placement Readiness & Profile Audit</h1>
                <p className="text-sm text-gray-600">Candidate: {userName || 'N/A'} | Target Role: {targetRole} ({targetObjective})</p>
              </div>

              <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Overall Readiness Score: {result.overallScore ?? result.score}/100</h2>
                <p className="text-sm font-semibold text-gray-700">Verdict: {result.verdict}</p>
                <p className="text-xs text-gray-600 mt-1">{result.marketViability?.strategicAdvice}</p>
              </div>

              {/* 4 ATS Subscores Table */}
              <div className="mb-6">
                <h3 className="text-md font-bold mb-2 border-b pb-1">ATS Sub-Score Breakdown</h3>
                <table className="w-full text-left text-xs border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Sub-Score Pillar</th>
                      <th className="border border-gray-300 p-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Impact Quantification</td>
                      <td className="border border-gray-300 p-2">{result.atsBreakdown?.impactQuantification}%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Technical Stack Match</td>
                      <td className="border border-gray-300 p-2">{result.atsBreakdown?.technicalStackMatch}%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Project Architecture Depth</td>
                      <td className="border border-gray-300 p-2">{result.atsBreakdown?.projectArchitectureDepth}%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">ATS Formatting Readiness</td>
                      <td className="border border-gray-300 p-2">{result.atsBreakdown?.formattingReadiness}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Google XYZ Formula Rewrites */}
              <div className="mb-6">
                <h3 className="text-md font-bold mb-2 border-b pb-1">Google XYZ Formula Rewrites</h3>
                <div className="space-y-2 text-xs">
                  {result.bulletRewrites?.map((b, idx) => (
                    <div key={idx} className="border border-gray-200 p-2 rounded">
                      <p className="text-gray-500 line-through mb-1">Original: {b.original}</p>
                      <p className="font-semibold text-gray-900">Rewritten: {b.improvedXYZ}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prioritized Loopholes */}
              <div className="mb-6">
                <h3 className="text-md font-bold mb-2 border-b pb-1">Prioritized Loophole Remediation</h3>
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                  {result.loopholes?.map((l, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">[{l.severity} Severity] {l.issue}</span> &mdash; {l.fixAction} ({l.timeframe})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Floating Back to Top / Re-Analyze Mini Pill */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-1.5 rounded-full bg-[rgba(14,14,18,0.85)] backdrop-blur-xl border border-[rgba(229,211,179,0.25)] shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(229,211,179,0.15)]"
            >
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#F5F2EB] hover:text-[#08080A] bg-[#141418] hover:bg-[#E5D3B3] transition-all"
                title="Scroll smoothly to top"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Top</span>
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#08080A] bg-[#E5D3B3] hover:bg-[#F0E2C8] transition-all shadow-[0_0_12px_rgba(229,211,179,0.3)] disabled:opacity-50"
                title="Re-run assessment"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-Analyze</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Assistant Widget */}
        {result && <AIAssistantWidget profileContext={result} />}
      </div>
    </ErrorBoundary>
  );
}
