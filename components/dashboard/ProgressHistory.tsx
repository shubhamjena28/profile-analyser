import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalysisHistory, AnalysisHistory } from '@/lib/utils';
import { History } from "lucide-react";

export const ProgressHistory = () => {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  if (history.length < 2) return null;

  const data = history.map(h => ({
    name: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: h.score,
    ats: h.atsScore,
  }));

  const improvement = history[history.length - 1].score - history[0].score;

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl break-words overflow-hidden min-w-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
          <History className="w-4 h-4 mr-2" /> Profile Evolution
        </CardTitle>
        <div className={`w-fit inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded ${improvement >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
          {improvement > 0 ? '+' : ''}{improvement} pts
        </div>
      </CardHeader>
      <CardContent className="h-auto min-h-[250px] p-4 sm:p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#05070A', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} name="Profile Score" />
            <Line type="monotone" dataKey="ats" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="ATS Score" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
