"use client";

import { skills, glossary } from "@/data/skills";

export function SkillsMatrix() {
  return (
    <section id="skills" className="py-20 border-t border-line">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          03 / Technical Stack
        </span>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink tracking-tight">
          What I work with
        </h2>
        <p className="mt-2 text-muted text-base max-w-xl font-sans">
          Grouped by operational layer. Hover over technical terms for a
          plain-language explanation.
        </p>
      </div>

      <div className="mt-12 border border-line bg-surface rounded-xl divide-y divide-line overflow-hidden shadow-xs">
        {skills.map((cat) => (
          <div
            key={cat.layer}
            className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
          >
            {/* Left: Layer title and plain description */}
            <div className="md:col-span-5 pr-4">
              <h3 className="font-sans text-base font-semibold text-ink">
                {cat.layer}
              </h3>
              <p className="mt-1 text-sm text-muted font-sans leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Right: Chips in Inter 13px */}
            <div className="md:col-span-7 flex flex-wrap gap-2 items-center">
              {cat.items.map((item) => {
                const tip = glossary[item];

                return (
                  <div
                    key={item}
                    title={tip || undefined}
                    className={`px-3 py-1.5 rounded-lg border border-line bg-paper text-ink font-sans text-[13px] inline-flex items-center gap-1.5 transition-colors ${
                      tip ? "cursor-help hover:border-accent/60" : "hover:border-line/80"
                    }`}
                  >
                    <span>{item}</span>
                    {tip && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60 inline-block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
