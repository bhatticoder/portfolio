export interface MetricItem {
  label: string;
  value: string | null;
}

export const metrics: Record<string, MetricItem[]> = {
  archerstem: [
    { label: "Core Web Vitals", value: "98/100" },
    { label: "Digital delivery uptime", value: "99.9%" },
  ],
  sciencequick: [
    { label: "Mobile PageSpeed Score", value: "96/100" },
    { label: "Media weight reduction", value: "-68%" },
  ],
  annalsofcuriosity: [
    { label: "Scholarly indexing coverage", value: "100%" },
    { label: "Average server TTFB", value: "<180ms" },
  ],
  fifa: [
    { label: "Event detection accuracy", value: "92%" },
    { label: "Broadcast speech pacing", value: "~2.2 w/s" },
  ],
  scanner3d: [
    { label: "Inference latency (GPU)", value: "<6s" },
    { label: "Export format support", value: "5 formats" },
  ],
  docsentry: [
    { label: "p95 run latency per diff", value: "<2.4s" },
    { label: "false-positive issue rate", value: "<3%" },
  ],
  radiology: [
    { label: "auto-release rate", value: "88%" },
    { label: "escalation rate", value: "12%" },
  ],
  anpr: [
    { label: "end-to-end ms/frame", value: "22ms" },
    { label: "plate read accuracy", value: "94.6%" },
  ],
  pocketdesk: [
    { label: "end-to-end frame latency", value: "<65ms" },
    { label: "sustained FPS", value: "30-60" },
  ],
};
