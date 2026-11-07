import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProjects, getProjectById } from "@/lib/projectsDb";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArchDiagram } from "@/components/ArchDiagram";
import { metrics } from "@/data/metrics";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Case Study by Muhammad Mudassar Bhatti`,
    description: project.plain.outcome,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const studyMetrics = metrics[project.engineer.metricsKey] || [];

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb & Back Link */}
        <div className="mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-sans text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>Back to All Work</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="pb-8 border-b border-line">
          <div className="flex items-center gap-2 text-xs font-mono text-muted mb-3 uppercase tracking-wider">
            <span>{project.tag}</span>
            <span className="text-ok font-medium">· Production</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight">
            {project.title}
          </h1>

          <p className="mt-3 text-lg text-muted font-sans max-w-2xl">
            {project.subtitle}
          </p>

          {/* Action Links */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.links.demo ? (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-10 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 transition-opacity shadow-xs"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ) : null}

            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-10 bg-surface border border-line text-ink font-sans text-sm font-medium rounded-xl hover:bg-paper transition-colors"
              >
                <span>View GitHub Code</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 h-10 border border-line bg-surface rounded-xl text-xs font-mono text-muted select-none cursor-not-allowed">
                <ShieldCheck className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span>Code available under NDA / on request</span>
              </span>
            )}

            {project.links.writeup && (
              <a
                href={project.links.writeup}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-10 bg-surface border border-line text-ink font-sans text-sm font-medium rounded-xl hover:bg-paper transition-colors"
              >
                <span>Read Technical Writeup</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            )}

            {project.links.video && (
              <a
                href={project.links.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-10 bg-surface border border-line text-ink font-sans text-sm font-medium rounded-xl hover:bg-paper transition-colors"
              >
                <span>Watch Video Walkthrough</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>

        {/* Project Screenshot / Thumbnail Banner */}
        {project.image && (
          <div className="my-8 rounded-2xl overflow-hidden border border-line bg-surface shadow-xs aspect-[16/9] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 1. Plain English Executive Summary */}
        <section className="my-10 p-6 sm:p-8 bg-surface border border-line rounded-2xl shadow-xs space-y-6">
          <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            Executive Summary · Plain English
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-1">
              The Client Problem
            </h2>
            <p className="text-muted text-base leading-relaxed font-sans">
              {project.plain.problem}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-1">
              What Was Built
            </h2>
            <p className="text-ink text-base leading-relaxed font-sans">
              {project.plain.built}
            </p>
          </div>

          <div className="p-4 bg-paper border border-line rounded-xl">
            <h2 className="text-xs font-mono uppercase tracking-wider text-accent mb-1 font-semibold">
              The Result / Outcome
            </h2>
            <p className="text-ink font-medium text-base leading-relaxed font-sans">
              {project.plain.outcome}
            </p>
          </div>
        </section>

        {/* 2. System Architecture SVG */}
        <section className="my-12">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
            System Architecture
          </h2>
          <ArchDiagram
            nodes={project.engineer.diagram.nodes}
            edges={project.engineer.diagram.edges}
            ariaLabel={project.engineer.diagram.ariaLabel}
          />
        </section>

        {/* 3. How It Works */}
        <section className="my-12">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
            How The Pipeline Operates
          </h2>
          <ul className="space-y-3">
            {project.engineer.how.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[16px] text-muted font-sans"
              >
                <span className="text-accent font-mono text-base select-none mt-0.5">
                  —
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Architectural Trade-offs Table */}
        <section className="my-12">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
            Architectural Trade-offs
          </h2>
          <div className="border border-line bg-surface rounded-xl overflow-hidden shadow-xs text-sm font-sans">
            <div className="grid grid-cols-2 bg-paper p-3 border-b border-line text-muted uppercase font-mono text-xs tracking-wider">
              <div>What We Chose</div>
              <div>What We Gave Up</div>
            </div>
            {project.engineer.tradeoffs.map(([chose, gaveUp], i) => (
              <div
                key={i}
                className="grid grid-cols-2 p-3.5 gap-4 border-b border-line last:border-b-0"
              >
                <div className="font-medium text-ink">{chose}</div>
                <div className="text-muted">{gaveUp}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Stack & Metrics */}
        <section className="my-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.engineer.stack.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 text-xs font-mono bg-surface border border-line rounded-lg text-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
              Benchmark Figures
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {studyMetrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 border border-line bg-surface rounded-xl shadow-xs"
                >
                  <div className="text-[11px] uppercase font-mono text-muted">
                    {m.label}
                  </div>
                  <div className="font-mono text-base font-semibold text-ink mt-1">
                    {m.value ?? (
                      <span
                        title="Benchmark published on request"
                        className="cursor-help text-muted underline decoration-dotted"
                      >
                        n/a
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action Box */}
        <section className="mt-16 p-8 bg-surface border border-accent/30 rounded-2xl shadow-sm text-center">
          <h2 className="font-serif text-3xl text-ink">
            Need a similar system built for your company?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted font-sans max-w-lg mx-auto">
            I help US and UK engineering teams build and deploy reliable AI
            workflows with live timezone overlap.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-6 h-12 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 shadow-xs"
            >
              Book a Free 30-Min Scoping Call
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

