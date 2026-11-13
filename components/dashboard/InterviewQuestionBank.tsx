"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, ChevronDown, ChevronUp, Tag, ShieldCheck } from 'lucide-react';
import { QuestionSet } from '@/lib/types';
import { toast } from 'sonner';

export function InterviewQuestionBank({ initialSets = [], onFetchFreshBatch }: {
  initialSets: QuestionSet[];
  onFetchFreshBatch: (excludedQuestions: string[]) => Promise<QuestionSet[]>;
}) {
  const [sets, setSets] = useState<QuestionSet[]>(initialSets);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [seenSetIndices, setSeenSetIndices] = useState<number[]>([0]);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (initialSets && initialSets.length > 0) {
      setSets(initialSets);
      setCurrentSetIndex(0);
      setSeenSetIndices([0]);
    }
  }, [initialSets]);

  const currentSet = sets[currentSetIndex] || sets[0];

  const handleRegenerate = async () => {
    setExpandedAnswers({}); // Collapse open answers for the new set

    // If there are still unseen sets in the current 4-set batch, advance to next set
    if (seenSetIndices.length < sets.length) {
      const nextIndex = (currentSetIndex + 1) % sets.length;
      setCurrentSetIndex(nextIndex);
      setSeenSetIndices((prev) => Array.from(new Set([...prev, nextIndex])));
      toast.info(`Switched to Interview Set ${nextIndex + 1}`, {
        description: sets[nextIndex]?.theme || "New Interview Module"
      });
      return;
    }

    // Once all 4 sets have been viewed, fetch a brand-new batch excluding all prior questions
    setIsRegenerating(true);
    toast.info("Generating Fresh Batch", {
      description: "Invoking AI Recruiter for a completely fresh non-overlapping question set..."
    });

    try {
      const allPreviousQuestions = sets.flatMap((s) => s.questions.map((q) => q.question));
      const freshSets = await onFetchFreshBatch(allPreviousQuestions);
      if (freshSets && freshSets.length > 0) {
        setSets(freshSets);
        setCurrentSetIndex(0);
        setSeenSetIndices([0]);
        toast.success("Fresh Question Sets Ready", {
          description: "4 new non-overlapping sets loaded successfully."
        });
      }
    } catch (err: any) {
      console.warn("Error fetching fresh batch:", err);
      toast.error("Could not fetch fresh batch", { description: "Re-cycling current sets." });
      setCurrentSetIndex((currentSetIndex + 1) % sets.length);
    } finally {
      setIsRegenerating(false);
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
              Tailored Interview Question Bank
            </h3>
            <span className="text-xs px-3 py-1 rounded-full bg-[#E5D3B3]/15 text-[#E5D3B3] border border-[#E5D3B3]/30 font-semibold">
              Set {currentSetIndex + 1} of {sets.length} &bull; {currentSet?.theme}
            </span>
          </div>
          <p className="text-xs text-[#A39E93] mt-1.5">
            Progressive 4-tier simulation with key talking-point keywords and Google-standard candidate answers.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5D3B3] hover:bg-[#F0E2C8] text-[#08080A] text-xs font-bold transition shadow-[0_0_15px_rgba(229,211,179,0.25)] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating 
            ? 'Generating Fresh Batch...' 
            : seenSetIndices.length < sets.length 
              ? `Next Set (${seenSetIndices.length}/${sets.length} Viewed)` 
              : 'Regenerate 4 New Sets'}
        </button>
      </div>

      {/* Set Selector Tabs Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {sets.map((s, idx) => {
          const isActive = idx === currentSetIndex;
          const isSeen = seenSetIndices.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentSetIndex(idx);
                setSeenSetIndices((prev) => Array.from(new Set([...prev, idx])));
              }}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs
                ${isActive 
                  ? 'bg-[#141418] border-[#E5D3B3] text-[#F5F2EB] shadow-[0_0_12px_rgba(229,211,179,0.15)] font-bold' 
                  : isSeen 
                    ? 'bg-[#141418]/50 border-white/[0.08] text-[#A39E93] hover:text-[#F5F2EB]' 
                    : 'bg-[#141418]/30 border-dashed border-white/[0.05] text-[#A39E93]/60 hover:text-[#A39E93]'
                }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-[#E5D3B3]">
                <span>SET {idx + 1}</span>
                {isSeen && <span className="text-[#6EE7B7]">&bull; Ready</span>}
              </div>
              <div className="truncate font-semibold text-[11px]">{s.theme}</div>
            </button>
          );
        })}
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
