export interface SkillCategory {
  readonly layer: string;
  readonly description: string;
  readonly items: readonly string[];
}

export const glossary: Record<string, string> = {
  BM25: "An industry-standard search algorithm that finds exact word matches and keywords rapidly.",
  ChromaDB: "An AI vector memory database used to retrieve documents based on semantic meaning.",
  n8n: "A visual workflow automation engine that connects APIs, AI models, and human approval steps.",
  YOLOv8: "A high-speed neural network that detects objects and vehicles in live camera frames.",
  "ByteTrack / SORT": "Object tracking algorithms that assign persistent IDs to moving vehicles or objects across video frames.",
  EasyOCR: "An optical text recognition library that extracts printed text and license plate characters from images.",
  TreeSitter: "A fast code-parsing tool that understands programming languages as structured syntax trees.",
  FastAPI: "A high-performance Python framework for building reliable production APIs and services.",
  PyTorch: "The leading deep learning framework for training and deploying computer vision and neural networks.",
  Ollama: "A tool for running private, open-source AI models entirely on local servers without cloud dependence.",
};

export const skills: readonly SkillCategory[] = [
  {
    layer: "Agents & LLM orchestration",
    description: "AI pipelines that follow instructions, evaluate context, and call tools safely.",
    items: ["Ollama", "LangChain", "n8n", "Groq API", "Gemini API", "Prompt engineering"],
  },
  {
    layer: "Retrieval & memory",
    description: "Search architectures that find the exact right document or data point in milliseconds.",
    items: ["ChromaDB", "BM25", "Semantic embeddings", "Hybrid retrieval"],
  },
  {
    layer: "Perception & computer vision",
    description: "Camera and video streams converted into structured event data.",
    items: ["PyTorch", "OpenCV", "YOLOv8", "ByteTrack / SORT", "EasyOCR"],
  },
  {
    layer: "Services & data",
    description: "Robust backends, database pipelines, and real-time streaming connections.",
    items: ["Python", "FastAPI", "C#", "C++", "SQLite", "WebSockets"],
  },
  {
    layer: "Delivery & infra",
    description: "Automated testing, containerized packaging, and predictable cloud hosting.",
    items: ["Docker", "GitHub Actions", "Vercel"],
  },
  {
    layer: "Interface & frontend",
    description: "Clean, responsive web interfaces and dashboards for end users.",
    items: ["React", "Next.js", "Tailwind CSS", "PyQt6", "Unity"],
  },
] as const;
