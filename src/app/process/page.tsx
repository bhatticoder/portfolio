import { Nav } from "@/components/Nav";
import { HowIWork } from "@/components/HowIWork";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Clock, Shield, Laptop, MessageSquare, ArrowRight } from "lucide-react";

export const metadata = {
  title: "How I Work — Muhammad Mudassar Bhatti",
  description:
    "How a contract with Muhammad Mudassar Bhatti runs: 15–30 hrs/week, live UK/US business hours overlap, written weekly deliverables, and full code assignment.",
};

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Process Timeline Section */}
        <HowIWork />

        {/* Detailed Contract Guidelines */}
        <section className="mt-16 pt-12 border-t border-line">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            Working Parameters
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink tracking-tight">
            How we collaborate day-to-day
          </h2>
          <p className="mt-2 text-muted text-base max-w-xl font-sans">
            Built for engineering teams who need senior output without hand-holding.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-surface border border-line rounded-xl shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-paper border border-line flex items-center justify-center text-accent mb-4">
                <Clock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-ink font-sans">
                Full Live Timezone Overlap
              </h3>
              <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                I keep 14:00–02:00 PKT (UTC+5) reserved for client projects. That
                covers full business hours for UK (GMT) and US East & West Coasts
                (EST / PST). Standups, reviews, and incidents happen inside your
                working day.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-xl shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-paper border border-line flex items-center justify-center text-accent mb-4">
                <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-ink font-sans">
                Async-First, Written Updates
              </h3>
              <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                Every Friday you receive a crisp, written status update: what was
                shipped, benchmark measurements, known trade-offs, and what is next.
                No 45-minute meetings to give status reports you could read in 2 minutes.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-xl shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-paper border border-line flex items-center justify-center text-accent mb-4">
                <Shield className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-ink font-sans">
                Strict Privacy & NDAs First
              </h3>
              <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                I sign your standard NDA before touching code, data, or technical
                documents. For regulated domains (medical, financial), sensitive
                identifiers (PII/PHI) are redacted before sending anything to external
                LLMs.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-xl shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-paper border border-line flex items-center justify-center text-accent mb-4">
                <Laptop className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-ink font-sans">
                100% Code Ownership
              </h3>
              <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                You own all intellectual property. Every PR includes clean Git
                history, comprehensive documentation, and setup instructions so any
                engineer on your team can take over seamlessly.
              </p>
            </div>
          </div>

          {/* Scoping Call CTA */}
          <div className="mt-14 p-8 bg-surface border border-accent/30 rounded-2xl text-center">
            <h3 className="font-serif text-3xl text-ink">
              Ready to scope a project?
            </h3>
            <p className="mt-2 text-sm text-muted font-sans max-w-md mx-auto">
              Book a 30-minute introductory call to discuss constraints, deadlines,
              and feasibility.
            </p>
            <div className="mt-5">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 h-11 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 shadow-xs"
              >
                <span>Book a Call</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

