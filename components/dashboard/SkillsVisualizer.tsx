import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const SkillsVisualizer = ({ breakdown }: { breakdown: any }) => {
  if (!breakdown) return null;

  const data = [
    { subject: 'Core', A: breakdown.coreCompetencies, fullMark: 25 },
    { subject: 'Frameworks', A: breakdown.domainFrameworks, fullMark: 25 },
    { subject: 'Complexity', A: breakdown.projectComplexity, fullMark: 35 },
    { subject: 'Fundamentals', A: breakdown.academicsFundamentals, fullMark: 15 },
  ];

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl break-words overflow-hidden min-w-0">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-400">Skill Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-auto min-h-[300px] p-4 sm:p-5">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
            <Radar name="Skills" dataKey="A" stroke="#818cf8" fill="#6366f1" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
