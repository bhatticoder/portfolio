"use client";

import { useState, useEffect, useCallback } from "react";
import { CaseStudy } from "@/data/caseStudies";
import { Lock, Plus, Trash2, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<CaseStudy | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    tag: "",
    plainProblem: "",
    plainBuilt: "",
    plainOutcome: "",
    engineerProblem: "",
    engineerHow: "",
    engineerTradeoffs: "",
    engineerStack: "",
    metricsKey: "",
    githubLink: "",
    demoLink: "",
  });

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("bhatti_admin_key", adminKey);
        loadProjects();
      } else {
        setAuthError("Incorrect admin PIN/key. Check .env.local (default: bhatti2026)");
      }
    } catch {
      setAuthError("Failed to authenticate. Server error.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = sessionStorage.getItem("bhatti_admin_key");
      if (saved) {
        setAdminKey(saved);
        setIsAuthenticated(true);
        loadProjects();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProjects]);

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingProject(null);
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      tag: "",
      plainProblem: "",
      plainBuilt: "",
      plainOutcome: "",
      engineerProblem: "",
      engineerHow: "",
      engineerTradeoffs: "",
      engineerStack: "",
      metricsKey: "",
      githubLink: "",
      demoLink: "",
    });
  };

  const handleStartEdit = (p: CaseStudy) => {
    setEditingProject(p);
    setIsCreatingNew(false);
    setFormData({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      tag: p.tag,
      plainProblem: p.plain.problem,
      plainBuilt: p.plain.built,
      plainOutcome: p.plain.outcome,
      engineerProblem: p.engineer.problem,
      engineerHow: p.engineer.how.join("\n"),
      engineerTradeoffs: p.engineer.tradeoffs
        .map(([c, g]) => `${c} | ${g}`)
        .join("\n"),
      engineerStack: p.engineer.stack.join(", "),
      metricsKey: p.engineer.metricsKey || p.id,
      githubLink: p.links.github || "",
      demoLink: p.links.demo || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete "${id}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (res.ok) {
        loadProjects();
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      alert("Error deleting project: " + String(err));
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");

    const parsedHow = formData.engineerHow
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedTradeoffs = formData.engineerTradeoffs
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|").map((s) => s.trim());
        return [parts[0] || "", parts[1] || ""] as [string, string];
      });

    const parsedStack = formData.engineerStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const projectPayload: CaseStudy = {
      id: formData.id.trim().toLowerCase().replace(/\s+/g, "-"),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      tag: formData.tag.trim(),
      plain: {
        problem: formData.plainProblem.trim(),
        built: formData.plainBuilt.trim(),
        outcome: formData.plainOutcome.trim(),
      },
      engineer: {
        problem: formData.engineerProblem.trim() || formData.plainProblem.trim(),
        how: parsedHow.length > 0 ? parsedHow : [formData.plainBuilt.trim()],
        tradeoffs: parsedTradeoffs,
        stack: parsedStack,
        metricsKey: formData.metricsKey.trim() || formData.id.trim(),
        diagram: editingProject?.engineer.diagram || {
          ariaLabel: `${formData.title} pipeline`,
          nodes: [
            { id: "in", label: "Input", sub: "intake stream", x: 40, y: 80, w: 180 },
            { id: "proc", label: "AI Engine", sub: "model inference", x: 270, y: 80, w: 180 },
            { id: "out", label: "Outcome", sub: "verified output", x: 500, y: 80, w: 180 },
          ],
          edges: [
            { from: "in", to: "proc" },
            { from: "proc", to: "out" },
          ],
        },
      },
      links: {
        github: formData.githubLink.trim() || null,
        demo: formData.demoLink.trim() || null,
        writeup: null,
      },
    };

    try {
      const isEdit = !isCreatingNew && !!editingProject;
      const res = await fetch("/api/admin/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(projectPayload),
      });

      if (res.ok) {
        setSaveStatus("Saved successfully!");
        setEditingProject(null);
        setIsCreatingNew(false);
        loadProjects();
        setTimeout(() => setSaveStatus(""), 2000);
      } else {
        const data = await res.json();
        setSaveStatus(`Error: ${data.error || "Save failed"}`);
      }
    } catch (err) {
      setSaveStatus("Error saving: " + String(err));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface border border-line rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-paper border border-line flex items-center justify-center text-accent mx-auto mb-4">
            <Lock className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl text-ink">Bhatti CMS Login</h1>
          <p className="text-sm text-muted mt-2 font-sans">
            Manage and publish projects without changing any code or spending AI tokens.
          </p>

          <form onSubmit={handleLogin} className="mt-6 text-left">
            <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
              Admin PIN / Secret
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter PIN (e.g. bhatti2026)"
              className="w-full px-4 py-3 bg-paper border border-line rounded-xl text-ink text-sm focus:outline-none focus:border-accent"
              autoFocus
            />

            {authError && (
              <p className="text-xs text-red-500 mt-2 font-sans">{authError}</p>
            )}

            <button
              type="submit"
              className="mt-5 w-full h-11 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-xs"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-line text-xs text-muted font-sans">
            <Link href="/" className="hover:text-ink underline">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 border-b border-line bg-surface/90 backdrop-blur-sm px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-serif text-xl text-ink hover:text-accent transition-colors flex items-center gap-1.5"
          >
            <span>Muhammad Mudassar Bhatti</span>
          </Link>
          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-sm bg-accent/10 text-accent font-medium">
            CMS Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-sans text-muted hover:text-ink flex items-center gap-1"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("bhatti_admin_key");
              setIsAuthenticated(false);
            }}
            className="text-xs font-sans text-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main CMS Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink">
              Project Showcase Management
            </h1>
            <p className="mt-1 text-sm text-muted font-sans">
              Add new client work, edit plain-language summaries, or update engineering details.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-5 h-11 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Editor Form Modal / Section */}
        {(isCreatingNew || editingProject) && (
          <div className="mt-8 p-6 sm:p-8 bg-surface border border-accent/40 rounded-2xl shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
              <h2 className="font-serif text-2xl text-ink">
                {isCreatingNew ? "Create New Project" : `Edit Project: ${formData.title}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingProject(null);
                }}
                className="text-xs font-sans text-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-6">
              {/* Identity Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    Project Slug / ID (e.g. docsentry)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isCreatingNew}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper border border-line rounded-lg text-sm text-ink disabled:opacity-60 font-mono"
                    placeholder="e.g. autonomous-rag"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper border border-line rounded-lg text-sm text-ink font-sans"
                    placeholder="e.g. Autonomous RAG Assistant"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    Tag Line
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-paper border border-line rounded-lg text-sm text-ink font-mono"
                    placeholder="agents · retrieval · CI"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  One-Line Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-paper border border-line rounded-lg text-sm text-ink font-sans"
                  placeholder="e.g. Autonomous research paper synthesis with local LLMs"
                />
              </div>

              {/* Plain English Group */}
              <div className="p-5 border border-line bg-paper/50 rounded-xl space-y-4">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold block">
                  Plain English Section (For Non-Technical Clients & CEOs)
                </span>

                <div>
                  <label className="block text-xs font-sans text-muted mb-1">
                    Problem (2 plain sentences explaining client bottleneck):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.plainProblem}
                    onChange={(e) => setFormData({ ...formData, plainProblem: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-sans"
                    placeholder="When software changes, the instructions that describe it quietly go out of date..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-muted mb-1">
                    What I built (2 sentences explaining what the system does):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.plainBuilt}
                    onChange={(e) => setFormData({ ...formData, plainBuilt: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-sans"
                    placeholder="DocSentry watches every code change, finds the documentation affected..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-muted mb-1">
                    What you get / Business Outcome (1 sentence):
                  </label>
                  <input
                    type="text"
                    value={formData.plainOutcome}
                    onChange={(e) => setFormData({ ...formData, plainOutcome: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-sans"
                    placeholder="Documentation that stays correct without someone checking it by hand."
                  />
                </div>
              </div>

              {/* Technical Engineer Group */}
              <div className="p-5 border border-line bg-paper/50 rounded-xl space-y-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold block">
                  Engineer Section (For CTOs & Technical Leads)
                </span>

                <div>
                  <label className="block text-xs font-sans text-muted mb-1">
                    Technical Problem / Constraint:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.engineerProblem}
                    onChange={(e) => setFormData({ ...formData, engineerProblem: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans text-muted mb-1">
                      How It Works (1 bullet per line):
                    </label>
                    <textarea
                      rows={4}
                      value={formData.engineerHow}
                      onChange={(e) => setFormData({ ...formData, engineerHow: e.target.value })}
                      className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-mono text-xs"
                      placeholder="Parses git diffs into Tree-sitter ASTs&#10;Retrieves docs with BM25..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-muted mb-1">
                      Architectural Trade-offs (Format: Chose | Gave up):
                    </label>
                    <textarea
                      rows={4}
                      value={formData.engineerTradeoffs}
                      onChange={(e) => setFormData({ ...formData, engineerTradeoffs: e.target.value })}
                      className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-mono text-xs"
                      placeholder="AST diffing | Needs per-language grammar&#10;Hybrid search | Second index to maintain"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans text-muted mb-1">
                      Stack (comma-separated):
                    </label>
                    <input
                      type="text"
                      value={formData.engineerStack}
                      onChange={(e) => setFormData({ ...formData, engineerStack: e.target.value })}
                      className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-mono text-xs"
                      placeholder="Python, FastAPI, ChromaDB, Docker"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-muted mb-1">
                      GitHub Repo Link (optional):
                    </label>
                    <input
                      type="url"
                      value={formData.githubLink}
                      onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                      className="w-full px-3.5 py-2 bg-surface border border-line rounded-lg text-sm text-ink font-mono text-xs"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 h-11 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 cursor-pointer shadow-xs"
                >
                  Save Project to Showcase
                </button>
                {saveStatus && (
                  <span className="text-sm font-sans text-accent font-medium">
                    {saveStatus}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Existing Projects List */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-muted uppercase tracking-wider mb-2">
            <span>Active Projects ({projects.length})</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted font-mono text-sm">
              Loading projects from storage...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-muted font-sans text-sm border border-line rounded-xl bg-surface">
              No projects found. Click &quot;Add New Project&quot; above to publish your first one.
            </div>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-surface border border-line rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-line/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted uppercase">
                      {p.tag}
                    </span>
                    <span className="text-ok font-mono text-xs">· Production</span>
                  </div>
                  <h3 className="font-serif text-2xl text-ink">{p.title}</h3>
                  <p className="text-sm text-muted font-sans mt-0.5 line-clamp-1">
                    {p.plain.outcome}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/work/${p.id}`}
                    target="_blank"
                    className="p-2 border border-line rounded-lg text-xs font-sans text-muted hover:text-ink hover:bg-paper transition-colors"
                    title="View dedicated page"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(p)}
                    className="p-2 border border-line rounded-lg text-xs font-sans text-ink hover:bg-paper transition-colors cursor-pointer"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="p-2 border border-line rounded-lg text-xs font-sans text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

