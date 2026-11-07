"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { content } from "@/data/content";
import { config } from "@/lib/config";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CaseStudies } from "@/components/CaseStudies";
import { DemoFrame } from "@/components/DemoFrame";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { WorkingTerms } from "@/components/WorkingTerms";
import { BookCall } from "@/components/BookCall";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";

export default function Home() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>("docsentry");
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
        if (key === "c") {
          e.preventDefault();
          scrollTo("case-studies");
        } else if (key === "s") {
          e.preventDefault();
          scrollTo("stack");
        } else if (key === "t") {
          e.preventDefault();
          scrollTo("terms");
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
    <div className="min-h-screen bg-bg text-fg">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:bg-fg focus:text-bg focus:font-mono focus:text-xs focus:rounded-sm focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Nav onOpenPalette={() => setIsPaletteOpen(true)} />

      {/* Main Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6">
        <Hero />

        {/* 01 / Case Studies */}
        <Section
          id="case-studies"
          label={content.sections.caseStudies.label}
          title={content.sections.caseStudies.title}
          sub={content.sections.caseStudies.sub}
        >
          <CaseStudies
            selectedId={selectedCaseStudyId}
            onSelectId={(id) => setSelectedCaseStudyId(id)}
          />
        </Section>

        {/* 02 / Demos */}
        <Section
          id="demos"
          label={content.sections.demos.label}
          title={content.sections.demos.title}
          sub={content.sections.demos.sub}
        >
          <DemoFrame />
        </Section>

        {/* 03 / Stack */}
        <Section
          id="stack"
          label={content.sections.stack.label}
          title={content.sections.stack.title}
          sub={content.sections.stack.sub}
        >
          <SkillsMatrix
            onSelectCaseStudy={(id) => setSelectedCaseStudyId(id)}
          />
        </Section>

        {/* 04 / Working Terms */}
        <Section
          id="terms"
          label={content.sections.terms.label}
          title={content.sections.terms.title}
          sub={content.sections.terms.sub}
        >
          <WorkingTerms />
        </Section>

        {/* 05 / Scoping Call */}
        <Section
          id="book"
          label={content.sections.book.label}
          title={content.sections.book.title}
          sub={content.sections.book.sub}
        >
          <BookCall />
        </Section>

        {/* Footer */}
        <Footer />
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenCaseStudy={(id) => setSelectedCaseStudyId(id)}
      />
    </div>
  );
}
