"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, AlertCircle, Star, 
  Code2, ExternalLink, Loader2, Sparkles, ShieldCheck 
} from "lucide-react";
import { toast } from "sonner";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Props {
  claimedSkills?: string[];
  initialUsername?: string;
}

interface RepoData {
  name: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  description: string | null;
}

export const GitHubValidator = ({ claimedSkills = [], initialUsername = "" }: Props) => {
  const [username, setUsername] = useState(initialUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [validatedData, setValidatedData] = useState<{
    reposCount: number;
    totalStars: number;
    topLanguages: string[];
    matchingSkills: string[];
    repos: RepoData[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = username.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!trimmed) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}/repos?sort=updated&per_page=30`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("GitHub user not found");
        } else if (res.status === 403) {
          throw new Error("GitHub API rate limit exceeded. Try again in a few minutes.");
        }
        throw new Error(`GitHub API error: ${res.statusText}`);
      }

      const repos: RepoData[] = await res.json();
      
      // Compute language frequencies
      const langCount: Record<string, number> = {};
      let stars = 0;

      repos.forEach(repo => {
        stars += repo.stargazers_count || 0;
        if (repo.language) {
          langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
      });

      const topLanguages = Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang);

      // Cross-reference with claimed skills
      const claimedLower = claimedSkills.map(s => s.toLowerCase());
      const matchingSkills = topLanguages.filter(lang => 
        claimedLower.some(c => c.includes(lang.toLowerCase()) || lang.toLowerCase().includes(c))
      );

      setValidatedData({
        reposCount: repos.length,
        totalStars: stars,
        topLanguages,
        matchingSkills,
        repos: repos.slice(0, 3)
      });

      toast.success("GitHub Footprint Verified", {
        description: `Retrieved ${repos.length} public repositories.`
      });
    } catch (err: any) {
      setError(err.message || "Failed to verify GitHub footprint");
      toast.error("Verification Failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[rgba(18,18,22,0.78)] backdrop-blur-xl border border-[rgba(229,211,179,0.16)] hover:border-[rgba(229,211,179,0.42)] transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(229,211,179,0.15)] rounded-2xl overflow-hidden mt-6">
      <CardHeader className="border-b border-[rgba(229,211,179,0.08)] bg-gradient-to-r from-transparent via-[rgba(229,211,179,0.03)] to-transparent pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-[#F5F2EB] flex items-center gap-2">
              <GithubIcon className="w-5 h-5 text-[#E5D3B3]" />
              Live GitHub & Portfolio Signal Verification
            </CardTitle>
            <p className="text-xs text-[#A39E93] mt-1">
              Cross-verifies claimed resume proficiencies against actual committed code artifacts to detect resume padding.
            </p>
          </div>
          {validatedData && (
            <Badge className="bg-[#6EE7B7]/10 text-[#6EE7B7] border border-[#6EE7B7]/30 px-3 py-1 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Code Footprint
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <GithubIcon className="w-4 h-4 text-[#A39E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="e.g. torvalds or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#141418] border-[rgba(229,211,179,0.16)] focus:border-[#E5D3B3] text-[#F5F2EB] placeholder:text-[#A39E93]/60 pl-10 h-10 rounded-xl text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="bg-[#E5D3B3] hover:bg-[#F0E2C8] text-[#08080A] font-bold px-5 h-10 rounded-xl transition-all shadow-[0_0_15px_rgba(229,211,179,0.25)] flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Verify Footprint
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="bg-[#181214] border border-[#FDA4AF]/25 text-[#FDA4AF] p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {validatedData && (
          <div className="space-y-4">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#141418] border border-[rgba(229,211,179,0.12)] p-3 rounded-xl">
                <span className="text-[10px] text-[#A39E93] uppercase tracking-wider block">Public Repos</span>
                <span className="text-lg font-mono font-bold text-[#F5F2EB]">{validatedData.reposCount}</span>
              </div>
              <div className="bg-[#141418] border border-[rgba(229,211,179,0.12)] p-3 rounded-xl">
                <span className="text-[10px] text-[#A39E93] uppercase tracking-wider block">Total Stars</span>
                <span className="text-lg font-mono font-bold text-[#FCD34D] flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FCD34D]" /> {validatedData.totalStars}
                </span>
              </div>
              <div className="bg-[#141418] border border-[rgba(229,211,179,0.12)] p-3 rounded-xl">
                <span className="text-[10px] text-[#A39E93] uppercase tracking-wider block">Languages</span>
                <span className="text-lg font-mono font-bold text-[#6EE7B7]">{validatedData.topLanguages.length}</span>
              </div>
              <div className="bg-[#141418] border border-[rgba(229,211,179,0.12)] p-3 rounded-xl">
                <span className="text-[10px] text-[#A39E93] uppercase tracking-wider block">Cross-Verified</span>
                <span className="text-lg font-mono font-bold text-[#E5D3B3]">{validatedData.matchingSkills.length} Verified</span>
              </div>
            </div>

            {/* Language Badges */}
            <div className="bg-[#141418] border border-[rgba(229,211,179,0.1)] p-4 rounded-xl">
              <div className="text-xs font-semibold text-[#E5D3B3] mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Active Commit Languages Detected:
              </div>
              <div className="flex flex-wrap gap-2">
                {validatedData.topLanguages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#E5D3B3]/10 text-[#F5F2EB] border border-[#E5D3B3]/25"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#6EE7B7]" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Pinned Repos */}
            {validatedData.repos.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A39E93]">
                  Recent Code Repositories
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {validatedData.repos.map((repo, i) => (
                    <a
                      key={i}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#141418] border border-white/[0.06] hover:border-[#E5D3B3]/40 p-3 rounded-xl transition-all block group"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#F5F2EB] group-hover:text-[#E5D3B3] mb-1">
                        <span className="truncate">{repo.name}</span>
                        <ExternalLink className="w-3 h-3 text-[#A39E93] group-hover:text-[#E5D3B3]" />
                      </div>
                      <p className="text-[11px] text-[#A39E93] line-clamp-2 mb-2">
                        {repo.description || "No description provided."}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-[#A39E93] font-mono">
                        {repo.language && <span>{repo.language}</span>}
                        <span>★ {repo.stargazers_count}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
