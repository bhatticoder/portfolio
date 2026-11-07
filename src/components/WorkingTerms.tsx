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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Terms at a glance */}
      <div className="lg:col-span-5 border border-line bg-panel/50 p-6 rounded-md">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
          Terms at a glance
        </h3>
        <div className="font-mono text-xs space-y-2.5">
          {termsAtAGlance.map((term) => (
            <div
              key={term.key}
              className="grid grid-cols-3 gap-2 py-1 border-b border-line/40 last:border-b-0"
            >
              <span className="text-muted col-span-1">{term.key}</span>
              <span className="text-fg col-span-2">{term.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: FAQ Accordion */}
      <div className="lg:col-span-7 border border-line rounded-md divide-y divide-line overflow-hidden bg-bg">
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
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-panel/50 transition-colors cursor-pointer"
              >
                <span className="font-medium text-sm sm:text-base text-fg">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${
                    isOpen ? "rotate-180 text-fg" : ""
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
                <div className="px-4 sm:px-5 pb-5 text-sm text-muted leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

