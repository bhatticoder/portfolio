"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";
import { config } from "@/lib/config";
import { CopyBadge } from "@/components/CopyBadge";

const CalEmbed = dynamic(() => import("@/components/CalEmbed"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-panel">
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
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      {/* Left Column: What to prepare */}
      <div className="lg:col-span-5 border border-line bg-panel/40 p-6 rounded-md">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
          What to prepare
        </h3>
        <ul className="space-y-4 font-mono text-xs text-muted">
          <li className="flex items-start gap-3">
            <span className="text-fg font-semibold select-none">01</span>
            <span className="text-fg">
              the system or workflow in one paragraph
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-fg font-semibold select-none">02</span>
            <span className="text-fg">
              the constraint (latency, cost, compliance, deadline)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-fg font-semibold select-none">03</span>
            <span className="text-fg">what &ldquo;done&rdquo; looks like for you</span>
          </li>
        </ul>

        {/* Fallback & Email */}
        <div className="mt-8 pt-6 border-t border-line space-y-4">
          <p className="font-mono text-xs text-muted">Direct contact:</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-fg">{config.email}</span>
            <CopyBadge value={config.email} label="copy" />
          </div>

          <div>
            <a
              href={`https://cal.com/${config.calLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs border border-line px-3 py-1.5 rounded-sm hover:border-fg text-fg transition-colors"
            >
              <span>Open scheduling page ↗</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Cal Embed */}
      <div className="lg:col-span-7 border border-line rounded-md overflow-hidden bg-bg min-h-[480px]">
        {inView ? (
          <CalEmbed />
        ) : (
          <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-panel">
            <span className="font-mono text-xs text-muted">
              Loading calendar…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

