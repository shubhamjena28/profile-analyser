"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Sparkles, ChevronDown, ChevronUp, Tag, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { QuestionSet } from '@/lib/types';
import { toast } from 'sonner';

interface InterviewQuestionBankProps {
  initialSets?: QuestionSet[];
  onFetchFreshBatch?: (excludedQuestions: string[]) => Promise<QuestionSet[]>;
  resumeText?: string;
  jobDescription?: string;
  targetRole?: string;
}

export function InterviewQuestionBank({ 
  initialSets = [], 
  resumeText = "",
  jobDescription = "",
  targetRole = "Software Engineer"
}: InterviewQuestionBankProps) {
  // 1. Core Double-Buffering State
  const [currentSet, setCurrentSet] = useState<QuestionSet | null>(null);
  const [nextSetBuffer, setNextSetBuffer] = useState<QuestionSet | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  
  // UI & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const [cycleIndex, setCycleIndex] = useState(1);
  const prefetchLockRef = useRef(false);

  // Silently pre-fetch the next unique set in the background
  const prefetchNextSet = useCallback(async (excludeList: string[]) => {
    if (prefetchLockRef.current) return;
    prefetchLockRef.current = true;
    setIsBuffering(true);

    try {
      const res = await fetch('/api/generate-single-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resume_text: resumeText, 
          jd_text: jobDescription, 
          target_role: targetRole,
          exclude_questions: excludeList 
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to buffer questions: ${res.statusText}`);
      }

      const data = await res.json();
      if (data?.question_set) {
        setNextSetBuffer(data.question_set);
      }
    } catch (err: any) {
      console.warn("Silent background pre-fetch warning:", err);
    } finally {
      setIsBuffering(false);
      prefetchLockRef.current = false;
    }
  }, [resumeText, jobDescription, targetRole]);

  // Initial mount: load first set and immediately pre-warm the next set buffer
  useEffect(() => {
    if (initialSets && initialSets.length > 0 && !currentSet) {
      const firstSet = initialSets[0];
      setCurrentSet(firstSet);
      const initialQuestions = firstSet.questions.map((q) => q.question);
      setAskedQuestions(initialQuestions);

      // If initialSets already had a second set, buffer it instantly; otherwise fetch
      if (initialSets.length > 1) {
        setNextSetBuffer(initialSets[1]);
      } else {
        prefetchNextSet(initialQuestions);
      }
    }
  }, [initialSets, currentSet, prefetchNextSet]);

  // When user clicks "Regenerate Questions"
  const handleRegenerate = async () => {
    setExpandedAnswers({}); // Collapse open answers for clean view

    if (nextSetBuffer) {
      // 1. Instant swap (0ms wait!)
      const updatedHistory = [
        ...askedQuestions,
        ...nextSetBuffer.questions.map((q) => q.question),
      ];
      setCurrentSet(nextSetBuffer);
      setAskedQuestions(updatedHistory);
      setNextSetBuffer(null);
      setCycleIndex((prev) => prev + 1);

      toast.success("Instant 0ms Set Swap", {
        description: `Loaded: ${nextSetBuffer.theme || "Advanced Technical Module"}`
      });

      // 2. Immediately pre-fetch the following set silently in the background
      prefetchNextSet(updatedHistory);
    } else {
      // Fallback only if user clicks faster than the background fetch finishes
      setIsLoading(true);
      try {
        const res = await fetch('/api/generate-single-set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            resume_text: resumeText, 
            jd_text: jobDescription, 
            target_role: targetRole,
            exclude_questions: askedQuestions 
          }),
        });
        const data = await res.json();
        if (data?.question_set) {
          const newSet = data.question_set;
          const updatedHistory = [
            ...askedQuestions,
            ...newSet.questions.map((q: any) => q.question),
          ];
          setCurrentSet(newSet);
          setAskedQuestions(updatedHistory);
          setCycleIndex((prev) => prev + 1);
          toast.success("Fresh Set Generated", {
            description: newSet.theme
          });
          // Immediately prefetch following set
          prefetchNextSet(updatedHistory);
        }
      } catch (err: any) {
        console.warn("Fallback generation error:", err);
        toast.error("Could not load fresh set", { description: "Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!currentSet) return null;

  return (
    <div className="rounded-2xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.38)] bg-[rgba(18,18,22,0.78)] backdrop-blur-xl p-6 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] transition-all duration-300">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[rgba(229,211,179,0.08)] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#141418] border border-[rgba(229,211,179,0.2)]">
              <Sparkles className="w-4 h-4 text-[#E5D3B3]" />
            </div>
            <h3 className="text-base font-bold text-[#F5F2EB]">
              Tailored Technical Interview Bank
            </h3>
            <span className="text-xs px-3 py-1 rounded-full bg-[#E5D3B3]/15 text-[#E5D3B3] border border-[#E5D3B3]/30 font-semibold">
              Cycle #{cycleIndex} &bull; {currentSet?.theme}
            </span>

            {/* Double-Buffer Status Indicator */}
            {nextSetBuffer ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6EE7B7] bg-[#6EE7B7]/10 border border-[#6EE7B7]/25 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(110,231,183,0.15)]">
                <Zap className="w-3.5 h-3.5 text-[#6EE7B7]" />
                0ms Swap Ready
              </span>
            ) : isBuffering ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#E5D3B3]/80 bg-[#E5D3B3]/10 border border-[#E5D3B3]/20 px-2.5 py-0.5 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin text-[#E5D3B3]" />
                Buffering Next Set...
              </span>
            ) : null}
          </div>
          <p className="text-xs text-[#A39E93] mt-1.5">
            Double-buffered recruiter simulation with zero repetition guarantee and instant 0ms generation.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(229,211,179,0.25)] disabled:opacity-50
            ${nextSetBuffer 
              ? "bg-[#E5D3B3] hover:bg-[#F0E2C8] text-[#08080A]" 
              : "bg-[#141418] hover:bg-[#E5D3B3] text-[#F5F2EB] hover:text-[#08080A] border border-[rgba(229,211,179,0.3)]"
            }
          `}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading 
            ? 'Generating...' 
            : nextSetBuffer 
              ? 'Instant Next Set (0ms)' 
              : 'Regenerate Questions'}
        </button>
      </div>

      {/* Sub-bar with metrics */}
      <div className="flex items-center justify-between text-xs text-[#A39E93] mb-4 bg-[#141418]/60 border border-white/[0.05] rounded-xl px-4 py-2">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
          <span>Active Questions: <strong className="text-[#F5F2EB]">{currentSet?.questions.length}</strong></span>
        </span>
        <span>Total Answered / Explored: <strong className="text-[#E5D3B3]">{askedQuestions.length} unique questions</strong></span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {currentSet?.questions.map((item, idx) => {
          const isOpen = !!expandedAnswers[item.id];
          return (
            <div
              key={item.id}
              className="rounded-xl border border-[rgba(229,211,179,0.12)] bg-[#141418] p-4 transition-all hover:border-[rgba(229,211,179,0.25)] shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[#F5F2EB] font-medium text-xs leading-relaxed">
                  <span className="text-[#E5D3B3] font-bold mr-2">Q{idx + 1}.</span>
                  {item.question}
                </p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border
                  ${item.difficulty === 'Hard' 
                    ? 'bg-[#FDA4AF]/15 text-[#FDA4AF] border-[#FDA4AF]/30' 
                    : item.difficulty === 'Medium' 
                      ? 'bg-[#FCD34D]/15 text-[#FCD34D] border-[#FCD34D]/30' 
                      : 'bg-[#6EE7B7]/15 text-[#6EE7B7] border-[#6EE7B7]/30'}
                `}>
                  {item.difficulty}
                </span>
              </div>

              {/* Target Keywords Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-white/[0.04]">
                <span className="flex items-center gap-1 text-[11px] text-[#A39E93] mr-1">
                  <Tag className="w-3 h-3 text-[#E5D3B3]" /> Target Keywords:
                </span>
                {item.target_keywords.map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#6EE7B7]/10 text-[#6EE7B7] border border-[#6EE7B7]/25"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Collapsible Sample Answer */}
              <button
                onClick={() => toggleAnswer(item.id)}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#E5D3B3] hover:text-[#F0E2C8] transition-colors"
              >
                {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {isOpen ? 'Hide Model Answer' : 'View Keyword-Guided Model Answer'}
              </button>

              {isOpen && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-[#08080A] border-l-2 border-[#E5D3B3] text-xs text-[#F5F2EB]/90 leading-relaxed font-sans shadow-inner">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#E5D3B3] mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6EE7B7]" /> Candidate Model Response:
                  </div>
                  {item.sample_answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
