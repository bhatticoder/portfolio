"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface DemoItem {
  id: string;
  label: string;
  title: string;
  description: string;
  videoSrc?: string;
}

const demos: readonly DemoItem[] = [
  {
    id: "docsentry",
    label: "docsentry / dashboard",
    title: "DocSentry",
    description: "Diff in, verified issue out. Dashboard of runs and findings.",
  },
  {
    id: "radiology-pipeline",
    label: "radiology / multi-critic-flow",
    title: "Radiology pipeline",
    description:
      "Redaction, parallel critics, consensus gate, human triage queue.",
  },
  {
    id: "edge-cv-anpr",
    label: "anpr / stream-inference",
    title: "ANPR",
    description: "Detection, tracking IDs and plate reads on a live stream.",
  },
  {
    id: "pocketdesk",
    label: "pocketdesk / browser-client",
    title: "PocketDesk",
    description: "A Windows desktop in a browser tab, nothing installed.",
  },
];

export function DemoFrame() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {demos.map((demo) => {
        const isPlaying = activeVideoId === demo.id && !!demo.videoSrc;

        return (
          <div key={demo.id} className="flex flex-col">
            <div className="border border-line rounded-md bg-panel overflow-hidden shadow-xs">
              {/* Top Bar (32px) */}
              <div className="h-8 px-3 border-b border-line flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
                  <span className="ml-2 font-mono text-xs text-muted">
                    {demo.label}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted">
                  00:00 / --:--
                </span>
              </div>

              {/* Body (16:9 aspect-video) */}
              <div className="relative aspect-video bg-zinc-900/5 dark:bg-zinc-100/5 flex flex-col items-center justify-center p-4">
                {isPlaying && demo.videoSrc ? (
                  <iframe
                    src={demo.videoSrc}
                    title={demo.title}
                    loading="lazy"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (demo.videoSrc) {
                        setActiveVideoId(demo.id);
                      }
                    }}
                    className={`flex flex-col items-center justify-center gap-2 group ${
                      demo.videoSrc ? "cursor-pointer" : "cursor-default"
                    }`}
                    aria-disabled={!demo.videoSrc}
                  >
                    <div className="w-12 h-12 rounded-full border border-line flex items-center justify-center bg-bg group-hover:border-fg transition-colors">
                      <Play
                        className="w-5 h-5 ml-0.5 text-muted group-hover:text-fg transition-colors"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted">
                      Walkthrough pending upload
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Description below */}
            <div className="mt-3">
              <h3 className="text-sm font-medium text-fg">{demo.title}</h3>
              <p className="text-xs text-muted mt-0.5">{demo.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

