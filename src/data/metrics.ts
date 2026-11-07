export interface MetricItem {
  label: string;
  value: string | null;
}

export const metrics: Record<string, MetricItem[]> = {
  docsentry: [
    { label: "p95 run latency per diff", value: null },
    { label: "false-positive issue rate", value: null },
  ],
  radiology: [
    { label: "auto-release rate", value: null },
    { label: "escalation rate", value: null },
  ],
  anpr: [
    { label: "end-to-end ms/frame", value: null },
    { label: "plate read accuracy", value: null },
  ],
  pocketdesk: [
    { label: "end-to-end frame latency", value: null },
    { label: "sustained FPS", value: null },
  ],
};

