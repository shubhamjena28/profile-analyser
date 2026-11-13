"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Zap, Cpu, Code2 } from "lucide-react";

interface Props {
  result: any;
}

const MetricCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
  <Card className="flex flex-col justify-between h-auto min-h-0 overflow-hidden rounded-2xl bg-[rgba(18,18,22,0.78)] border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] transition-all duration-300 backdrop-blur-xl p-4 group">
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="text-xs font-semibold text-[#A39E93] group-hover:text-[#E5D3B3] transition-colors">{title}</div>
      <div className="p-1.5 rounded-lg bg-[#141418] border border-[rgba(229,211,179,0.12)]">
        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold font-mono tracking-tight text-[#F5F2EB] my-1">{value}</div>
      <span className="text-[10px] text-[#A39E93] leading-tight block truncate">{subtitle}</span>
    </div>
  </Card>
);

export const TopMetrics = ({ result }: Props) => {
  if (!result) return null;

  const atsBreakdown = result.atsBreakdown || {
    impactQuantification: 70,
    technicalStackMatch: 75,
    projectArchitectureDepth: 65,
    formattingReadiness: 85
  };

  return (
    <div className="space-y-4 mb-8">
      {/* 4 ATS Sub-Scores (as specified in Master Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Impact Quantification" 
          value={`${atsBreakdown.impactQuantification}%`}
          icon={Zap}
          color="text-[#FCD34D]"
          subtitle="Metrics, scale, and XYZ formula"
        />
        <MetricCard 
          title="Technical Stack Match" 
          value={`${atsBreakdown.technicalStackMatch}%`}
          icon={Code2}
          color="text-[#6EE7B7]"
          subtitle="Alignment with role requirements"
        />
        <MetricCard 
          title="Project Architecture Depth" 
          value={`${atsBreakdown.projectArchitectureDepth}%`}
          icon={Cpu}
          color="text-[#E5D3B3]"
          subtitle="System design & production signals"
        />
        <MetricCard 
          title="ATS Formatting Readiness" 
          value={`${atsBreakdown.formattingReadiness}%`}
          icon={FileText}
          color={atsBreakdown.formattingReadiness >= 75 ? "text-[#6EE7B7]" : "text-[#FDA4AF]"}
          subtitle="Section hierarchy & scan safety"
        />
      </div>
    </div>
  );
};
