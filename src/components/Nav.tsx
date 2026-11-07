"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { config } from "@/lib/config";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavProps {
  onOpenPalette: () => void;
}

export function Nav({ onOpenPalette }: NavProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = ["case-studies", "stack", "terms"];
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 h-12 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <a
          href="#"
          className="font-mono text-sm font-semibold tracking-tight text-fg hover:opacity-80 transition-opacity flex items-center gap-0.5"
        >
          <span>bhatti.dev</span>
          <span className="text-fg animate-[pulse_1s_steps(2,start)_infinite] motion-reduce:hidden">
            ▍
          </span>
        </a>

        {/* Center / Right Links */}
        <nav className="hidden sm:flex items-center gap-6 font-mono text-[13px]">
          <a
            href="#case-studies"
            className={`transition-colors py-1 ${
              activeSection === "case-studies"
                ? "text-fg border-b border-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            Case Studies
          </a>
          <a
            href="#stack"
            className={`transition-colors py-1 ${
              activeSection === "stack"
                ? "text-fg border-b border-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            Stack
          </a>
          <a
            href="#terms"
            className={`transition-colors py-1 ${
              activeSection === "terms"
                ? "text-fg border-b border-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            Terms
          </a>
          <a
            href={`https://cal.com/${config.calLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-fg transition-colors inline-flex items-center gap-1"
          >
            Cal.com ↗
          </a>
        </nav>

        {/* Right: Cmd+K hint / Mobile Menu + Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Cmd+K Button */}
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 border border-line rounded-md text-muted hover:text-fg font-mono text-xs transition-colors cursor-pointer"
            aria-label="Open command palette"
          >
            <span>Search</span>
            <kbd className="border border-line px-1 rounded-xs text-[10px]">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onOpenPalette}
            className="sm:hidden w-8 h-8 inline-flex items-center justify-center border border-line rounded-md text-muted hover:text-fg transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

