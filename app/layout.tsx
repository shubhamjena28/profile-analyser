import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CareerPulse: AI Placement & Internship Readiness Analyzer",
  description: "Evaluate candidate profiles against job requirements with 6-axis radar, XYZ rewrites, and loophole roadmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans")}>
      <body className="min-h-screen bg-[#08080A] text-[#F5F2EB] antialiased selection:bg-[#E5D3B3]/30 font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
