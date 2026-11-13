"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { RadarMetric } from "@/lib/types";
import { Compass } from "lucide-react";

interface RadarChartProps {
  metrics: RadarMetric[];
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#121216] border border-[rgba(229,211,179,0.3)] p-3 rounded-xl shadow-2xl text-xs text-[#F5F2EB]">
        <div className="font-bold text-[#E5D3B3] mb-1">{data.subject}</div>
        <div className="flex items-center gap-2">
          <span className="text-[#A39E93]">Competency Score:</span>
          <span className="font-mono font-bold text-[#F5F2EB]">{data.score} / {data.fullMark}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const RadarCompetencyChart = ({ metrics }: RadarChartProps) => {
  const chartData = metrics && metrics.length > 0 ? metrics : [
    { subject: "Core CS & DSA", score: 65, fullMark: 100 },
    { subject: "AI/ML & Data", score: 70, fullMark: 100 },
    { subject: "System Architecture", score: 60, fullMark: 100 },
    { subject: "Project Impact", score: 75, fullMark: 100 },
    { subject: "Cloud & DevOps", score: 55, fullMark: 100 },
    { subject: "ATS Keyword Density", score: 80, fullMark: 100 }
  ];

  return (
    <Card className="bg-[rgba(18,18,22,0.78)] backdrop-blur-xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-2 border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-wide text-[#E5D3B3] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#E5D3B3]" />
            6-Axis Competency Radar
          </CardTitle>
          <span className="text-[11px] font-mono text-[#A39E93] bg-[#141418] px-2 py-0.5 rounded-md border border-[rgba(229,211,179,0.1)]">
            Normalized 0-100
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6 h-[320px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(229, 211, 179, 0.15)" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#E5D3B3', fontSize: 11, fontWeight: 500 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={false} 
              axisLine={false} 
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Radar
              name="Readiness Profile"
              dataKey="score"
              stroke="#E5D3B3"
              strokeWidth={2}
              fill="#E5D3B3"
              fillOpacity={0.28}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
