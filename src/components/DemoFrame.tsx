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
    id: "fifa",
    label: "fifa / realtime-commentary",
    title: "Automated FIFA Commentary",
    description:
      "Real-time ball & player tracking (YOLOv8) with GPT-4o Vision event classification and synchronized broadcast audio commentary.",
    videoSrc: "/videos/fifa-commentary.mp4",
  },
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
                  {demo.videoSrc ? (
                    <span className="text-accent font-medium">Ready · Video</span>
                  ) : (
                    "00:00 / --:--"
                  )}
                </span>
              </div>

              {/* Body (16:9 aspect-video) */}
              <div className="relative aspect-video bg-zinc-900/5 dark:bg-zinc-100/5 flex flex-col items-center justify-center p-0 overflow-hidden">
                {isPlaying && demo.videoSrc ? (
                  demo.videoSrc.endsWith(".mp4") ? (
                    <video
                      src={demo.videoSrc}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <iframe
                      src={demo.videoSrc}
                      title={demo.title}
                      loading="lazy"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (demo.videoSrc) {
                        setActiveVideoId(demo.id);
                      }
                    }}
                    className={`w-full h-full flex flex-col items-center justify-center gap-2 p-4 group transition-all ${
                      demo.videoSrc
                        ? "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                        : "cursor-default"
                    }`}
                    aria-disabled={!demo.videoSrc}
                  >
                    <div
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-xs ${
                        demo.videoSrc
                          ? "border-accent bg-accent/10 text-accent group-hover:scale-105 group-hover:bg-accent group-hover:text-white"
                          : "border-line bg-bg text-muted group-hover:border-fg group-hover:text-fg"
                      }`}
                    >
                      <Play
                        className="w-5 h-5 ml-0.5 fill-current"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span
                      className={`font-mono text-xs ${
                        demo.videoSrc
                          ? "text-accent font-medium group-hover:underline"
                          : "text-muted"
                      }`}
                    >
                      {demo.videoSrc
                        ? "Click to play commentary walkthrough"
                        : "Walkthrough pending upload"}
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

