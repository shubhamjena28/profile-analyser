import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, ChevronRight } from "lucide-react";

export const LearningRoadmap = ({ roadmap }: { roadmap: any[] }) => {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl break-words overflow-hidden min-w-0">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
          <Map className="w-4 h-4 mr-2" /> Personalized Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {roadmap.map((phase, i) => (
          <div key={i} className="relative pl-6 pb-4 border-l border-white/[0.06] last:border-0 last:pb-0">
            <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <div className="flex justify-between items-start mb-1 gap-2 min-w-0">
              <h4 className="text-sm font-bold text-white break-words min-w-0">{phase.phase}: {phase.title}</h4>
              <Badge variant="outline" className="w-fit inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-medium uppercase border-white/[0.08] text-zinc-400 flex-shrink-0">
                {phase.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {phase.topics.map((topic: string, j: number) => (
                <span key={j} className="w-fit inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-medium bg-slate-800/80 text-indigo-300 rounded-md border border-indigo-500/20">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
