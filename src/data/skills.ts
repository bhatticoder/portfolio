export interface SkillCategory {
  readonly layer: string;
  readonly items: readonly string[];
}

export const skills: readonly SkillCategory[] = [
  {
    layer: "Agents & LLM orchestration",
    items: ["Ollama", "LangChain", "n8n", "Groq API", "Gemini API", "Prompt engineering"],
  },
  {
    layer: "Retrieval & memory",
    items: ["ChromaDB", "BM25", "Semantic embeddings", "Hybrid retrieval"],
  },
  {
    layer: "Perception",
    items: ["PyTorch", "OpenCV", "YOLOv8", "ByteTrack / SORT", "EasyOCR"],
  },
  {
    layer: "Services & data",
    items: ["Python", "FastAPI", "C#", "C++", "SQLite", "WebSockets"],
  },
  {
    layer: "Delivery & infra",
    items: ["Docker", "GitHub Actions", "Vercel"],
  },
  {
    layer: "Interface & immersive",
    items: ["React", "Next.js", "Tailwind CSS", "PyQt6", "Unity"],
  },
] as const;

