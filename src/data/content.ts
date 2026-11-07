export const content = {
  name: "Muhammad Mudassar Bhatti",
  handle: "bhatti.dev",
  role: "AI Engineer & Full-Stack Systems Developer",
  hero: {
    eyebrow: "Contract engineer · US / UK business hours",
    h1: "I ship agentic LLM workflows and real-time vision systems that survive production.",
    sub: "Self-healing developer pipelines, multi-model consensus with human fallback, and latency-constrained computer vision. Built with FastAPI, n8n, PyTorch and a bias toward systems you can debug at 3 a.m.",
    ctaPrimary: "Book a scoping call",
    ctaSecondary: "Read the case studies",
  },
  availability: {
    window: "14:00–02:00 PKT",
    covers: "Full overlap with UK (GMT) and US (EST/PST) business hours",
    engagement: "Open for contract work, 15–30 hrs/week",
  },
  terminal: {
    command: "curl -s https://bhatti.dev/hire",
    // Must match the body returned by app/hire/route.ts exactly.
    output: [
      "name:        Muhammad Mudassar Bhatti",
      "role:        AI Engineer & Full-Stack Systems Developer",
      "location:    Pakistan (UTC+5)",
      "overlap:     UK (GMT) + US (EST/PST), full business hours",
      "engagement:  contract, 15-30 hrs/week",
      "stack:       python fastapi langchain n8n chromadb pytorch yolov8 docker",
      "book:        https://cal.com/" + "<NEXT_PUBLIC_CAL_LINK>",
    ],
  },
  sections: {
    caseStudies: { label: "01 / Case studies", title: "Four systems, with the trade-offs left in.", sub: "Each entry lists the problem, the architecture, and what I gave up to get it." },
    demos: { label: "02 / Demos", title: "Walkthroughs", sub: "Short screen recordings. Placeholders until clips are uploaded." },
    stack: { label: "03 / Stack", title: "Skills by operational layer", sub: "Grouped by where they run in a system, not by self-rated percentage." },
    terms: { label: "04 / Working terms", title: "How a contract with me runs.", sub: "The practical questions, answered up front." },
    book: { label: "05 / Scoping call", title: "Tell me the constraint. I'll tell you if it's solvable.", sub: "30 minutes. You describe the system and the deadline; I reply within one business day with scope, risks, and a written estimate." },
  },
  footer: "© Muhammad Mudassar Bhatti. Built with Next.js and Tailwind. No tracking cookies.",
};

