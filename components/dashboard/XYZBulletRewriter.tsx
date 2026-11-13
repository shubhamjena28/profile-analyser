"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BulletRewrite } from "@/lib/types";
import { Copy, Check, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Props {
  rewrites: BulletRewrite[];
}

export const XYZBulletRewriter = ({ rewrites }: Props) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!rewrites || rewrites.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to Clipboard", {
      description: "Optimized XYZ bullet point ready to paste into your resume!"
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="bg-[rgba(18,18,22,0.78)] backdrop-blur-xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] rounded-2xl overflow-hidden mt-6">
      <CardHeader className="border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-[#F5F2EB] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E5D3B3]" />
              Impact Bullet Rewriter
            </CardTitle>
            <p className="text-xs text-[#A39E93] mt-1">
              Turn passive resume lines into metric-driven statements using Google&apos;s XYZ formula
            </p>
          </div>
          <Badge className="w-fit bg-[#E5D3B3]/15 text-[#E5D3B3] border border-[#E5D3B3]/30 px-3 py-1 text-[11px] font-semibold">
            {rewrites.length} Optimized Bullets
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        {rewrites.map((item, idx) => {
          const isCopied = copiedIndex === idx;
          const rewrittenText = item.improvedXYZ || (item as any).rewritten || item.original;
          const impactBadge = item.impactGain || (item as any).impact_badge || "+35% Metric Impact";

          return (
            <div 
              key={item.original || `bullet-${idx}`}
              className="group relative bg-[#141418] border border-[rgba(229,211,179,0.12)] hover:border-[rgba(229,211,179,0.35)] rounded-xl p-5 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A39E93]">
                  Bullet Point #{idx + 1}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6EE7B7] bg-[#6EE7B7]/10 border border-[#6EE7B7]/25 px-2.5 py-0.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {impactBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* BEFORE (Red / Passive) */}
                <div className="bg-[#181214] border border-[#FDA4AF]/25 rounded-lg p-3.5 relative">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FDA4AF] mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FDA4AF]" />
                    BEFORE (Weak / Passive Duty)
                  </div>
                  <p className="text-xs text-[#F5F2EB]/80 leading-relaxed font-sans line-clamp-3">
                    &ldquo;{item.original}&rdquo;
                  </p>
                </div>

                {/* AFTER (Warm Champagne Beige / Optimized XYZ) */}
                <div className="bg-[#161614] border border-[#E5D3B3]/40 rounded-lg p-3.5 relative shadow-[0_0_15px_rgba(229,211,179,0.06)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#E5D3B3]">
                      <span className="w-2 h-2 rounded-full bg-[#E5D3B3] animate-pulse" />
                      AFTER (Quantified Google XYZ Formula)
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCopy(rewrittenText, idx)}
                      className={`h-7 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5
                        ${isCopied 
                          ? "bg-[#6EE7B7] text-[#08080A]" 
                          : "bg-[#E5D3B3] hover:bg-[#F0E2C8] text-[#08080A] shadow-[0_0_10px_rgba(229,211,179,0.25)]"
                        }
                      `}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy XYZ
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-[#F5F2EB] font-medium leading-relaxed font-sans pr-1">
                    {rewrittenText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
