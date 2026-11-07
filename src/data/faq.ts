export interface FaqItem {
  q: string;
  a: string;
}

export const faq: readonly FaqItem[] = [
  {
    q: "What does the time-zone overlap actually look like?",
    a: "I work from Pakistan (UTC+5) and keep 14:00–02:00 PKT free for client work. That covers UK (GMT) business hours and US East and West Coast business hours in full. Standups, reviews and incident calls happen live inside your working day.",
  },
  {
    q: "How many hours per week do you take on?",
    a: "15 to 30 hours per week on a contract basis. If a project needs more, we split it into phases and agree the capacity before the phase begins.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. I sign your NDA before I see code, data or architecture documents. Case studies on this site omit client names and proprietary details for that reason.",
  },
  {
    q: "How do I pay you?",
    a: "Invoiced in USD or GBP. I accept Wise or direct wire transfer. Invoicing is monthly for ongoing work, or per milestone for fixed-scope projects.",
  },
  {
    q: "How do you handle data that includes personal or medical information?",
    a: "Redaction happens before any text is sent to a third-party model, and I design systems so that sensitive fields never leave your boundary. Where policy requires it, I run models locally with Ollama. The radiology pipeline is built on this principle.",
  },
  {
    q: "Who owns the code?",
    a: "You do. Work product is assigned to you on payment, and I document the system so another engineer can take it over.",
  },
  {
    q: "What does a first week look like?",
    a: "Day 1 to 2: read the codebase and write down constraints. Day 3 to 5: ship one small vertical slice behind a flag, plus a written plan with risks, estimates and open questions.",
  },
  {
    q: "What if the model output is wrong?",
    a: "I assume it will be sometimes. I add evaluation sets, confidence gating, and a human fallback path where the cost of a wrong answer is high, and I report error rates on your data rather than benchmark claims.",
  },
] as const;

