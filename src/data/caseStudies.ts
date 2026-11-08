import projectsData from "./projects.json";

export interface ArchNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ArchDiagramData {
  ariaLabel: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export interface CaseStudyPlain {
  problem: string;
  built: string;
  outcome: string;
}

export interface CaseStudyEngineer {
  problem: string;
  how: readonly string[];
  tradeoffs: readonly (readonly [string, string])[];
  stack: readonly string[];
  metricsKey: string;
  diagram: ArchDiagramData;
}

export interface CaseStudyLinks {
  github: string | null;
  demo: string | null;
  writeup: string | null;
  video?: string | null;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image?: string | null;
  featured?: boolean;
  plain: CaseStudyPlain;
  engineer: CaseStudyEngineer;
  links: CaseStudyLinks;
}

export const caseStudies: readonly CaseStudy[] = projectsData as unknown as CaseStudy[];
