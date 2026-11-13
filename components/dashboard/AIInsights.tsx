import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react";

export const AIInsights = ({ insights }: { insights: any }) => {
  if (!insights) return null;

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl break-words overflow-hidden min-w-0">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-400">AI Profile Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-5">
        <div>
          <h4 className="flex items-center text-sm font-semibold text-emerald-400 mb-2">
            <ThumbsUp className="w-4 h-4 mr-2" /> Strengths
          </h4>
          <ul className="space-y-1">
            {insights.strengths.map((str: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start break-words min-w-0">
                <span className="text-emerald-500 mr-2 flex-shrink-0">•</span>
                <span className="min-w-0 break-words">{str}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center text-sm font-semibold text-rose-400 mb-2">
            <AlertTriangle className="w-4 h-4 mr-2" /> Weaknesses
          </h4>
          <ul className="space-y-1">
            {insights.weaknesses.map((wk: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start break-words min-w-0">
                <span className="text-rose-500 mr-2 flex-shrink-0">•</span>
                <span className="min-w-0 break-words">{wk}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center text-sm font-semibold text-amber-400 mb-2">
            <Lightbulb className="w-4 h-4 mr-2" /> Recommendations
          </h4>
          <ul className="space-y-1">
            {insights.recommendations.map((rec: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start break-words min-w-0">
                <span className="text-amber-500 mr-2 flex-shrink-0">•</span>
                <span className="min-w-0 break-words">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
