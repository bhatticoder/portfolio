"use client";

import { content } from "@/data/content";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { CopyBadge } from "@/components/CopyBadge";
import { ExternalLink, Terminal } from "lucide-react";

export function Footer() {
  const settings = useSiteSettings();
  const curlCommand = content.terminal.command;

  return (
    <footer className="mt-20 border-t border-line py-16">
      {/* Easter Egg Terminal Snippet in Footer */}
      <div className="mb-12 max-w-xl mx-auto p-4 sm:p-5 bg-surface border border-line rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-line text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
            <span className="font-sans font-medium text-ink">For the curious:</span>
          </div>
          <CopyBadge value={curlCommand} label="copy command" />
        </div>
        <div className="mt-3 font-mono text-xs text-ink/90 flex items-center gap-2">
          <span className="text-muted select-none">$</span>
          <span className="select-all">{curlCommand}</span>
        </div>
        <p className="mt-2 text-[11px] text-muted font-sans">
          Returns my availability, stack, and contract parameters in plain text.
        </p>
      </div>

      {/* Main Footer Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Copyright */}
        <div className="text-sm text-muted font-sans">
          © 2026 {settings.name}. Built with Next.js and Tailwind CSS.
        </div>

        {/* Right: Social & Direct Links */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-sans">
          <div className="flex items-center gap-1.5">
            <span className="text-ink font-mono text-xs">{settings.email}</span>
            <CopyBadge value={settings.email} label="copy" />
          </div>

          {Array.isArray(settings.socials) &&
            settings.socials
              .filter((soc) => soc && soc.url && soc.url.trim())
              .map((soc) => (
                <a
                  key={soc.id || soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink inline-flex items-center gap-1 transition-colors"
                >
                  <span>{soc.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              ))}
        </div>
      </div>

      {/* Global Shortcut Hint */}
      <div className="mt-8 pt-4 border-t border-line/40 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-muted">
        <span>Shortcuts:</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs bg-paper">G</kbd> then{" "}
          <kbd className="border border-line px-1 rounded-xs bg-paper">W</kbd> (work) /{" "}
          <kbd className="border border-line px-1 rounded-xs bg-paper">P</kbd> (process) /{" "}
          <kbd className="border border-line px-1 rounded-xs bg-paper">F</kbd> (faq) /{" "}
          <kbd className="border border-line px-1 rounded-xs bg-paper">B</kbd> (book)
        </span>
        <span>·</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs bg-paper">E</kbd> copy email
        </span>
        <span>·</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs bg-paper">T</kbd> toggle theme
        </span>
        <span>·</span>
        <span>
          <kbd className="border border-line px-1 rounded-xs bg-paper">?</kbd> command palette
        </span>
      </div>
    </footer>
  );
}
