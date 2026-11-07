"use client";

import { content } from "@/data/content";
import { config } from "@/lib/config";
import { CopyBadge } from "@/components/CopyBadge";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Copyright */}
        <div className="text-xs text-muted font-mono">{content.footer}</div>

        {/* Right: Contact & Shortcuts */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-muted">{config.email}</span>
            <CopyBadge value={config.email} label="copy" />
          </div>

          <a
            href={config.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-fg inline-flex items-center gap-1 transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          </a>

          <a
            href={config.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-fg inline-flex items-center gap-1 transition-colors"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          </a>

          <span className="hidden md:inline text-muted/60">·</span>

          <span className="hidden md:inline text-muted">Press ⌘K / Ctrl+K</span>
        </div>
      </div>

      {/* Global Shortcut Legend */}
      <div className="mt-6 pt-4 border-t border-line/40 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-muted">
        <span>Shortcuts:</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs">G</kbd> then{" "}
          <kbd className="border border-line px-1 rounded-xs">C</kbd>/
          <kbd className="border border-line px-1 rounded-xs">S</kbd>/
          <kbd className="border border-line px-1 rounded-xs">T</kbd>/
          <kbd className="border border-line px-1 rounded-xs">B</kbd> navigate
        </span>
        <span>·</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs">E</kbd> copy email
        </span>
        <span>·</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs">T</kbd> toggle theme
        </span>
        <span>·</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs">?</kbd> palette
        </span>
      </div>
    </footer>
  );
}

