import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Sparkles, AlertCircle } from "lucide-react";

export const ProjectCritique = ({ critiques }: { critiques: any[] }) => {
  if (!critiques || critiques.length === 0) return null;

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl break-words overflow-hidden min-w-0">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
          <Wrench className="w-4 h-4 mr-2" /> Project Quality Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {critiques.map((crit, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#05070A]/50 border border-white/[0.06] relative overflow-hidden min-w-0 break-words">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
            
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-white">{crit.projectName}</h4>
              <div className="w-fit inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-medium text-zinc-500">
                Complexity: <span className={crit.complexityScore >= 75 ? 'text-emerald-400 ml-1' : 'text-amber-400 ml-1'}>{crit.complexityScore}/100</span>
              </div>
            </div>

            <div className="mb-3 p-3 rounded bg-rose-950/20 border border-rose-900/30">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase mb-1">
                <AlertCircle className="w-4 h-4" /> Weakness
              </div>
              <p className="text-sm text-zinc-300">{crit.weakness}</p>
            </div>

            <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/30">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase mb-1">
                <Sparkles className="w-4 h-4" /> Suggested Rewrite
              </div>
              <p className="text-sm text-zinc-300 italic">"{crit.suggestedRewrite}"</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
