"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { caseStudies, CaseStudy } from "@/data/caseStudies";
import { metrics } from "@/data/metrics";
import { ArchDiagram } from "@/components/ArchDiagram";
import { ExternalLink, X, Layers, ArrowRight } from "lucide-react";

interface CaseStudiesProps {
  initialProjects?: CaseStudy[];
  selectedId?: string;
  onSelectId?: (id: string) => void;
  limit?: number;
}

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredViewMode(): "plain" | "engineer" {
  try {
    const val = localStorage.getItem("bhatti_view_mode");
    if (val === "plain" || val === "engineer") return val;
  } catch {
    // Ignore storage errors
  }
  return "plain";
}

export function CaseStudies({
  initialProjects,
  selectedId,
  onSelectId,
  limit,
}: CaseStudiesProps) {
  const persistedMode = useSyncExternalStore<"plain" | "engineer">(
    subscribeStorage,
    getStoredViewMode,
    () => "plain"
  );
  const [viewMode, setViewMode] = useState<"plain" | "engineer">(persistedMode);
  const [projectsList, setProjectsList] = useState<CaseStudy[]>(
    initialProjects || (caseStudies as unknown as CaseStudy[])
  );
  const [detailStudy, setDetailStudy] = useState<CaseStudy | null>(null);
  const [prevSelectedId, setPrevSelectedId] = useState(selectedId);

  // Dynamically load freshest projects from DB
  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync external selection during render
  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    if (selectedId) {
      const match = projectsList.find((c) => c.id === selectedId);
      if (match) {
        setDetailStudy(match);
      }
    }
  }

  const changeViewMode = (mode: "plain" | "engineer") => {
    setViewMode(mode);
    try {
      localStorage.setItem("bhatti_view_mode", mode);
    } catch {
      // Ignore storage errors
    }
  };

  // Handle ESC key to close modal/drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && detailStudy) {
        setDetailStudy(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailStudy]);

  const openDetails = useCallback(
    (cs: CaseStudy) => {
      setDetailStudy(cs);
      if (onSelectId) onSelectId(cs.id);
    },
    [onSelectId]
  );

  const displayedProjects = limit
    ? projectsList.slice(0, limit)
    : projectsList;

  return (
    <div id="work" className="space-y-8">
      {/* Header & Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            01 / Selected Work
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink tracking-tight">
            Real systems deployed for real work
          </h2>
          <p className="mt-2 text-muted text-base max-w-xl font-sans">
            Every project addresses a specific business bottleneck. Choose your
            preferred reading mode below.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="self-start sm:self-auto inline-flex p-1 bg-surface border border-line rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => changeViewMode("plain")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              viewMode === "plain"
                ? "bg-paper text-accent font-semibold shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Plain English
          </button>
          <button
            type="button"
            onClick={() => changeViewMode("engineer")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              viewMode === "engineer"
                ? "bg-paper text-accent font-semibold shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Engineer view
          </button>
        </div>
      </div>

      {/* 2x2 Grid of Large Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayedProjects.map((cs) => {
          return (
            <article
              key={cs.id}
              className="border border-line bg-surface rounded-xl overflow-hidden shadow-xs hover:border-line/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail (16:10 aspect ratio) */}
                <div className="relative aspect-[16/10] bg-paper border-b border-line flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden group">
                  <div className="w-12 h-12 rounded-xl border border-line bg-surface flex items-center justify-center text-muted mb-3 group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="font-serif text-lg text-ink">
                    {cs.title} Demo Screen
                  </div>
                  <span className="mt-1 font-mono text-xs text-muted">
                    Screenshot coming
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-8">
                  {/* Top metadata */}
                  <div className="flex items-center justify-between text-xs text-muted mb-2 font-mono">
                    <span className="uppercase tracking-wider">
                      {cs.tag.split("·")[0].trim()}
                    </span>
                    <span className="text-ok font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ok inline-block" />
                      Production
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <Link href={`/work/${cs.id}`} className="group">
                    <h3 className="font-serif text-2xl sm:text-[28px] text-ink tracking-tight group-hover:text-accent transition-colors">
                      {cs.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted font-sans line-clamp-1">
                    {cs.subtitle}
                  </p>

                  {/* Content based on viewMode */}
                  {viewMode === "plain" ? (
                    /* Plain English 3 Labeled Rows */
                    <div className="mt-6 space-y-4 font-sans text-[15px] border-t border-line/60 pt-5">
                      <div>
                        <div className="text-xs uppercase font-mono text-muted tracking-wider mb-1">
                          The Problem
                        </div>
                        <p className="text-muted leading-relaxed">
                          {cs.plain.problem}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs uppercase font-mono text-muted tracking-wider mb-1">
                          What I built
                        </div>
                        <p className="text-ink leading-relaxed">
                          {cs.plain.built}
                        </p>
                      </div>

                      <div className="p-3 bg-paper border border-line rounded-lg">
                        <div className="text-xs uppercase font-mono text-accent tracking-wider mb-1 font-medium">
                          What you get
                        </div>
                        <p className="text-ink font-medium leading-relaxed">
                          {cs.plain.outcome}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Inline Engineer View */
                    <div className="mt-6 space-y-6 font-sans text-sm border-t border-line/60 pt-5">
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                          System Architecture
                        </h4>
                        <ArchDiagram
                          nodes={cs.engineer.diagram.nodes}
                          edges={cs.engineer.diagram.edges}
                          ariaLabel={cs.engineer.diagram.ariaLabel}
                        />
                      </div>

                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                          Key Trade-offs
                        </h4>
                        <div className="border border-line rounded-lg overflow-hidden text-xs">
                          {cs.engineer.tradeoffs.slice(0, 2).map(([chose, gaveUp], i) => (
                            <div
                              key={i}
                              className="p-2.5 border-b border-line last:border-b-0 bg-paper/50 grid grid-cols-2 gap-2"
                            >
                              <div className="font-medium text-ink">{chose}</div>
                              <div className="text-muted">{gaveUp}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                          Stack
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {cs.engineer.stack.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-0.5 text-xs font-mono bg-paper border border-line rounded-md text-ink"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/40">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/work/${cs.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper border border-line rounded-lg text-xs font-medium text-ink hover:border-ink/40 transition-colors"
                  >
                    <span>Read case study</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>

                  {cs.links.demo ? (
                    <a
                      href={cs.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper border border-line rounded-lg text-xs font-medium text-ink hover:border-ink/40 transition-colors"
                    >
                      <span>Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => openDetails(cs)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-accent hover:underline cursor-pointer"
                >
                  <span>Architecture & Specs →</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Link to see all projects if limit was set */}
      {limit && projectsList.length > limit && (
        <div className="pt-8 text-center border-t border-line/50">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 h-12 bg-surface border border-line rounded-xl text-sm font-medium text-ink hover:bg-paper hover:border-accent/40 transition-all shadow-xs"
          >
            <span>Explore All {projectsList.length} Projects & Systems</span>
            <ArrowRight className="w-4 h-4 text-accent" strokeWidth={1.5} />
          </Link>
        </div>
      )}

      {/* Side Slide-Over Modal for Full Engineer Details */}
      {detailStudy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
          onClick={() => setDetailStudy(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-surface border-l border-line h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl"
          >
            <div>
              {/* Top drawer header */}
              <div className="flex items-start justify-between pb-4 border-b border-line">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {detailStudy.tag}
                  </span>
                  <h3 className="font-serif text-3xl text-ink tracking-tight mt-1">
                    {detailStudy.title}
                  </h3>
                  <p className="text-sm text-muted font-sans mt-0.5">
                    {detailStudy.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailStudy(null)}
                  className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* The Constraint / Problem */}
              <div className="mt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  The Constraint / Problem
                </h4>
                <p className="text-muted text-[15px] leading-relaxed">
                  {detailStudy.engineer.problem}
                </p>
              </div>

              {/* Architecture Diagram */}
              <div className="mt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  System Architecture
                </h4>
                <ArchDiagram
                  nodes={detailStudy.engineer.diagram.nodes}
                  edges={detailStudy.engineer.diagram.edges}
                  ariaLabel={detailStudy.engineer.diagram.ariaLabel}
                />
              </div>

              {/* How it works */}
              <div className="mt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  How It Works
                </h4>
                <ul className="space-y-2">
                  {detailStudy.engineer.how.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-muted"
                    >
                      <span className="text-accent select-none mt-0.5">—</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trade-offs Table */}
              <div className="mt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  Architectural Trade-offs
                </h4>
                <div className="border border-line rounded-lg overflow-hidden text-xs font-sans">
                  <div className="grid grid-cols-2 bg-paper p-2.5 border-b border-line text-muted uppercase font-mono tracking-wider">
                    <div>Chose</div>
                    <div>Gave up</div>
                  </div>
                  {detailStudy.engineer.tradeoffs.map(([chose, gaveUp], i) => (
                    <div
                      key={i}
                      className="grid grid-cols-2 p-2.5 gap-3 border-b border-line last:border-b-0"
                    >
                      <div className="font-medium text-ink">{chose}</div>
                      <div className="text-muted">{gaveUp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="mt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detailStudy.engineer.stack.map((item) => (
                    <span
                      key={item}
                      className="border border-line px-2.5 py-1 text-xs font-mono rounded-md bg-paper text-ink"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benchmark Metrics */}
              <div className="mt-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  Benchmark Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {(metrics[detailStudy.engineer.metricsKey] || []).map((m) => (
                    <div
                      key={m.label}
                      className="border border-line p-3 rounded-lg bg-paper"
                    >
                      <div className="text-[11px] uppercase font-mono text-muted">
                        {m.label}
                      </div>
                      <div className="font-mono text-base font-semibold text-ink mt-1">
                        {m.value ?? (
                          <span
                            title="Benchmark published on request"
                            className="cursor-help text-muted underline decoration-dotted underline-offset-2"
                          >
                            n/a
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Modal CTA */}
            <div className="pt-6 mt-8 border-t border-line flex items-center justify-between">
              <Link
                href={`/work/${detailStudy.id}`}
                className="text-xs text-accent hover:underline font-sans font-medium"
              >
                Open dedicated page ↗
              </Link>
              <button
                type="button"
                onClick={() => setDetailStudy(null)}
                className="px-4 py-2 bg-paper border border-line rounded-lg text-sm font-medium text-ink hover:border-ink/40 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
