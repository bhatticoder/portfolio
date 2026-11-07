# MASTER PROMPT: Portfolio for Muhammad Mudassar Bhatti (AI Engineer & Full-Stack Systems Developer)

You are a senior frontend engineer. Build a production-grade, single-page portfolio in **Next.js (App Router) + TypeScript + Tailwind CSS v4**. Follow this document literally. Every string of copy and every data structure is given below. **Do not invent copy, numbers, logos, testimonials, client names, or Lorem Ipsum.** If a value is missing, render the fallback specified here.

The audience is US/UK B2B decision makers (CTOs, engineering leads, technical founders) hiring a contract engineer for 15 to 30 hrs/week. The site must read like an engineer's lab notebook: dense, precise, fast, and honest.

---

## 0. HARD CONSTRAINTS (violating any of these is a failed build)

**Forbidden visuals**
- No purple, violet, indigo, pink or neon colors anywhere. No gradients on text. No glows, no blurred color blobs, no floating orbs, no particle or canvas backgrounds, no 3D, no glassmorphism, no parallax, no confetti, no emoji in UI chrome.
- No stock illustrations, no avatar-with-sparkles, no "AI brain" imagery.

**Required visuals**
- Monochrome Zinc palette only, plus one functional accent: **emerald-500** used ONLY for status dots ("online", "passing", "copied"). Nothing else gets color.
- 1px razor borders (`border-zinc-800` in dark, `border-zinc-200` in light), radius max `rounded-md` (6px). Most containers use `rounded-none` or `rounded-sm`.
- Typography: **Inter** (prose) and **JetBrains Mono** (metadata, labels, code, numbers, nav items, badges). Load both with `next/font/google`, `display: "swap"`.
- Layout: single column, `max-w-5xl`, generous vertical rhythm (`py-24` sections), 12-col grid inside sections where needed. Hairline dividers between sections.
- Motion: Framer Motion only for *mechanical* micro-interactions: 120 to 180ms, `ease: [0.2, 0, 0, 1]`, opacity and 4px translate only. No springs, no bounce, no scroll-jacking. Respect `prefers-reduced-motion` (disable all transforms).

**Forbidden copy**
- Banned words: synergy, disruptive, passionate, rockstar, ninja, cutting-edge, revolutionary, leverage (as verb), seamless, game-changer, "AI-powered" (as a standalone adjective), "unlock".
- Every claim must be an architecture decision, a trade-off, a constraint, or a business outcome. **No fabricated metrics.** All numeric performance figures come from `data/metrics.ts`; when a value is `null`, render `n/a` in mono text with a `title="Benchmark published on request"` tooltip.

---

## 1. TECH STACK & DEPENDENCIES

```bash
npx create-next-app@latest bhatti-dev --ts --tailwind --app --src-dir --eslint --import-alias "@/*"
npm i framer-motion lucide-react next-themes clsx
npm i @calcom/embed-react
```

- Next.js 15 App Router, React 19, TypeScript strict.
- Tailwind CSS **v4**: CSS-first config, no `tailwind.config.js`.
- `lucide-react` for icons (stroke 1.5, size 16).
- `framer-motion` for micro-interactions.
- `next-themes` for theme toggle (default: `system`, attribute: `class`).
- `@calcom/embed-react` for the booking embed (lazy-loaded, see section 7).
- No other UI libraries. No shadcn, no Radix (write the few primitives yourself).

**Environment variables** (create `.env.example`):
```
NEXT_PUBLIC_SITE_URL=https://bhatti.dev
NEXT_PUBLIC_EMAIL=hello@bhatti.dev
NEXT_PUBLIC_CAL_LINK=bhatti/scoping-call
NEXT_PUBLIC_GITHUB=https://github.com/
```
Treat these as placeholders the owner will replace. Never hardcode them in components; read them from `src/lib/config.ts`.

### `src/app/globals.css`
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "SF Mono", Menlo, monospace;
  --color-bg: #ffffff;
  --color-fg: #09090b;
  --color-muted: #71717a;
  --color-line: #e4e4e7;
  --color-panel: #fafafa;
  --color-ok: #10b981;
}
.dark {
  --color-bg: #09090b;
  --color-fg: #fafafa;
  --color-muted: #a1a1aa;
  --color-line: #27272a;
  --color-panel: #0c0c0f;
}
html { scroll-behavior: smooth; }
body { background: var(--color-bg); color: var(--color-fg); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
::selection { background: var(--color-fg); color: var(--color-bg); }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
```
Use utilities like `bg-bg text-fg border-line text-muted bg-panel` throughout (Tailwind v4 generates them from the `@theme` colors).

---

## 2. FILE TREE

```
src/
  app/
    layout.tsx            // fonts, ThemeProvider, metadata, JSON-LD
    page.tsx              // composes all sections in order
    hire/route.ts         // plain-text response for the curl snippet
    opengraph-image.tsx   // monochrome OG image, text only
  components/
    Nav.tsx
    Hero.tsx
    AvailabilityBadge.tsx
    TerminalSnippet.tsx
    CopyBadge.tsx
    CaseStudies.tsx
    ArchDiagram.tsx
    DemoFrame.tsx
    SkillsMatrix.tsx
    WorkingTerms.tsx
    BookCall.tsx
    CommandPalette.tsx
    ThemeToggle.tsx
    Section.tsx
  data/
    content.ts            // ALL copy lives here
    caseStudies.ts
    skills.ts
    metrics.ts
    faq.ts
  lib/
    config.ts
    cn.ts
```

Section order in `page.tsx`: `Nav` → `Hero` → `CaseStudies` (id `case-studies`) → `DemoFrames` (id `demos`) → `SkillsMatrix` (id `stack`) → `WorkingTerms` (id `terms`) → `BookCall` (id `book`) → footer. Mount `CommandPalette` once at the root.

---

## 3. GLOBAL COPY (`data/content.ts`, use verbatim)

```ts
export const content = {
  name: "Muhammad Mudassar Bhatti",
  handle: "bhatti.dev",
  role: "AI Engineer & Full-Stack Systems Developer",
  hero: {
    eyebrow: "Contract engineer · US / UK business hours",
    h1: "I ship agentic LLM workflows and real-time vision systems that survive production.",
    sub: "Self-healing developer pipelines, multi-model consensus with human fallback, and latency-constrained computer vision. Built with FastAPI, n8n, PyTorch and a bias toward systems you can debug at 3 a.m.",
    ctaPrimary: "Book a scoping call",
    ctaSecondary: "Read the case studies",
  },
  availability: {
    window: "14:00–02:00 PKT",
    covers: "Full overlap with UK (GMT) and US (EST/PST) business hours",
    engagement: "Open for contract work, 15–30 hrs/week",
  },
  terminal: {
    command: "curl -s https://bhatti.dev/hire",
    // Must match the body returned by app/hire/route.ts exactly.
    output: [
      "name:        Muhammad Mudassar Bhatti",
      "role:        AI Engineer & Full-Stack Systems Developer",
      "location:    Pakistan (UTC+5)",
      "overlap:     UK (GMT) + US (EST/PST), full business hours",
      "engagement:  contract, 15-30 hrs/week",
      "stack:       python fastapi langchain n8n chromadb pytorch yolov8 docker",
      "book:        https://cal.com/" + "<NEXT_PUBLIC_CAL_LINK>",
    ],
  },
  sections: {
    caseStudies: { label: "01 / Case studies", title: "Four systems, with the trade-offs left in.", sub: "Each entry lists the problem, the architecture, and what I gave up to get it." },
    demos: { label: "02 / Demos", title: "Walkthroughs", sub: "Short screen recordings. Placeholders until clips are uploaded." },
    stack: { label: "03 / Stack", title: "Skills by operational layer", sub: "Grouped by where they run in a system, not by self-rated percentage." },
    terms: { label: "04 / Working terms", title: "How a contract with me runs.", sub: "The practical questions, answered up front." },
    book: { label: "05 / Scoping call", title: "Tell me the constraint. I'll tell you if it's solvable.", sub: "30 minutes. You describe the system and the deadline; I reply within one business day with scope, risks, and a written estimate." },
  },
  footer: "© Muhammad Mudassar Bhatti. Built with Next.js and Tailwind. No tracking cookies.",
};
```

---

## 4. COMPONENT SPECS

### 4.1 `Nav.tsx` (sticky, minimal)
- `sticky top-0 z-40 h-12 border-b border-line bg-bg/90 backdrop-blur-sm` (blur is for legibility only, no color tint).
- Left: logo as mono text `bhatti.dev` followed by a blinking block cursor `▍` (CSS step animation, 1s, disabled under reduced motion).
- Center/right links (mono, 13px, `text-muted hover:text-fg`): `Case Studies` → `#case-studies`, `Stack` → `#stack`, `Terms` → `#terms`, `Cal.com ↗` → `https://cal.com/${NEXT_PUBLIC_CAL_LINK}` (new tab, `rel="noopener noreferrer"`).
- Right: a `⌘K` hint button (`kbd` styled, hidden on mobile) that opens the CommandPalette, then `ThemeToggle` (Sun/Moon icons, `aria-label="Toggle theme"`).
- Mobile (<640px): show logo, `⌘K` replaced by a `Menu` icon button that opens the command palette (same list), plus theme toggle.
- Active-section highlight: IntersectionObserver sets a 1px underline under the current link.

### 4.2 `Hero.tsx` (above the fold)
Layout (desktop): two columns, 7/5. Mobile: stacked, terminal below CTAs.
Left column, in order:
1. `AvailabilityBadge`
2. mono eyebrow = `hero.eyebrow` (uppercase, tracking-wider, 12px, text-muted)
3. `h1` = `hero.h1` (`text-4xl sm:text-5xl font-semibold tracking-tight`, max 18ch per line feel via `text-balance`)
4. paragraph = `hero.sub` (`text-muted text-lg max-w-xl`)
5. CTA row: primary button (bg-fg text-bg, mono 13px, 36px height, 1px border, `rounded-md`) linking `#book`; secondary ghost button linking `#case-studies`.
6. Under CTAs: a one-line mono row of 5 stack tokens separated by ` / `: `Python / FastAPI / LangChain / PyTorch / Docker`.

Right column: `TerminalSnippet`.

### 4.3 `AvailabilityBadge.tsx`
- Pill: `border border-line rounded-full px-3 h-7 inline-flex items-center gap-2 font-mono text-xs`.
- Contains an emerald 6px dot (static; a 2s opacity pulse 1→0.4 only when currently within working window; none under reduced motion).
- Text, computed client-side with `Intl.DateTimeFormat` using `timeZone: "Asia/Karachi"`:
  - Inside the window: `Online now · {availability.window}`
  - Outside: `Offline · back 14:00 PKT · replies within 1 business day`
- Render the static string `Available · {availability.window}` on the server to avoid hydration mismatch, then swap after mount.
- Tooltip (`title`): `availability.covers`. Second line under badge on desktop: `availability.engagement` in `text-muted` mono 12px.

### 4.4 `TerminalSnippet.tsx`
- Window frame: `border border-line bg-panel rounded-md`, title bar 32px with three 8px **zinc** circles (no red/yellow/green), label `~/hire` mono 12px.
- Body (mono 13px, line-height 1.6): prompt `$ ` (muted) + `terminal.command`, then the `terminal.output` lines. On first view (once), type the command in 400ms total (mechanical, linear), then reveal output lines one by one at 60ms intervals. Under reduced motion, render everything instantly.
- Top-right of the frame: `CopyBadge` that copies the command string only.
- The `<pre>` must remain selectable and screen-reader readable (render full text in `sr-only` if the animation is in progress).

### 4.5 `CopyBadge.tsx`
Props: `{ value: string; label?: string }`. Renders a mono 12px button with `Copy` icon; on click calls `navigator.clipboard.writeText(value)` (with a `textarea` + `execCommand("copy")` fallback in try/catch), swaps to `Check` icon + text `copied` with an emerald check for 1500ms, then reverts. `aria-live="polite"` on the label. Also used for: the email in the footer and each tech token in the Skills Matrix (copying is not needed there; skip those).

### 4.6 `Section.tsx`
Wrapper: `<section id>` with `py-24 border-t border-line`, mono label (`text-xs uppercase tracking-widest text-muted`), `h2` (`text-3xl font-semibold tracking-tight`), sub paragraph (`text-muted max-w-2xl`). Children below with `mt-12`.

---

## 5. CASE STUDIES (`CaseStudies.tsx` + `ArchDiagram.tsx`)

### Interaction
- Desktop: a left vertical tab list (4 items, mono, with index `01`–`04`) and a right panel. Mobile: horizontally scrollable tab strip above the panel.
- Keyboard: `ArrowUp/ArrowDown` (or Left/Right on mobile) move between tabs, roving `tabindex`, `role="tablist"`, `role="tab"`, `role="tabpanel"`. Deep-link by hash (`#case-studies/docsentry`) and update on tab change using `history.replaceState`. Number keys `1` to `4` select a tab when focus is inside the section.
- Panel transition: 150ms opacity cross-fade, no layout shift (fixed min-height).

### Panel anatomy (identical for each study)
1. Header row: title, mono `tag` line, and status chips.
2. **Problem** (one paragraph).
3. **System architecture**: `ArchDiagram` (below).
4. **How it works**: 4 to 5 bullets (`how`).
5. **Trade-offs**: a 2-column table, `Chose` | `Gave up`, hairline rows.
6. **Stack**: mono tokens in 1px-bordered chips.
7. **Metrics** row: reads from `metrics.ts` (see 5.3).
8. Links row: `GitHub`, `Live demo`, `Write-up`. Any link that is `null` renders as disabled text `Repo available under NDA / on request` (no `href`, `aria-disabled="true"`). Do not link to `#`.

### 5.1 `ArchDiagram.tsx` (SVG, data-driven)
Props: `{ nodes: {id: string; label: string; sub?: string; x: number; y: number; w?: number; h?: number}[]; edges: {from: string; to: string; label?: string}[]; ariaLabel: string }`.
- `<svg viewBox="0 0 720 230" role="img" aria-label={ariaLabel} className="w-full h-auto">`.
- Defaults: `w=140`, `h=52`.
- Node: `<rect>` with `fill="var(--color-panel)"`, `stroke="var(--color-line)"`, `rx=4`; label in JetBrains Mono 12px (`fill: var(--color-fg)`), `sub` in 10px (`fill: var(--color-muted)`), both centered.
- Edge routing rule: if `from.x !== to.x`, draw a straight line from the right-middle of the left node to the left-middle of the right node (reverse sides if `from` is to the right). If `from.x === to.x`, draw vertical from bottom-middle to top-middle (or the reverse by sign of dy). End each edge with a small arrow marker (`<marker>` triangle, `fill: var(--color-muted)`). Edge stroke `var(--color-muted)`, width 1. Edge label mono 10px at the midpoint on a `var(--color-bg)` backing rect.
- Hover on a node highlights its connected edges (stroke → `var(--color-fg)`), 120ms. No other animation. Nodes are focusable (`tabindex=0`) and show the same highlight on focus.

### 5.2 Case study data (`data/caseStudies.ts`, use verbatim)

```ts
export const caseStudies = [
  {
    id: "docsentry",
    title: "DocSentry",
    subtitle: "Autonomous documentation-integrity agent",
    tag: "agents · retrieval · CI",
    problem:
      "Code changes faster than the docs that describe it. Reviewers don't catch the drift, and stale docs become support tickets. DocSentry reads each change as structure, finds the docs it affects, and either files a verified issue or proposes the fix.",
    how: [
      "Parses git diffs into Tree-sitter ASTs so changes are reasoned about as functions, signatures and exports, not raw text lines.",
      "Retrieves candidate documentation with hybrid search: BM25 for exact identifiers and flags, dense embeddings (ChromaDB) for paraphrased descriptions.",
      "Validates doc-vs-code consistency with a multi-model evaluator across Groq, Gemini and a local Ollama model.",
      "Opens a GitHub issue or a self-healing fix PR only after the finding has been self-verified.",
      "Ships an interactive static/React monitoring dashboard for runs, findings and outcomes.",
    ],
    tradeoffs: [
      ["AST-level diffing over line diffs", "Needs a grammar per language; unsupported languages fall back to coarse chunks"],
      ["Hybrid retrieval over embeddings alone", "A second index to maintain and a score-fusion step to tune"],
      ["Multiple model providers with a local fallback", "More orchestration code; verdicts need an agreement policy"],
      ["Self-verification before opening issues", "Extra model calls per finding, traded for fewer false-positive issues"],
    ],
    stack: ["Python", "Tree-sitter", "BM25", "ChromaDB", "Groq", "Gemini", "Ollama", "GitHub Actions", "React"],
    metricsKey: "docsentry",
    links: { github: null, demo: null, writeup: null },
    diagram: {
      ariaLabel: "DocSentry pipeline: git diff to AST parse, hybrid retrieval, multi-model evaluation, self-verification, then GitHub issue or fix PR and a dashboard.",
      nodes: [
        { id: "diff", label: "Git diff", sub: "PR / push", x: 20, y: 30 },
        { id: "ast", label: "Tree-sitter AST", sub: "symbol-level changes", x: 200, y: 30 },
        { id: "ret", label: "Hybrid retrieval", sub: "BM25 + dense vectors", x: 380, y: 30 },
        { id: "eval", label: "Multi-model eval", sub: "Groq / Gemini / Ollama", x: 560, y: 30 },
        { id: "ver", label: "Self-verification", sub: "re-check before acting", x: 560, y: 150 },
        { id: "act", label: "Issue or fix PR", sub: "GitHub API", x: 380, y: 150 },
        { id: "dash", label: "Dashboard", sub: "React, runs + findings", x: 200, y: 150 },
      ],
      edges: [
        { from: "diff", to: "ast" }, { from: "ast", to: "ret" }, { from: "ret", to: "eval" },
        { from: "eval", to: "ver" }, { from: "ver", to: "act" }, { from: "act", to: "dash" },
      ],
    },
  },
  {
    id: "radiology-pipeline",
    title: "Multi-Agent Radiology & Document Pipeline",
    subtitle: "Consensus with a human fallback",
    tag: "n8n · multi-LLM · safety",
    problem:
      "A single LLM reading a clinical document can state something false with full confidence. In this setting, a wrong answer is worse than a slow one. The pipeline treats disagreement as a signal and routes it to a person.",
    how: [
      "Orchestrated in n8n so every node, branch and retry is visible and auditable.",
      "Redacts PII/PHI before any text reaches a model.",
      "Runs parallel specialist critique nodes over the same input to surface unsupported claims.",
      "Computes a consensus score across models; below the strict threshold the case is routed to manual human-in-the-loop triage instead of auto-completing.",
    ],
    tradeoffs: [
      ["Redaction before inference", "Some context is lost, which can reduce model accuracy on edge cases"],
      ["Multiple critics in parallel", "Higher cost and token usage per document"],
      ["Strict consensus threshold", "More cases land in the human queue; throughput is tuned against safety"],
      ["n8n orchestration", "Less flexible than custom code for complex branching, in exchange for visibility"],
    ],
    stack: ["n8n", "Multi-LLM APIs", "PII/PHI redaction", "Prompt engineering", "Human-in-the-loop"],
    metricsKey: "radiology",
    links: { github: null, demo: null, writeup: null },
    diagram: {
      ariaLabel: "Radiology pipeline: intake, PII/PHI redaction, three parallel specialist critics, a consensus gate that either releases a structured report or routes to human triage.",
      nodes: [
        { id: "in", label: "Intake", sub: "document / report", x: 20, y: 90 },
        { id: "red", label: "PII/PHI redaction", sub: "before any model call", x: 200, y: 90 },
        { id: "c1", label: "Critic A", sub: "specialist prompt", x: 380, y: 10 },
        { id: "c2", label: "Critic B", sub: "specialist prompt", x: 380, y: 90 },
        { id: "c3", label: "Critic C", sub: "specialist prompt", x: 380, y: 170 },
        { id: "gate", label: "Consensus gate", sub: "strict threshold", x: 560, y: 90 },
        { id: "rep", label: "Structured report", sub: "consensus met", x: 560, y: 10 },
        { id: "hitl", label: "Human triage", sub: "consensus below threshold", x: 560, y: 170 },
      ],
      edges: [
        { from: "in", to: "red" }, { from: "red", to: "c1" }, { from: "red", to: "c2" }, { from: "red", to: "c3" },
        { from: "c1", to: "gate" }, { from: "c2", to: "gate" }, { from: "c3", to: "gate" },
        { from: "gate", to: "rep", label: "pass" }, { from: "gate", to: "hitl", label: "fail" },
      ],
    },
  },
  {
    id: "edge-cv-anpr",
    title: "Real-Time Edge Computer Vision Pipeline",
    subtitle: "ANPR and multi-object tracking",
    tag: "pytorch · yolov8 · latency",
    problem:
      "Reading plates from a live video stream on constrained hardware means you cannot run every model on every frame. The pipeline spends compute only where it changes the answer.",
    how: [
      "YOLOv8 localizes vehicles and plates on the incoming stream.",
      "SORT / ByteTrack assigns persistent track IDs so each vehicle is read as one entity, not once per frame.",
      "EasyOCR reads the plate crop; custom regex and character-correction post-processing fixes common confusions (for example 0/O, 1/I, 5/S) against the expected plate format.",
      "Frame-skipping heuristics cap per-frame cost for latency-constrained environments.",
    ],
    tradeoffs: [
      ["Frame skipping", "Fast-moving vehicles may be sampled less often; tuned per camera"],
      ["Tracking before OCR", "Added tracker state, in exchange for OCR once per vehicle and consistent IDs"],
      ["Rule-based correction after OCR", "Rules are tied to a plate format and need per-region maintenance"],
      ["Off-the-shelf OCR (EasyOCR)", "Lower ceiling than a plate-specific trained model, much faster to deploy"],
    ],
    stack: ["PyTorch", "YOLOv8", "OpenCV", "ByteTrack / SORT", "EasyOCR", "Python"],
    metricsKey: "anpr",
    links: { github: null, demo: null, writeup: null },
    diagram: {
      ariaLabel: "ANPR pipeline: video stream, frame skipper, YOLOv8 detection, tracker, OCR, character correction and per-track plate output.",
      nodes: [
        { id: "vid", label: "Video stream", sub: "RTSP / file", x: 20, y: 30 },
        { id: "skip", label: "Frame skipper", sub: "latency heuristics", x: 200, y: 30 },
        { id: "yolo", label: "YOLOv8", sub: "vehicle + plate boxes", x: 380, y: 30 },
        { id: "trk", label: "SORT / ByteTrack", sub: "persistent track IDs", x: 560, y: 30 },
        { id: "ocr", label: "EasyOCR", sub: "plate crop to text", x: 560, y: 150 },
        { id: "fix", label: "Char correction", sub: "regex + format rules", x: 380, y: 150 },
        { id: "out", label: "Plate per track", sub: "final read", x: 200, y: 150 },
      ],
      edges: [
        { from: "vid", to: "skip" }, { from: "skip", to: "yolo" }, { from: "yolo", to: "trk" },
        { from: "trk", to: "ocr" }, { from: "ocr", to: "fix" }, { from: "fix", to: "out" },
      ],
    },
  },
  {
    id: "pocketdesk",
    title: "PocketDesk",
    subtitle: "Browser-based desktop streamer",
    tag: "c# · win32 · websockets",
    problem:
      "Remote desktop usually means installing a client on the viewing side. PocketDesk streams a Windows desktop to any browser with nothing to install on the viewer's machine.",
    how: [
      "A C# host captures the screen through Win32 GDI.",
      "A Node.js service relays frames over WebSockets.",
      "The browser is the entire client: zero install on the viewing side.",
    ],
    tradeoffs: [
      ["Win32 GDI capture", "Simple and widely compatible, but not the lowest-overhead capture path available on Windows"],
      ["WebSockets over WebRTC", "Simpler to deploy and debug, without WebRTC's adaptive transport"],
      ["Browser-only client", "Limited to what the browser can render and send"],
    ],
    stack: ["C#", "Win32 GDI", "Node.js", "WebSockets"],
    metricsKey: "pocketdesk",
    links: { github: null, demo: null, writeup: null },
    diagram: {
      ariaLabel: "PocketDesk: a C# Win32 GDI capture host streams to a Node.js WebSocket relay, which serves a browser viewer.",
      nodes: [
        { id: "cap", label: "Capture host", sub: "C# · Win32 GDI", x: 40, y: 80, w: 190 },
        { id: "rel", label: "WebSocket relay", sub: "Node.js", x: 265, y: 80, w: 190 },
        { id: "br", label: "Browser viewer", sub: "zero install", x: 490, y: 80, w: 190 },
      ],
      edges: [{ from: "cap", to: "rel", label: "frames" }, { from: "rel", to: "br", label: "WebSocket" }],
    },
  },
] as const;
```

### 5.3 Metrics (`data/metrics.ts`)
```ts
export const metrics: Record<string, { label: string; value: string | null }[]> = {
  docsentry:  [{ label: "p95 run latency per diff", value: null }, { label: "false-positive issue rate", value: null }],
  radiology:  [{ label: "auto-release rate", value: null }, { label: "escalation rate", value: null }],
  anpr:       [{ label: "end-to-end ms/frame", value: null }, { label: "plate read accuracy", value: null }],
  pocketdesk: [{ label: "end-to-end frame latency", value: null }, { label: "sustained FPS", value: null }],
};
```
Render each as a mono cell: label (muted, 11px uppercase) over value (16px). `null` → `n/a` + tooltip as defined in section 0. The owner fills these with measured values later; never guess them.

---

## 6. DEMO FRAMES (`DemoFrame.tsx`, Loom-style mockups)

A 2x2 grid (1 column on mobile) with one frame per case study. Each frame:
- Outer: `border border-line rounded-md bg-panel overflow-hidden`, 16:9 `aspect-video` body.
- Top bar (32px): three zinc dots, URL-style label in mono (e.g. `docsentry / dashboard`), and a right-aligned `00:00 / --:--` timestamp.
- Body: a flat zinc placeholder (`bg-zinc-900/5 dark:bg-zinc-100/5`) with a centered 48px circular play button (1px border, `Play` icon). Under it, mono caption `Walkthrough pending upload`.
- A `videoSrc?: string` prop. When provided, clicking the play button swaps in an `<iframe>` (`loading="lazy"`, `allowFullScreen`, `title`) pointing to that URL (Loom or YouTube embed URL). When absent, clicking does nothing except focus the caption (`aria-disabled="true"`).
- Below each frame: title (14px, medium) and one-line description in muted text:
  - DocSentry: `Diff in, verified issue out. Dashboard of runs and findings.`
  - Radiology pipeline: `Redaction, parallel critics, consensus gate, human triage queue.`
  - ANPR: `Detection, tracking IDs and plate reads on a live stream.`
  - PocketDesk: `A Windows desktop in a browser tab, nothing installed.`

---

## 7. SKILLS MATRIX (`SkillsMatrix.tsx` + `data/skills.ts`)

No percentage bars, no star ratings. Organize by **operational layer**, as a table-like grid with a mono layer label at left and chips at right.

```ts
export const skills = [
  { layer: "Agents & LLM orchestration", items: ["Ollama", "LangChain", "n8n", "Groq API", "Gemini API", "Prompt engineering"] },
  { layer: "Retrieval & memory", items: ["ChromaDB", "BM25", "Semantic embeddings", "Hybrid retrieval"] },
  { layer: "Perception", items: ["PyTorch", "OpenCV", "YOLOv8", "ByteTrack / SORT", "EasyOCR"] },
  { layer: "Services & data", items: ["Python", "FastAPI", "C#", "C++", "SQLite", "WebSockets"] },
  { layer: "Delivery & infra", items: ["Docker", "GitHub Actions", "Vercel"] },
  { layer: "Interface & immersive", items: ["React", "Next.js", "Tailwind CSS", "PyQt6", "Unity"] },
] as const;
```

Interactions:
- A filter row of mono toggles: `All` plus each layer name. Selecting one dims others to 30% opacity (opacity only, 120ms). Keyboard accessible (`role="radiogroup"`).
- Hovering or focusing a chip highlights the case studies that use it: build a `tech → caseStudy.id[]` map from `caseStudies[].stack` (case-insensitive match; ignore items with no match), and show the matching case-study numbers `01 02` as a mono superscript next to the chip. Clicking the superscript jumps to that case study (`#case-studies/{id}`).
- Chips: `border border-line px-2 h-7 font-mono text-xs rounded-sm`.

---

## 8. CLIENT WORKING TERMS & FAQ (`WorkingTerms.tsx` + `data/faq.ts`)

Layout: left column shows a compact "terms at a glance" mono key-value block; right column is the FAQ accordion (built from scratch with `<button aria-expanded>` and `<div role="region">`, height animation 150ms, one open at a time, `Enter/Space` toggles, arrow keys move between questions).

**At a glance** (verbatim):
```
engagement     contract / freelance
hours          15–30 hrs/week
timezone       PKT (UTC+5), overlap with GMT and EST/PST
overlap        14:00–02:00 PKT
payment        Wise or direct wire transfer
nda            signed before code or data is shared
comms          async-first, written weekly status
```

**FAQ** (verbatim, in this order):
```ts
export const faq = [
  { q: "What does the time-zone overlap actually look like?",
    a: "I work from Pakistan (UTC+5) and keep 14:00–02:00 PKT free for client work. That covers UK (GMT) business hours and US East and West Coast business hours in full. Standups, reviews and incident calls happen live inside your working day." },
  { q: "How many hours per week do you take on?",
    a: "15 to 30 hours per week on a contract basis. If a project needs more, we split it into phases and agree the capacity before the phase begins." },
  { q: "Do you sign NDAs?",
    a: "Yes. I sign your NDA before I see code, data or architecture documents. Case studies on this site omit client names and proprietary details for that reason." },
  { q: "How do I pay you?",
    a: "Invoiced in USD or GBP. I accept Wise or direct wire transfer. Invoicing is monthly for ongoing work, or per milestone for fixed-scope projects." },
  { q: "How do you handle data that includes personal or medical information?",
    a: "Redaction happens before any text is sent to a third-party model, and I design systems so that sensitive fields never leave your boundary. Where policy requires it, I run models locally with Ollama. The radiology pipeline is built on this principle." },
  { q: "Who owns the code?",
    a: "You do. Work product is assigned to you on payment, and I document the system so another engineer can take it over." },
  { q: "What does a first week look like?",
    a: "Day 1 to 2: read the codebase and write down constraints. Day 3 to 5: ship one small vertical slice behind a flag, plus a written plan with risks, estimates and open questions." },
  { q: "What if the model output is wrong?",
    a: "I assume it will be sometimes. I add evaluation sets, confidence gating, and a human fallback path where the cost of a wrong answer is high, and I report error rates on your data rather than benchmark claims." },
] as const;
```

---

## 9. BOOK A SCOPING CALL (`BookCall.tsx`) + FOOTER

- Section header from `content.sections.book`.
- Two-column layout: left, three mono "what to prepare" lines:
  `01  the system or workflow in one paragraph`
  `02  the constraint (latency, cost, compliance, deadline)`
  `03  what "done" looks like for you`
- Right: Cal.com inline embed in a bordered frame, **lazy-loaded** (`next/dynamic`, `ssr: false`) only when the section enters the viewport (IntersectionObserver, rootMargin 200px). Until then show a skeleton frame with the same dimensions and a mono caption `Loading calendar…`.
```tsx
import Cal, { getCalApi } from "@calcom/embed-react";
// useEffect: (async () => { const cal = await getCalApi(); cal("ui", { theme: resolvedTheme === "dark" ? "dark" : "light", hideEventTypeDetails: false, layout: "month_view" }); })();
<Cal calLink={process.env.NEXT_PUBLIC_CAL_LINK!} style={{ width: "100%", height: "100%", overflow: "scroll" }} config={{ layout: "month_view" }} />
```
- If the embed fails or JS is disabled, show a plain fallback link button: `Open scheduling page ↗` → `https://cal.com/${NEXT_PUBLIC_CAL_LINK}`, plus the email with a `CopyBadge`.
- **Footer**: hairline top border; left: `content.footer`; right: email (mono) + `CopyBadge`, GitHub link, and a mono keyboard hint `Press ⌘K / Ctrl+K`.

---

## 10. INTERACTIVE POLISH

### 10.1 `CommandPalette.tsx` (`Cmd/Ctrl+K`)
- Opens on `Cmd+K` / `Ctrl+K` and via the Nav button; closes on `Esc` or outside click. Focus trap, `role="dialog"`, `aria-modal`, returns focus to the trigger.
- Centered 560px panel, `border border-line bg-bg rounded-md`, backdrop `bg-black/40` (no blur).
- Search input (mono) filters a flat list. Arrow keys move, `Enter` runs. Group labels in muted mono.
- Commands:
  - Navigate: `Case studies`, `Demos`, `Stack`, `Working terms`, `Book a scoping call`
  - Case studies: `Open DocSentry`, `Open Radiology pipeline`, `Open ANPR pipeline`, `Open PocketDesk`
  - Actions: `Copy email`, `Copy curl command`, `Open Cal.com ↗`, `Toggle theme`, `Open GitHub ↗`
- Each row shows its single-key hint on the right where applicable.

### 10.2 Global shortcuts (ignore when focus is in an input, textarea or contenteditable)
`g` then `c` → case studies, `g` then `s` → stack, `g` then `t` → terms, `g` then `b` → book, `e` → copy email, `t` → toggle theme, `?` → open the palette. Show a one-time mono hint in the footer, not a toast or modal.

### 10.3 Responsive
- Breakpoints: 360, 640, 1024. Verify at 360px: no horizontal scroll, tap targets at least 40px, the SVG diagrams scale (`w-full h-auto`) and remain legible (minimum 10px text at 360px; if not, render the diagram inside an `overflow-x-auto` wrapper with `min-w-[640px]`).
- The terminal snippet wraps long lines (`whitespace-pre-wrap break-words`).

### 10.4 Theme
Default `system`; no flash on load (`next-themes` with `suppressHydrationWarning` on `<html>`). Both themes must pass WCAG AA contrast.

---

## 11. `/hire` ROUTE (makes the curl command real)

`src/app/hire/route.ts`:
```ts
import { content } from "@/data/content";
export const dynamic = "force-static";
export function GET() {
  const cal = process.env.NEXT_PUBLIC_CAL_LINK ?? "";
  const lines = content.terminal.output.map(l => l.replace("<NEXT_PUBLIC_CAL_LINK>", cal));
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
```
The `book:` line in the terminal UI must show the same fully resolved URL.

---

## 12. SEO, A11Y, PERFORMANCE

- `metadata`: title `Muhammad Mudassar Bhatti — AI Engineer & Full-Stack Systems Developer`; description = `hero.sub` truncated to 155 chars at a word boundary; `openGraph` and `twitter` (summary_large_image); canonical from `NEXT_PUBLIC_SITE_URL`.
- JSON-LD `Person` (name, jobTitle, url, `knowsAbout` from the skills list). No fabricated sameAs links; include GitHub only if the env var is set.
- OG image: text only, zinc background, mono name and role. No decorative graphics.
- A11y: skip-to-content link, visible focus ring (`outline-2 outline-offset-2 outline-fg`), landmarks (`header`, `main`, `footer`), all interactive elements keyboard reachable, all SVGs with titles, no information conveyed by color alone.
- Performance: Lighthouse targets 95+ on all four categories (mobile). No client component unless required (`"use client"` only on Nav, Hero parts with animation, CaseStudies, SkillsMatrix, WorkingTerms, BookCall, CommandPalette, CopyBadge). No images; icons only. Total JS excluding the lazy Cal embed under 150 kB gzipped.

---

## 13. ACCEPTANCE CHECKLIST (verify before finishing)

- [ ] No purple/neon, no glows, no orbs, no particles, no gradients, no emoji in UI.
- [ ] Only Zinc neutrals plus emerald status dots.
- [ ] Inter + JetBrains Mono load via `next/font`.
- [ ] All copy comes from `data/*.ts` exactly as given; no Lorem Ipsum or invented stats.
- [ ] `null` metrics render `n/a`; `null` links render a disabled state, never `href="#"`.
- [ ] `curl -s https://bhatti.dev/hire` output on the page matches `/hire` route output.
- [ ] Hero shows availability badge, h1, sub, CTAs and the terminal snippet above the fold at 1440x900 and 390x844.
- [ ] Case study tabs work with mouse, keyboard, number keys and deep links; each has a rendered SVG diagram.
- [ ] Skills matrix is grouped by layer with no percentage bars.
- [ ] FAQ accordion is accessible and uses the verbatim copy.
- [ ] Cal.com embed lazy-loads, with a plain-link fallback.
- [ ] `Cmd/Ctrl+K` palette, copy-email, copy-command and theme shortcuts work.
- [ ] `prefers-reduced-motion` disables all motion.
- [ ] `npm run build` and `npm run lint` pass with zero errors.

When finished, output only: a file tree of what you created, the list of environment variables the owner must set, and the list of `null` values (links and metrics) the owner must fill in.
