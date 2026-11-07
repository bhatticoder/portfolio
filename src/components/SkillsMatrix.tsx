"use client";

import { useState, useMemo } from "react";
import { skills } from "@/data/skills";
import { caseStudies } from "@/data/caseStudies";

interface SkillsMatrixProps {
  onSelectCaseStudy?: (id: string) => void;
}

export function SkillsMatrix({ onSelectCaseStudy }: SkillsMatrixProps) {
  const [selectedLayer, setSelectedLayer] = useState<string>("All");

  // Build tech -> { id: string; num: string }[] map
  const techMap = useMemo(() => {
    const map = new Map<string, { id: string; num: string }[]>();

    skills.forEach((cat) => {
      cat.items.forEach((item) => {
        const itemLower = item.toLowerCase();
        const matches: { id: string; num: string }[] = [];

        caseStudies.forEach((cs, idx) => {
          const num = `0${idx + 1}`;
          const hasMatch = cs.stack.some((stackItem) => {
            const sLower = stackItem.toLowerCase();
            return (
              itemLower === sLower ||
              itemLower.includes(sLower) ||
              sLower.includes(itemLower)
            );
          });
          if (hasMatch) {
            matches.push({ id: cs.id, num });
          }
        });

        if (matches.length > 0) {
          map.set(item, matches);
        }
      });
    });

    return map;
  }, []);

  const handleJumpToCaseStudy = (id: string) => {
    if (onSelectCaseStudy) {
      onSelectCaseStudy(id);
    }
    const el = document.getElementById("case-studies");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    history.replaceState(null, "", `#case-studies/${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Filter Row */}
      <div
        role="radiogroup"
        aria-label="Filter skills by operational layer"
        className="flex flex-wrap gap-2 pb-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={selectedLayer === "All"}
          onClick={() => setSelectedLayer("All")}
          className={`px-2.5 py-1 font-mono text-xs border rounded-sm transition-colors cursor-pointer ${
            selectedLayer === "All"
              ? "border-fg bg-panel text-fg"
              : "border-line text-muted hover:text-fg"
          }`}
        >
          All
        </button>
        {skills.map((cat) => {
          const isSelected = selectedLayer === cat.layer;
          return (
            <button
              key={cat.layer}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedLayer(cat.layer)}
              className={`px-2.5 py-1 font-mono text-xs border rounded-sm transition-colors cursor-pointer ${
                isSelected
                  ? "border-fg bg-panel text-fg"
                  : "border-line text-muted hover:text-fg"
              }`}
            >
              {cat.layer}
            </button>
          );
        })}
      </div>

      {/* Grid of Layers */}
      <div className="border border-line rounded-md divide-y divide-line overflow-hidden">
        {skills.map((cat) => {
          const isDimmed = selectedLayer !== "All" && selectedLayer !== cat.layer;

          return (
            <div
              key={cat.layer}
              className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-4 items-center transition-opacity duration-120"
              style={{ opacity: isDimmed ? 0.3 : 1 }}
            >
              {/* Layer label */}
              <div className="md:col-span-4 font-mono text-xs uppercase tracking-wider text-muted font-medium">
                {cat.layer}
              </div>

              {/* Chips */}
              <div className="md:col-span-8 flex flex-wrap gap-2 items-center">
                {cat.items.map((item) => {
                  const matches = techMap.get(item);

                  return (
                    <div
                      key={item}
                      className="border border-line px-2.5 h-7 font-mono text-xs rounded-sm bg-panel inline-flex items-center gap-1.5 hover:border-fg transition-colors"
                    >
                      <span className="text-fg">{item}</span>
                      {matches && matches.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                          {matches.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleJumpToCaseStudy(m.id)}
                              title={`View in Case Study ${m.num}`}
                              className="hover:text-fg underline hover:no-underline cursor-pointer"
                            >
                              {m.num}
                            </button>
                          ))}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

