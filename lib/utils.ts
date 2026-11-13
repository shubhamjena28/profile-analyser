import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface AnalysisHistory {
  id: string;
  date: string;
  score: number;
  atsScore: number;
  jobMatchScore: number;
  targetObjective: string;
}

export function saveAnalysisHistory(data: any, targetObjective: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem('profileAnalysisHistory');
    let history: AnalysisHistory[] = existing ? JSON.parse(existing) : [];
    
    // Add new entry
    const newEntry: AnalysisHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: data.score || 0,
      atsScore: data.resumeMetrics?.atsScore || 0,
      jobMatchScore: data.resumeMetrics?.jobMatchScore || 0,
      targetObjective
    };
    
    history.push(newEntry);
    
    // Keep only last 10
    if (history.length > 10) {
      history = history.slice(history.length - 10);
    }
    
    localStorage.setItem('profileAnalysisHistory', JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
}

export function getAnalysisHistory(): AnalysisHistory[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = localStorage.getItem('profileAnalysisHistory');
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    return [];
  }
}
