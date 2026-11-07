"use client";

import { content } from "@/data/content";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { TerminalSnippet } from "@/components/TerminalSnippet";

export function Hero() {
  return (
    <section className="pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* Left Column (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <AvailabilityBadge />

          <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted">
            {content.hero.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-balance text-fg">
            {content.hero.h1}
          </h1>

          <p className="mt-5 text-muted text-lg max-w-xl leading-relaxed">
            {content.hero.sub}
          </p>

          {/* CTA Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#book"
              className="inline-flex items-center justify-center px-4 h-9 bg-fg text-bg font-mono text-[13px] font-medium border border-fg rounded-md hover:opacity-90 transition-opacity"
            >
              {content.hero.ctaPrimary}
            </a>
            <a
              href="#case-studies"
              className="inline-flex items-center justify-center px-4 h-9 bg-transparent text-fg font-mono text-[13px] font-medium border border-line rounded-md hover:bg-panel transition-colors"
            >
              {content.hero.ctaSecondary}
            </a>
          </div>

          {/* Stack tokens */}
          <p className="mt-6 font-mono text-xs text-muted">
            Python / FastAPI / LangChain / PyTorch / Docker
          </p>
        </div>

        {/* Right Column (5 cols on lg) */}
        <div className="lg:col-span-5 w-full">
          <TerminalSnippet />
        </div>
      </div>
    </section>
  );
}

