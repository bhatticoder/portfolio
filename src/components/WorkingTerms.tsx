"use client";

import { useState, useRef } from "react";
import { faq } from "@/data/faq";
import { ChevronDown } from "lucide-react";

const termsAtAGlance = [
  { key: "engagement", val: "contract / freelance" },
  { key: "hours", val: "15–30 hrs/week" },
  { key: "timezone", val: "PKT (UTC+5), overlap with GMT and EST/PST" },
  { key: "overlap", val: "14:00–02:00 PKT" },
  { key: "payment", val: "Wise or direct wire transfer" },
  { key: "nda", val: "signed before code or data is shared" },
  { key: "comms", val: "async-first, written weekly status" },
];

export function WorkingTerms() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % faq.length;
      buttonRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + faq.length) % faq.length;
      buttonRefs.current[prev]?.focus();
    }
  };

  return (
    <section id="faq" className="py-20 border-t border-line">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          04 / Terms & FAQ
        </span>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink tracking-tight">
          How a contract with me runs
        </h2>
        <p className="mt-2 text-muted text-base max-w-xl font-sans">
          The practical questions, answered honestly up front.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Terms at a glance */}
        <div className="lg:col-span-5 border border-line bg-surface p-6 sm:p-7 rounded-xl shadow-xs">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
            Terms at a glance
          </h3>
          <div className="font-sans text-sm space-y-3">
            {termsAtAGlance.map((term) => (
              <div
                key={term.key}
                className="grid grid-cols-3 gap-2 py-1.5 border-b border-line/50 last:border-b-0"
              >
                <span className="text-muted font-mono text-xs col-span-1">
                  {term.key}
                </span>
                <span className="text-ink font-medium col-span-2 text-[13px]">
                  {term.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-7 border border-line rounded-xl divide-y divide-line overflow-hidden bg-surface shadow-xs">
          {faq.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="group">
                <button
                  ref={(el) => {
                    buttonRefs.current[idx] = el;
                  }}
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-region-${idx}`}
                  onClick={() => toggleItem(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-paper/40 transition-colors cursor-pointer"
                >
                  <span className="font-medium text-base text-ink font-sans">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>

                <div
                  id={`faq-region-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className={`overflow-hidden transition-[max-height,opacity] duration-150 ease-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 text-[15px] text-muted leading-relaxed font-sans">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
