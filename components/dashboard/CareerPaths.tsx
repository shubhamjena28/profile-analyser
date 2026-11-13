import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Briefcase } from "lucide-react";

export const CareerPaths = ({ paths }: { paths: any[] }) => {
  if (!paths || paths.length === 0) return null;

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
          <Compass className="w-4 h-4 mr-2" /> Recommended Career Paths
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paths.map((path, i) => (
          <div key={i} className="p-3 rounded-lg bg-[#05070A]/50 border border-white/[0.06] hover:bg-[#05070A]/80 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-white flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                {path.role}
              </h4>
              <span className={`text-xs font-bold ${path.matchPercentage >= 80 ? 'text-emerald-400' : path.matchPercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {path.matchPercentage}% Match
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{path.reasoning}</p>
            {path.missingSkills && path.missingSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[10px] uppercase text-slate-500 mr-1 self-center">Missing:</span>
                {path.missingSkills.map((skill: string, j: number) => (
                  <span key={j} className="text-[10px] bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
