"use client";

import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavProps {
  onOpenPalette: () => void;
}

export function Nav({ onOpenPalette }: NavProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = ["work", "process", "faq", "book"];
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
    <header className="sticky top-0 z-40 h-16 border-b border-line bg-paper/90 backdrop-blur-sm transition-colors">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo (name in serif) */}
        <a
          href="#"
          className="font-serif text-2xl text-ink hover:text-accent transition-colors flex items-center gap-1.5"
        >
          <span>Muhammad Mudassar Bhatti</span>
        </a>

        {/* Center / Right Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-[15px] font-medium">
          <a
            href="#work"
            className={`transition-colors py-1 ${
              activeSection === "work"
                ? "text-accent font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            Work
          </a>
          <a
            href="#process"
            className={`transition-colors py-1 ${
              activeSection === "process"
                ? "text-accent font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            How I work
          </a>
          <a
            href="#faq"
            className={`transition-colors py-1 ${
              activeSection === "faq"
                ? "text-accent font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          {/* Primary Accent Button */}
          <a
            href="#book"
            className="hidden sm:inline-flex items-center justify-center px-4 h-9 bg-accent text-white font-sans text-sm font-medium rounded-lg hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs"
          >
            Book a call
          </a>

          {/* Secondary Cmd+K / Search button */}
          <button
            type="button"
            onClick={onOpenPalette}
            className="w-9 h-9 inline-flex items-center justify-center border border-line rounded-lg text-muted hover:text-ink hover:border-ink/20 transition-colors cursor-pointer"
            aria-label="Search or run commands"
            title="Search (⌘K)"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle className="w-9 h-9 rounded-lg" />

          {/* Mobile menu link */}
          <button
            type="button"
            onClick={onOpenPalette}
            className="md:hidden w-9 h-9 inline-flex items-center justify-center border border-line rounded-lg text-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
