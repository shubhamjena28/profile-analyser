"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, ShieldAlert, Sparkles, 
  HelpCircle, RotateCcw, ListFilter, Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type NavSectionId = "overview-radar" | "loophole-roadmap" | "bullet-rewriter" | "interview-prep";
export type ViewMode = "scroll" | "tabs";

interface WorkspaceNavBarProps {
  activeSection: NavSectionId;
  onSelectSection: (id: NavSectionId) => void;
  loopholeCount?: number;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onReset: () => void;
}

export const WorkspaceNavBar = ({
  activeSection,
  onSelectSection,
  loopholeCount = 0,
  viewMode,
  onToggleViewMode,
  onReset
}: WorkspaceNavBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      id: "overview-radar" as NavSectionId,
      label: "Overview & Radar",
      icon: LayoutDashboard,
      shortcut: "1"
    },
    {
      id: "loophole-roadmap" as NavSectionId,
      label: "Loophole Roadmap",
      icon: ShieldAlert,
      badge: loopholeCount > 0 ? loopholeCount : undefined,
      shortcut: "2"
    },
    {
      id: "bullet-rewriter" as NavSectionId,
      label: "XYZ Bullet Rewriter",
      icon: Sparkles,
      shortcut: "3"
    },
    {
      id: "interview-prep" as NavSectionId,
      label: "Interview Prep",
      icon: HelpCircle,
      shortcut: "4"
    }
  ];

  // Keyboard navigation: Alt + 1..4 or Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.altKey && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const item = navItems.find((n) => n.shortcut === e.key);
        if (item) {
          onSelectSection(item.id);
        }
      } else if (
        e.key === "ArrowRight" &&
        containerRef.current?.contains(document.activeElement)
      ) {
        e.preventDefault();
        const currentIndex = navItems.findIndex((n) => n.id === activeSection);
        const nextIndex = (currentIndex + 1) % navItems.length;
        onSelectSection(navItems[nextIndex].id);
      } else if (
        e.key === "ArrowLeft" &&
        containerRef.current?.contains(document.activeElement)
      ) {
        e.preventDefault();
        const currentIndex = navItems.findIndex((n) => n.id === activeSection);
        const prevIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        onSelectSection(navItems[prevIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, onSelectSection]);

  return (
    <div className="sticky top-4 z-50 w-full mb-6 px-1">
      <div 
        ref={containerRef}
        className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-[rgba(14,14,18,0.78)] backdrop-blur-[18px] border border-[rgba(229,211,179,0.18)] shadow-[0_16px_36px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(229,211,179,0.15)] transition-all duration-300"
      >
        {/* Navigation Pills with Sliding Indicator */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-[#E5D3B3]
                  ${isActive 
                    ? "text-[#E5D3B3]" 
                    : "text-[#A39E93] hover:text-[#F5F2EB] hover:bg-[rgba(229,211,179,0.05)]"
                  }
                `}
                title={`Alt + ${item.shortcut}`}
              >
                {/* Sliding active pill background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                      mass: 0.8
                    }}
                    className="absolute inset-0 rounded-xl bg-[rgba(229,211,179,0.14)] border border-[rgba(229,211,179,0.45)] shadow-[0_0_16px_rgba(229,211,179,0.18)]"
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <Badge 
                      className={`h-4 min-w-[16px] px-1 text-[10px] font-mono font-bold rounded-full flex items-center justify-center border transition-all ${
                        isActive
                          ? "bg-[#E5D3B3] text-[#08080A] border-[#E5D3B3]"
                          : "bg-[rgba(229,211,179,0.12)] text-[#E5D3B3] border-[rgba(229,211,179,0.25)]"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* View-Mode Switcher & Reset Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0 pr-1">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#121216] border border-[rgba(229,211,179,0.14)]">
            <button
              onClick={() => onToggleViewMode("scroll")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                viewMode === "scroll"
                  ? "bg-[rgba(229,211,179,0.18)] text-[#E5D3B3] font-semibold shadow-sm"
                  : "text-[#A39E93] hover:text-[#F5F2EB]"
              }`}
              title="Continuous smooth scrolling with scroll-spy"
            >
              <ListFilter className="w-3 h-3" />
              <span className="hidden sm:inline">Full Scroll</span>
            </button>
            <button
              onClick={() => onToggleViewMode("tabs")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                viewMode === "tabs"
                  ? "bg-[rgba(229,211,179,0.18)] text-[#E5D3B3] font-semibold shadow-sm"
                  : "text-[#A39E93] hover:text-[#F5F2EB]"
              }`}
              title="Focused single-section tab workspace"
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Focused Tabs</span>
            </button>
          </div>

          {/* New Upload / Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A39E93] hover:text-[#F5F2EB] bg-[#141418] hover:bg-[rgba(229,211,179,0.1)] border border-[rgba(229,211,179,0.14)] hover:border-[rgba(229,211,179,0.3)] transition-all shadow-sm"
            title="Start a new analysis or upload a different resume"
          >
            <RotateCcw className="w-3 h-3 text-[#E5D3B3]" />
            <span className="hidden sm:inline">New Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};
