import { Nav } from "@/components/Nav";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "What I Work With (Tech Stack) — Muhammad Mudassar Bhatti",
  description:
    "Core engineering stack: Ollama, LangChain, n8n, ChromaDB, PyTorch, YOLOv8, ByteTrack, FastAPI, Docker, and React.",
};

export default function StackPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <SkillsMatrix />
      </main>

      <Footer />
    </div>
  );
}

