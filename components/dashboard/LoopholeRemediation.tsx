"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, BookOpen, Wrench, FileText, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoopholeItem } from '@/lib/types';

interface LoopholeNode {
  skill?: string;
  impact?: string;
  theoryCheck?: string;
  projectBuild?: string;
  profileInjection?: string;
  severity?: 'High' | 'Medium' | 'Low';
  issue?: string;
  fixAction?: string;
  timeframe?: string;
}

interface Props {
  missingGaps?: LoopholeNode[];
  loopholes?: LoopholeItem[];
}

export const LoopholeRemediation = ({ missingGaps = [], loopholes = [] }: Props) => {
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());

  const items: LoopholeNode[] = loopholes.length > 0 
    ? loopholes 
    : missingGaps.length > 0 
      ? missingGaps 
      : [];

  if (!items || items.length === 0) return null;

  const togglePhase = (gapIdx: number, phase: string) => {
    const id = `${gapIdx}-${phase}`;
    setCompletedPhases(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isGapFullyCompleted = (gapIdx: number) => {
    return (
      completedPhases.has(`${gapIdx}-theory`) &&
      completedPhases.has(`${gapIdx}-project`) &&
      completedPhases.has(`${gapIdx}-profile`)
    );
  };

  return (
    <Card className="bg-[rgba(18,18,22,0.78)] backdrop-blur-xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] rounded-2xl flex flex-col overflow-hidden mt-6">
      <CardHeader className="border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#F5F2EB]">
              <ShieldAlert className="w-5 h-5 text-[#E5D3B3]" /> 
              Prioritized Loophole Remediation Roadmap
            </CardTitle>
            <p className="text-xs text-[#A39E93] mt-1">Targeted sprint protocols with severity weighting to surgically repair critical profile gaps.</p>
          </div>
          <Badge className="w-fit bg-[#E5D3B3]/10 text-[#E5D3B3] border border-[#E5D3B3]/25 text-[11px] font-semibold">
            {items.length} Actionable Loops
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {items.map((gap, idx) => {
          const completed = isGapFullyCompleted(idx);
          const skillTitle = gap.skill || gap.issue || `Strategic Gap #${idx + 1}`;
          const impactText = gap.impact || gap.fixAction || "Targeted remediation required.";
          const severity = gap.severity || (idx === 0 ? "High" : "Medium");
          
          return (
            <div 
              key={idx} 
              className={`relative p-5 rounded-xl border transition-all duration-500 shadow-lg overflow-hidden
                ${completed 
                  ? 'bg-[#121c17] border-[#6EE7B7]/40 shadow-[0_0_20px_rgba(110,231,183,0.1)]' 
                  : 'bg-[#141418] border-[rgba(229,211,179,0.14)] hover:border-[rgba(229,211,179,0.35)]'
                }`}
            >
              {/* Glow Accent Line */}
              <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${completed ? 'bg-[#6EE7B7]' : severity === 'High' ? 'bg-[#FDA4AF]' : 'bg-[#E5D3B3]'}`} />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pl-2">
                <div>
                  <h3 className="text-base font-bold text-[#F5F2EB] flex items-center gap-2">
                    {skillTitle}
                    {completed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                      </motion.div>
                    )}
                  </h3>
                  <p className="text-xs text-[#A39E93] mt-1 leading-relaxed max-w-2xl">{impactText}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={`uppercase tracking-wider text-[10px] font-bold px-2.5 py-0.5
                    ${severity === 'High' 
                      ? 'bg-[#FDA4AF]/15 text-[#FDA4AF] border border-[#FDA4AF]/30' 
                      : severity === 'Medium' 
                        ? 'bg-[#FCD34D]/15 text-[#FCD34D] border border-[#FCD34D]/30' 
                        : 'bg-[#6EE7B7]/15 text-[#6EE7B7] border border-[#6EE7B7]/30'}
                  `}>
                    {severity} Severity
                  </Badge>

                  {completed && (
                    <span className="text-[10px] font-semibold text-[#6EE7B7] bg-[#6EE7B7]/10 px-2 py-0.5 rounded border border-[#6EE7B7]/25">
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Vertical Timeline Nodes */}
              <div className="ml-3 pl-4 border-l border-[rgba(229,211,179,0.12)] space-y-4 relative mt-4">
                
                {/* Phase 1 */}
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => togglePhase(idx, 'theory')}
                >
                  <div className="absolute -left-[23px] top-0.5 rounded-full p-0.5 bg-[#141418]">
                    {completedPhases.has(`${idx}-theory`) ? (
                      <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#A39E93] group-hover:text-[#E5D3B3] transition-colors" />
                    )}
                  </div>
                  <div className={`transition-all duration-300 ${completedPhases.has(`${idx}-theory`) ? 'opacity-50' : 'opacity-100 group-hover:translate-x-1'}`}>
                    <h4 className="text-xs font-bold text-[#E5D3B3] flex items-center gap-1.5 mb-0.5">
                      <BookOpen className="w-3.5 h-3.5" /> Phase 1: Theoretical Depth
                    </h4>
                    <p className="text-xs text-[#A39E93] leading-relaxed">
                      {gap.theoryCheck || "Master the architectural foundations and trade-offs."}
                    </p>
                  </div>
                </div>

                {/* Phase 2 */}
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => togglePhase(idx, 'project')}
                >
                  <div className="absolute -left-[23px] top-0.5 rounded-full p-0.5 bg-[#141418]">
                    {completedPhases.has(`${idx}-project`) ? (
                      <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#A39E93] group-hover:text-[#E5D3B3] transition-colors" />
                    )}
                  </div>
                  <div className={`transition-all duration-300 ${completedPhases.has(`${idx}-project`) ? 'opacity-50' : 'opacity-100 group-hover:translate-x-1'}`}>
                    <h4 className="text-xs font-bold text-[#E5D3B3] flex items-center gap-1.5 mb-0.5">
                      <Wrench className="w-3.5 h-3.5" /> Phase 2: Hands-on Project Sprint
                    </h4>
                    <p className="text-xs text-[#A39E93] leading-relaxed">
                      {gap.projectBuild || "Build and benchmark a working demonstration repository."}
                    </p>
                  </div>
                </div>

                {/* Phase 3 */}
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => togglePhase(idx, 'profile')}
                >
                  <div className="absolute -left-[23px] top-0.5 rounded-full p-0.5 bg-[#141418]">
                    {completedPhases.has(`${idx}-profile`) ? (
                      <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#A39E93] group-hover:text-[#E5D3B3] transition-colors" />
                    )}
                  </div>
                  <div className={`transition-all duration-300 ${completedPhases.has(`${idx}-profile`) ? 'opacity-50' : 'opacity-100 group-hover:translate-x-1'}`}>
                    <h4 className="text-xs font-bold text-[#E5D3B3] flex items-center gap-1.5 mb-0.5">
                      <FileText className="w-3.5 h-3.5" /> Phase 3: Resume & Verification Injection
                    </h4>
                    <p className="text-xs text-[#A39E93] leading-relaxed">
                      {gap.profileInjection || "Update resume bullet points with concrete metrics and GitHub proof."}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
