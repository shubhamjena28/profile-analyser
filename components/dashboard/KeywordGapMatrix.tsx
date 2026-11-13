"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Layers } from "lucide-react";

interface Props {
  matchedKeywords: string[];
  missingKeywords: string[];
  targetRole: string;
}

export const KeywordGapMatrix = ({ matchedKeywords = [], missingKeywords = [], targetRole = "AI/ML Engineer" }: Props) => {
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchPercentage = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;

  return (
    <Card className="bg-[rgba(18,18,22,0.78)] backdrop-blur-xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] rounded-2xl overflow-hidden mt-6">
      <CardHeader className="border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-[#F5F2EB] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E5D3B3]" />
              Matched vs. Missing Keyword Gap Matrix
            </CardTitle>
            <p className="text-xs text-[#A39E93] mt-1">
              Exact technical stack alignment evaluated against target role: <span className="text-[#E5D3B3] font-semibold">{targetRole}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#141418] px-3 py-1.5 rounded-xl border border-[rgba(229,211,179,0.12)]">
            <span className="text-xs text-[#A39E93]">Match Density:</span>
            <span className="text-xs font-mono font-bold text-[#6EE7B7]">{matchPercentage}%</span>
            <span className="text-[11px] text-[#A39E93]">({matchedKeywords.length}/{totalKeywords})</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MATCHED KEYWORDS */}
        <div className="bg-[#141418] border border-[rgba(110,231,183,0.2)] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.04] pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6EE7B7] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
              Verified Stack Keywords ({matchedKeywords.length})
            </div>
            <span className="text-[10px] text-[#A39E93]">Present in Resume</span>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-1">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#6EE7B7]/10 text-[#6EE7B7] border border-[#6EE7B7]/30 shadow-[0_0_8px_rgba(110,231,183,0.15)] transition-all hover:scale-105"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#6EE7B7]" />
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-[#A39E93] italic py-2">No matching stack keywords verified.</p>
            )}
          </div>
        </div>

        {/* MISSING KEYWORDS */}
        <div className="bg-[#141418] border border-[rgba(253,164,175,0.2)] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.04] pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FDA4AF] uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-[#FDA4AF]" />
              Missing High-Yield Keywords ({missingKeywords.length})
            </div>
            <span className="text-[10px] text-[#A39E93]">Inject to Pass ATS</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#FDA4AF]/10 text-[#FDA4AF] border border-[#FDA4AF]/30 shadow-[0_0_8px_rgba(253,164,175,0.15)] transition-all hover:scale-105"
                >
                  <XCircle className="w-3 h-3 text-[#FDA4AF]" />
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-[#6EE7B7] font-medium py-2">Zero missing keywords! Exceptional stack coverage.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
