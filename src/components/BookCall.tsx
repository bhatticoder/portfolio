"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";
import { config } from "@/lib/config";
import { CopyBadge } from "@/components/CopyBadge";

const CalEmbed = dynamic(() => import("@/components/CalEmbed"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-paper">
      <span className="font-mono text-xs text-muted">Loading calendar…</span>
    </div>
  ),
});

export function BookCall() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="book" className="py-20 border-t border-line">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          05 / Scoping call
        </span>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink tracking-tight">
          Tell me the constraint. I&apos;ll tell you if it&apos;s solvable.
        </h2>
        <p className="mt-2 text-muted text-base max-w-xl font-sans">
          30 minutes. You describe the system and the deadline; I reply within
          one business day with scope, risks, and a written estimate.
        </p>
      </div>

      <div
        ref={containerRef}
        className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: What to prepare */}
        <div className="lg:col-span-5 border border-line bg-surface p-6 sm:p-8 rounded-xl shadow-xs">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
            What to prepare
          </h3>
          <ul className="space-y-4 font-sans text-sm text-muted">
            <li className="flex items-start gap-3">
              <span className="text-accent font-serif text-lg font-bold select-none">
                01
              </span>
              <span className="text-ink mt-0.5">
                The system or workflow in one paragraph
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-serif text-lg font-bold select-none">
                02
              </span>
              <span className="text-ink mt-0.5">
                The constraint (latency, cost, compliance, deadline)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-serif text-lg font-bold select-none">
                03
              </span>
              <span className="text-ink mt-0.5">
                What &ldquo;done&rdquo; looks like for you
              </span>
            </li>
          </ul>

          {/* Fallback & Email */}
          <div className="mt-8 pt-6 border-t border-line space-y-4">
            <p className="text-xs text-muted font-mono">Direct email contact:</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-ink">{config.email}</span>
              <CopyBadge value={config.email} label="copy" />
            </div>

            <div>
              <a
                href={`https://cal.com/${config.calLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-xs border border-line bg-paper px-3 py-2 rounded-lg hover:border-ink/40 text-ink transition-colors"
              >
                <span>Open scheduling page ↗</span>
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Cal Embed */}
        <div className="lg:col-span-7 border border-line rounded-xl overflow-hidden bg-surface shadow-xs min-h-[480px]">
          {inView ? (
            <CalEmbed />
          ) : (
            <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-paper">
              <span className="font-mono text-xs text-muted">
                Loading calendar…
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
