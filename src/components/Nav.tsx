"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavProps {
  onOpenPalette?: () => void;
}

export function Nav({ onOpenPalette }: NavProps = {}) {
  const pathname = usePathname();

  const handleOpenPalette = () => {
    if (onOpenPalette) {
      onOpenPalette();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-line bg-paper/90 backdrop-blur-sm transition-colors">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo (name in serif) */}
        <Link
          href="/"
          className="font-serif text-2xl text-ink hover:text-accent transition-colors flex items-center gap-1.5"
        >
          <span>Muhammad Mudassar Bhatti</span>
        </Link>

        {/* Center / Right Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-[15px] font-medium">
          <Link
            href="/work"
            className={`transition-colors py-1 ${
              pathname.startsWith("/work")
                ? "text-accent font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            Work
          </Link>
          <Link
            href="/process"
            className={`transition-colors py-1 ${
              pathname === "/process"
                ? "text-accent font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            How I work
          </Link>
          <Link
            href="/faq"
            className={`transition-colors py-1 ${
              pathname === "/faq"
                ? "text-accent font-semibold"
                : "text-muted hover:text-ink"
            }`}
          >
            FAQ
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Muhammad_Mudasar_Bhatti_Resume.pdf"
            className="transition-colors py-1 text-muted hover:text-accent font-medium"
          >
            Resume
          </a>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          {/* Resume Download Button */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Muhammad_Mudasar_Bhatti_Resume.pdf"
            className="hidden sm:inline-flex items-center justify-center px-3.5 h-9 border border-line bg-surface text-ink font-sans text-xs font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
            title="Download Resume (PDF)"
          >
            Resume
          </a>

          {/* Primary Accent Button */}
          <Link
            href="/book"
            className="hidden sm:inline-flex items-center justify-center px-4 h-9 bg-accent text-white font-sans text-sm font-medium rounded-lg hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs"
          >
            Book a call
          </Link>

          {/* Secondary Cmd+K / Search button */}
          <button
            type="button"
            onClick={handleOpenPalette}
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
            onClick={handleOpenPalette}
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
