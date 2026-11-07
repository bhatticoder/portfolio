import { Nav } from "@/components/Nav";
import { CaseStudies } from "@/components/CaseStudies";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Selected Work & Systems — Muhammad Mudassar Bhatti",
  description:
    "Production agentic workflows, computer vision networks, and developer infrastructure built with FastAPI, PyTorch, n8n and React.",
};

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <CaseStudies />
      </main>

      <Footer />
    </div>
  );
}

