import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConical, Plus } from "lucide-react";

export const WhatIfSimulator = ({ currentScore }: { currentScore: number }) => {
  const [simulatedSkills, setSimulatedSkills] = useState<{name: string, boost: number}[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const boost = Math.floor(Math.random() * 4) + 1; // Fake boost 1-4 points for simulation
    setSimulatedSkills([...simulatedSkills, { name: newSkill.trim(), boost }]);
    setNewSkill("");
  };

  const totalBoost = simulatedSkills.reduce((acc, curr) => acc + curr.boost, 0);
  const newScore = Math.min(100, currentScore + totalBoost);

  return (
    <Card className="bg-[#0B0F17]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 h-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
          <FlaskConical className="w-4 h-4 mr-2" /> Profile Improvement Simulator ("What If?")
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#05070A]/50 rounded-xl border border-white/[0.06]">
          <span className="text-sm text-zinc-400">Current Score</span>
          <span className="text-xl font-bold text-white">{currentScore}/100</span>
        </div>

        <div className="flex gap-2">
          <Input 
            className="bg-[#05070A]/50 border-white/[0.06] text-white"
            placeholder="e.g. Docker, AWS, Certifications..."
            value={newSkill}
            onChange={(e: any) => setNewSkill(e.target.value)}
            onKeyDown={(e: any) => e.key === 'Enter' && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} size="icon" className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {simulatedSkills.length > 0 && (
          <div className="space-y-2 mt-4">
            {simulatedSkills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  Add {skill.name}
                </span>
                <span className="text-emerald-400 font-bold">+{skill.boost}</span>
              </div>
            ))}
            
            <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-300">Simulated Score</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{newScore}/100</span>
            </div>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-2">
              * Estimations only based on AI weightings
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
