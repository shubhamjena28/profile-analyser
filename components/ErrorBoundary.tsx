"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 w-full">
          <div className="bg-[#121216]/90 backdrop-blur-xl border border-[#E5D3B3]/25 p-8 rounded-2xl max-w-lg w-full text-center shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(229,211,179,0.15)]">
            <div className="w-14 h-14 rounded-full bg-[#E5D3B3]/10 border border-[#E5D3B3]/30 flex items-center justify-center mx-auto mb-5 text-[#E5D3B3]">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-bold text-[#F5F2EB] mb-2">Display State Interrupted</h3>
            <p className="text-sm text-[#A39E93] mb-6 leading-relaxed">
              An unexpected render issue occurred while rendering the visualization. Your saved history is intact.
            </p>

            <Button
              onClick={this.handleReset}
              className="bg-[#E5D3B3] hover:bg-[#F0E2C8] text-[#08080A] font-bold px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(229,211,179,0.35)] transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Analyzer
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
