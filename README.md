# Profile Analyser — CareerPulse AI Placement & Readiness Suite

An intelligent, production-ready AI Profile & Internship Analyzer engineered with Next.js 14, TypeScript, Tailwind CSS, Google Gemini 2.5/3.x, and an ultra-fast deterministic fallback engine. Styled in an **Obsidian Black (`#08080A`) & Warm Champagne Beige (`#E5D3B3`)** theme.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)

---

## Key Features

1. **Dual-Payload Resume Extraction:**
   - Multi-format ingestion supporting PDF, DOCX, TXT, and direct clipboard text paste.
   - Robust client & server parsing with zero timeout crashes.

2. **Semantic ATS & JD Gap Matrix:**
   - Real-time ATS match scoring against custom Job Descriptions or preset role templates (AI/ML, Full-Stack, Cloud/DevOps, Data Science, Backend).
   - Identifies critical missing keywords, matched technologies, and density gaps.

3. **6-Axis Interactive Competency Radar:**
   - Recharts visual evaluation across *Core CS & DSA*, *AI/ML & Data*, *System Architecture*, *Project Impact*, *Cloud & DevOps*, and *ATS Keyword Density*.

4. **Impact Bullet Rewriter (Google XYZ Formula):**
   - Filters out non-bullet noise and automatically identifies passive resume lines.
   - Transforms bullets into quantifiable statements: *"Accomplished [X] as measured by [Y], by doing [Z]"*.
   - One-click copy with dynamic, context-derived impact badges.

5. **4-Tier Progressive Interview Question Bank:**
   - **Set 1:** Technical Foundations & Resume Verification
   - **Set 2:** Project Architecture & Design Trade-offs
   - **Set 3:** Real-World Debugging & Edge-Case Scenarios
   - **Set 4:** Behavioral & STAR Impact
   - Includes target keywords for recruiters, difficulty tags, and Google-standard model answers.

6. **Prioritized Loophole Remediation Roadmap:**
   - Actionable 30-day chronological action items categorized by severity (*P0 Critical*, *P1 High*, *P2 Medium*).

7. **Zero-Fail Production Architecture:**
   - Multi-model fallback tier (`gemini-3.6-flash` -> `gemini-3.8-flash` -> `gemini-3.5-flash` -> `gemini-3.5-flash-lite`).
   - Built-in heuristic deterministic engine that guarantees 100% uptime during live demos, faculty grading, or recruiter evaluations even if API keys or networks are offline.
   - Deterministic SHA-256 in-memory caching (`<5ms` repeat response time).

8. **Python FastAPI Companion Microservice:**
   - Async parallelized coroutines with `asyncio.gather` and SHA-256 hashing included in `backend_fastapi.py`.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Recharts, Sonner.
- **Backend:** Next.js Serverless Edge/Node Routes, Google GenAI SDK (`@google/genai`).
- **Python Backend (Optional):** FastAPI, Pydantic, Uvicorn, AsyncIO.
- **Styling:** Custom Obsidian Dark (`#08080A`), Champagne Gold (`#E5D3B3`), Emerald (`#6EE7B7`), Rose (`#FDA4AF`).

---

## Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/shubhamjena28/profile-analyser.git
cd profile-analyser
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Environment Setup:
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Add your Google Gemini API key to `.env.local` *(Optional: If left blank, the app runs on the built-in deterministic engine with 100% functionality)*:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Running the Python FastAPI Backend (Optional)

```bash
pip install fastapi uvicorn pydantic
python backend_fastapi.py
```
API Documentation available at: `http://localhost:8000/docs`

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze/route.ts              # Core profile analysis API with caching & fallback
│   │   └── regenerate-questions/route.ts # 4-tier progressive interview bank generator
│   ├── layout.tsx                        # Global theme, font, and toast providers
│   └── page.tsx                          # Main dashboard interface
├── components/
│   ├── dashboard/
│   │   ├── GitHubValidator.tsx           # GitHub signal and repository inspector
│   │   ├── InterviewQuestionBank.tsx     # 4-tier interactive interview bank
│   │   ├── KeywordGapMatrix.tsx          # Keyword density and ATS gaps
│   │   ├── LoopholeRemediation.tsx       # 30-day prioritized action roadmap
│   │   ├── RadarCompetencyChart.tsx      # 6-axis Recharts radar chart
│   │   └── XYZBulletRewriter.tsx         # Google XYZ formula bullet point rewriter
│   └── ui/                               # Modular UI component library
├── lib/
│   ├── deterministicAnalyzer.ts          # Zero-fail heuristic intelligence engine
│   └── types.ts                          # Comprehensive TypeScript contracts
├── backend_fastapi.py                    # Parallelized async FastAPI microservice
└── README.md                             # Documentation
```

---

## License

MIT License. Built for engineering placement candidates and talent acquisition teams.
