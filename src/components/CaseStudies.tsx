"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { caseStudies, CaseStudy } from "@/data/caseStudies";
import { metrics } from "@/data/metrics";
import { ArchDiagram } from "@/components/ArchDiagram";
import { ExternalLink } from "lucide-react";

interface CaseStudiesProps {
  selectedId?: string;
  onSelectId?: (id: string) => void;
}

export function CaseStudies({ selectedId, onSelectId }: CaseStudiesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevSelectedId, setPrevSelectedId] = useState(selectedId);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Synchronize state from prop if changed during render
  if (selectedId !== prevSelectedId) {
    setPrevSelectedId(selectedId);
    if (selectedId) {
      const idx = caseStudies.findIndex((cs) => cs.id === selectedId);
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    }
  }

  // Handle URL hash on mount and hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/#case-studies\/(.+)$/) || hash.match(/#(.+)$/);
      if (match && match[1]) {
        const id = match[1];
        const idx = caseStudies.findIndex((cs) => cs.id === id);
        if (idx !== -1) {
          setActiveIndex(idx);
          if (onSelectId) onSelectId(id);
        }
      }
    };

    const timer = setTimeout(handleHash, 0);
    window.addEventListener("hashchange", handleHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
    };
  }, [onSelectId]);

  const selectTab = useCallback(
    (index: number) => {
      setActiveIndex(index);
      const study = caseStudies[index];
      history.replaceState(null, "", `#case-studies/${study.id}`);
      if (onSelectId) onSelectId(study.id);
    },
    [onSelectId]
  );

  // Keyboard navigation inside section
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= "1" && e.key <= "4") {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < caseStudies.length) {
        e.preventDefault();
        selectTab(idx);
        tabRefs.current[idx]?.focus();
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (activeIndex + 1) % caseStudies.length;
      selectTab(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (activeIndex - 1 + caseStudies.length) % caseStudies.length;
      selectTab(prev);
      tabRefs.current[prev]?.focus();
    }
  };

  const currentStudy: CaseStudy = caseStudies[activeIndex];
  const studyMetrics = metrics[currentStudy.metricsKey] || [];

  return (
    <div
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start focus:outline-none"
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation="vertical"
        className="lg:col-span-4 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 border-b lg:border-b-0 border-line"
      >
        {caseStudies.map((cs, idx) => {
          const isSelected = idx === activeIndex;
          const numStr = `0${idx + 1}`;
          return (
            <button
              key={cs.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${cs.id}`}
              id={`tab-${cs.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(idx)}
              className={`text-left p-3.5 border rounded-sm font-mono transition-colors shrink-0 cursor-pointer ${
                isSelected
                  ? "border-fg bg-panel text-fg"
                  : "border-line bg-transparent text-muted hover:text-fg hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-muted mb-1">
                <span>{numStr}</span>
                <span className="text-[11px] uppercase tracking-wider">
                  {cs.tag.split("·")[0].trim()}
                </span>
              </div>
              <div className="font-sans font-medium text-sm text-fg tracking-tight">
                {cs.title}
              </div>
              <div className="font-mono text-xs text-muted mt-1 line-clamp-1">
                {cs.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        id={`panel-${currentStudy.id}`}
        aria-labelledby={`tab-${currentStudy.id}`}
        className="lg:col-span-8 border border-line bg-panel/30 p-6 sm:p-8 rounded-md transition-opacity duration-150 min-h-[580px]"
      >
        {/* 1. Header row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line pb-4">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-fg">
              {currentStudy.title}
            </h3>
            <p className="font-mono text-xs text-muted mt-1">
              {currentStudy.subtitle} · {currentStudy.tag}
            </p>
          </div>
          <span className="self-start sm:self-auto font-mono text-[11px] uppercase tracking-wider text-ok border border-ok/30 px-2 py-0.5 rounded-sm bg-ok/5">
            Production
          </span>
        </div>

        {/* 2. Problem */}
        <div className="mt-6">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
            The Constraint / Problem
          </h4>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            {currentStudy.problem}
          </p>
        </div>

        {/* 3. System Architecture Diagram */}
        <div className="mt-8">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
            System Architecture
          </h4>
          <ArchDiagram
            nodes={currentStudy.diagram.nodes}
            edges={currentStudy.diagram.edges}
            ariaLabel={currentStudy.diagram.ariaLabel}
          />
        </div>

        {/* 4. How it works */}
        <div className="mt-8">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
            How It Works
          </h4>
          <ul className="space-y-2.5">
            {currentStudy.how.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted"
              >
                <span className="font-mono text-xs text-muted select-none mt-0.5">
                  —
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Trade-offs */}
        <div className="mt-8">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
            Architectural Trade-offs
          </h4>
          <div className="border border-line rounded-sm overflow-hidden font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-panel border-b border-line p-2.5 text-muted uppercase tracking-wider">
              <div>Chose</div>
              <div className="hidden sm:block">Gave up</div>
            </div>
            {currentStudy.tradeoffs.map(([chose, gaveUp], i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-2 p-3 gap-2 border-b border-line last:border-b-0"
              >
                <div className="text-fg font-medium">{chose}</div>
                <div className="text-muted">
                  <span className="sm:hidden text-muted uppercase text-[10px] block mb-0.5">
                    Gave up:{" "}
                  </span>
                  {gaveUp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Stack */}
        <div className="mt-8">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
            Operational Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentStudy.stack.map((item) => (
              <span
                key={item}
                className="border border-line px-2.5 py-1 font-mono text-xs rounded-sm bg-panel text-fg"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 7. Metrics Row */}
        <div className="mt-8 pt-6 border-t border-line">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
            Benchmark Figures
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {studyMetrics.map((m) => (
              <div
                key={m.label}
                className="border border-line p-3 rounded-sm bg-panel/50"
              >
                <div className="font-mono text-[10px] uppercase text-muted tracking-wider line-clamp-1">
                  {m.label}
                </div>
                <div className="font-mono text-sm sm:text-base font-semibold mt-1.5 text-fg">
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

        {/* 8. Links Row */}
        <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center gap-4">
          {currentStudy.links.github ? (
            <a
              href={currentStudy.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs border border-line px-3 py-1.5 rounded-sm hover:border-fg text-fg transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          ) : (
            <span
              className="font-mono text-xs text-muted/60 select-none border border-line/50 px-3 py-1.5 rounded-sm cursor-not-allowed"
              aria-disabled="true"
            >
              Repo available under NDA / on request
            </span>
          )}

          {currentStudy.links.demo ? (
            <a
              href={currentStudy.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs border border-line px-3 py-1.5 rounded-sm hover:border-fg text-fg transition-colors"
            >
              <span>Live demo</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          ) : null}

          {currentStudy.links.writeup ? (
            <a
              href={currentStudy.links.writeup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs border border-line px-3 py-1.5 rounded-sm hover:border-fg text-fg transition-colors"
            >
              <span>Write-up</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
