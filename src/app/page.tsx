"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { config } from "@/lib/config";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { HowIWork } from "@/components/HowIWork";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { WorkingTerms } from "@/components/WorkingTerms";
import { BookCall } from "@/components/BookCall";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";

export default function Home() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | undefined>(undefined);
  const { resolvedTheme, setTheme } = useTheme();
  const gPressedRef = useRef(false);
  const gTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(config.email);
      } else {
        const ta = document.createElement("textarea");
        ta.value = config.email;
        ta.style.position = "fixed";
        ta.style.left = "-999999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input / textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsPaletteOpen(true);
        return;
      }

      if (e.key.toLowerCase() === "t" && !gPressedRef.current) {
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        return;
      }

      if (e.key.toLowerCase() === "e" && !gPressedRef.current) {
        e.preventDefault();
        copyEmail();
        return;
      }

      if (e.key.toLowerCase() === "g") {
        gPressedRef.current = true;
        if (gTimerRef.current) clearTimeout(gTimerRef.current);
        gTimerRef.current = setTimeout(() => {
          gPressedRef.current = false;
        }, 1000);
        return;
      }

      if (gPressedRef.current) {
        gPressedRef.current = false;
        if (gTimerRef.current) clearTimeout(gTimerRef.current);

        const key = e.key.toLowerCase();
        if (key === "w" || key === "c") {
          e.preventDefault();
          scrollTo("work");
        } else if (key === "p") {
          e.preventDefault();
          scrollTo("process");
        } else if (key === "s") {
          e.preventDefault();
          scrollTo("skills");
        } else if (key === "f" || key === "t") {
          e.preventDefault();
          scrollTo("faq");
        } else if (key === "b") {
          e.preventDefault();
          scrollTo("book");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gTimerRef.current) clearTimeout(gTimerRef.current);
    };
  }, [resolvedTheme, setTheme, scrollTo, copyEmail]);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:font-sans focus:text-sm focus:rounded-lg focus:outline-none shadow-md"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Nav onOpenPalette={() => setIsPaletteOpen(true)} />

      {/* Main Content */}
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 01: Hero with Photo & Proof Strip */}
        <Hero />

        {/* 02: Selected Work with Plain English / Engineer View Toggle */}
        <CaseStudies
          selectedId={selectedCaseStudyId}
          onSelectId={(id) => setSelectedCaseStudyId(id)}
        />

        {/* 03: How I Work (4-step timeline) */}
        <HowIWork />

        {/* 04: What I Work With (Skills with hover glossary) */}
        <SkillsMatrix />

        {/* 05: Working Terms & FAQ */}
        <WorkingTerms />

        {/* 06: Scoping Call (Cal.com embed) */}
        <BookCall />

        {/* 07: Footer with Easter Egg Terminal Snippet */}
        <Footer />
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenCaseStudy={(id) => {
          setSelectedCaseStudyId(id);
          scrollTo("work");
        }}
      />
    </div>
  );
}
