"use client";

import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, Zap, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoopholeItem } from '@/lib/types';

interface Props {
  loopholes?: LoopholeItem[];
  missingGaps?: LoopholeItem[];
  onNavigateSection?: (sectionId: "bullet-rewriter" | "interview-prep") => void;
}

const DEFAULT_LOOPHOLE: LoopholeItem = {
  severity: 'Critical',
  title: 'Quantified Impact Metrics',
  fix: 'Rewrite top 3 project bullets using Google XYZ quantified formula with concrete percentages.',
  sprint: '15-Min Fix',
  issue: 'Quantified Impact Metrics',
  fixAction: 'Rewrite top 3 project bullets using Google XYZ quantified formula with concrete percentages.',
  timeframe: '15-Min Fix'
};

export const LoopholeRemediation = ({ loopholes = [], missingGaps = [], onNavigateSection }: Props) => {
  const [showMore, setShowMore] = useState(false);

  // Normalize source arrays and guarantee at least 1 actionable loop
  const rawItems = loopholes.length > 0 ? loopholes : (missingGaps.length > 0 ? missingGaps : []);
  const items: LoopholeItem[] = rawItems.length > 0 ? rawItems : [DEFAULT_LOOPHOLE];

  // Visible items (1-2 compact items by default, expand on toggle)
  const visibleItems = showMore ? items : items.slice(0, 2);

  return (
    <Card className="bg-[rgba(18,18,22,0.78)] backdrop-blur-xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] rounded-2xl flex flex-col overflow-hidden mt-6">
      <CardHeader className="border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#F5F2EB]">
              <ShieldAlert className="w-5 h-5 text-[#E5D3B3]" /> 
              Prioritized Loophole Remediation Roadmap
            </CardTitle>
            <p className="text-xs text-[#A39E93] mt-1">
              Targeted sprint protocols with severity weighting to surgically repair critical profile gaps.
            </p>
          </div>
          <Badge className="w-fit bg-[#E5D3B3]/10 text-[#E5D3B3] border border-[#E5D3B3]/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide">
            {items.length} Actionable {items.length === 1 ? 'Loop' : 'Loops'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 space-y-2.5">
        {visibleItems.map((gap, idx) => {
          const rawSeverity = (gap.severity || '').toString().toLowerCase();
          const isCritical = rawSeverity.includes('critical') || rawSeverity.includes('high') || idx === 0;
          const severityLabel = isCritical ? 'Critical' : 'Moderate';
          
          const title = gap.title || gap.skill || gap.issue || `Strategic Gap #${idx + 1}`;
          const fix = gap.fix || gap.fixAction || gap.impact || 'Inject concrete implementation artifacts into resume project section.';
          const sprint = gap.sprint || gap.timeframe || (idx === 0 ? '15-Min Fix' : '2-Day Sprint');

          const isInterviewRelated = (title + fix).toLowerCase().includes('interview') || (title + fix).toLowerCase().includes('theory') || (title + fix).toLowerCase().includes('scenario');
          const targetSection = isInterviewRelated ? 'interview-prep' : 'bullet-rewriter';
          const actionLabel = isInterviewRelated ? 'Practice in Interview' : 'Fix in Rewriter';

          return (
            <div 
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 sm:py-3 rounded-xl bg-[#141418] border border-[rgba(229,211,179,0.12)] hover:border-[rgba(229,211,179,0.32)] transition-all duration-200 shadow-sm"
              style={{ padding: '12px 16px' }}
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                {/* Severity Badge */}
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md border whitespace-nowrap shrink-0 mt-0.5 sm:mt-0 ${
                  isCritical 
                    ? 'bg-[#FDA4AF]/15 text-[#FDA4AF] border-[#FDA4AF]/30' 
                    : 'bg-[#E5D3B3]/15 text-[#E5D3B3] border-[#E5D3B3]/30'
                }`}>
                  {severityLabel}
                </span>

                {/* Title & Fix Description */}
                <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-sm font-semibold text-[#F5F2EB] truncate shrink-0">
                    {title}
                  </span>
                  <span className="text-xs text-[#A39E93] leading-relaxed truncate sm:whitespace-normal font-sans">
                    {fix}
                  </span>
                </div>
              </div>

              {/* Sprint Duration Pill & Shortcut Action Button */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#E5D3B3] bg-[#E5D3B3]/10 border border-[#E5D3B3]/25 px-2.5 py-1 rounded-full whitespace-nowrap shadow-[0_0_8px_rgba(229,211,179,0.08)]">
                  <Zap className="w-3 h-3 text-[#E5D3B3]" />
                  {sprint}
                </span>

                {onNavigateSection && (
                  <button
                    onClick={() => onNavigateSection(targetSection)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E5D3B3] hover:text-[#08080A] bg-[#18181D] hover:bg-[#E5D3B3] border border-[rgba(229,211,179,0.25)] hover:border-[#E5D3B3] px-2.5 py-1 rounded-lg transition-all shadow-sm"
                    title={`Jump directly to ${actionLabel}`}
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Compact Toggle if 3+ items exist */}
        {items.length > 2 && (
          <div className="pt-1 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMore(!showMore)}
              className="text-xs text-[#E5D3B3] hover:text-[#F5F2EB] hover:bg-[#E5D3B3]/10 h-7 px-3 rounded-lg flex items-center gap-1.5 transition-all"
            >
              {showMore ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show Fewer Loops
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> + Show More ({items.length - 2} more)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
