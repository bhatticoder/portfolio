"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CaseStudy } from "@/data/caseStudies";
import { SiteSettings, DEFAULT_SETTINGS } from "@/types/settings";
import { updateCachedSettings } from "@/lib/useSiteSettings";
import {
  Lock,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
  Settings,
  FolderGit2,
  ArrowLeft,
  X,
  Share2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Navigation tab: "projects" | "settings" | "security"
  const [activeTab, setActiveTab] = useState<"projects" | "settings" | "security">("projects");

  // Security / Change Password state
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [securityStatus, setSecurityStatus] = useState<string>("");
  const [securityError, setSecurityError] = useState<string>("");
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Projects state
  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<CaseStudy | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
  const [settingsStatus, setSettingsStatus] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form states for project
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    tag: "",
    image: "",
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
    writeupLink: "",
    videoLink: "",
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

  const loadSiteSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
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
        loadSiteSettings();
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
        loadSiteSettings();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProjects, loadSiteSettings]);

  // Project Image Upload handler
  const handleUploadProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err) {
      alert("Upload failed: " + String(err));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Avatar Image Upload handler
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSiteSettings((prev) => {
          const next = { ...prev, avatarUrl: data.url };
          updateCachedSettings(next);
          return next;
        });

        // Persist immediately to settings DB
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ ...siteSettings, avatarUrl: data.url }),
        })
          .then((r) => r.json())
          .then((resData) => {
            if (resData.settings) {
              setSiteSettings(resData.settings);
              updateCachedSettings(resData.settings);
            }
          })
          .catch(() => {});
      } else {
        alert(data.error || "Avatar upload failed");
      }
    } catch (err) {
      alert("Avatar upload failed: " + String(err));
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  // Dynamic Social Links helpers
  const handleAddSocialLink = () => {
    setSiteSettings((prev) => ({
      ...prev,
      socials: [
        ...(Array.isArray(prev.socials) ? prev.socials : []),
        { id: String(Date.now()), platform: "", url: "" },
      ],
    }));
  };

  const handleUpdateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    setSiteSettings((prev) => {
      const updated = Array.isArray(prev.socials) ? [...prev.socials] : [];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, socials: updated };
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    setSiteSettings((prev) => {
      const updated = Array.isArray(prev.socials) ? [...prev.socials] : [];
      updated.splice(index, 1);
      return { ...prev, socials: updated };
    });
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingProject(null);
    setFormData({
      id: "",
      title: "",
      subtitle: "",
      tag: "",
      image: "",
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
      writeupLink: "",
      videoLink: "",
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
      image: p.image || "",
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
      writeupLink: p.links.writeup || "",
      videoLink: p.links.video || "",
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

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving project...");

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
      image: formData.image.trim() || null,
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
        writeup: formData.writeupLink.trim() || null,
        video: formData.videoLink.trim() || null,
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
        setTimeout(() => setSaveStatus(""), 2500);
        setIsCreatingNew(false);
        setEditingProject(null);
        loadProjects();
      } else {
        const err = await res.json();
        setSaveStatus("Error: " + (err.error || "Save failed"));
      }
    } catch (err) {
      setSaveStatus("Network error: " + String(err));
    }
  };

  const handleSaveSettingsForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus("Saving settings...");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(siteSettings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSiteSettings(data.settings);
          updateCachedSettings(data.settings);
        }
        setSettingsStatus("Settings & links saved successfully!");
        setTimeout(() => setSettingsStatus(""), 3000);
      } else {
        const err = await res.json();
        setSettingsStatus("Error: " + (err.error || "Failed to save settings"));
      }
    } catch (err) {
      setSettingsStatus("Network error: " + String(err));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError("");
    setSecurityStatus("");

    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirm password do not match");
      return;
    }

    if (newPassword.trim().length < 4) {
      setSecurityError("New password must be at least 4 characters long");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAdminKey(newPassword.trim());
        sessionStorage.setItem("bhatti_admin_key", newPassword.trim());
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSecurityStatus("Password successfully changed to your custom password!");
      } else {
        setSecurityError(data.error || "Failed to update password");
      }
    } catch (err) {
      setSecurityError("Network error: " + String(err));
    } finally {
      setChangingPassword(false);
    }
  };

  // Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-line bg-surface p-8 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-paper border border-line flex items-center justify-center mb-6 text-accent">
            <Lock className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl text-ink">Bhatti Admin CMS</h1>
          <p className="mt-2 text-sm text-muted font-sans">
            Enter your admin PIN / secret key to manage projects, pictures, and social links dynamically.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Admin Password / PIN
              </label>
              <div className="relative flex items-center">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin password / PIN"
                  className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-line bg-paper text-ink font-mono text-sm focus:outline-none focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-muted font-mono">
                Default: Mudasar@2312 (or bhatti2026)
              </p>
            </div>

            {authError && (
              <div className="text-xs text-red-600 font-sans p-2 bg-red-500/10 border border-red-500/20 rounded-md">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-accent text-white font-sans text-sm font-medium rounded-lg hover:opacity-95 transition-opacity"
            >
              Sign In to CMS
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-line text-center">
            <Link
              href="/"
              className="text-xs text-muted hover:text-ink font-sans inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-xl text-ink hover:text-accent transition-colors"
            >
              Muhammad Mudassar Bhatti
            </Link>
            <span className="text-xs font-mono px-2 py-0.5 border border-line rounded-md bg-surface text-accent font-medium">
              CMS Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-muted hover:text-ink font-sans inline-flex items-center gap-1 px-3 py-1.5 border border-line rounded-lg bg-surface transition-colors"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("bhatti_admin_key");
                setIsAuthenticated(false);
              }}
              className="text-xs text-muted hover:text-accent font-sans px-3 py-1.5 border border-line rounded-lg bg-surface transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 border-t border-line/60">
          <button
            type="button"
            onClick={() => {
              setActiveTab("projects");
              setIsCreatingNew(false);
              setEditingProject(null);
            }}
            className={`py-3 text-sm font-sans font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "projects"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <FolderGit2 className="w-4 h-4" strokeWidth={1.5} />
            <span>Projects & Screenshots ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("settings");
              loadSiteSettings();
            }}
            className={`py-3 text-sm font-sans font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Settings className="w-4 h-4" strokeWidth={1.5} />
            <span>Site Settings & Social Links</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("security");
              setSecurityStatus("");
              setSecurityError("");
            }}
            className={`py-3 text-sm font-sans font-medium flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "security"
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <KeyRound className="w-4 h-4" strokeWidth={1.5} />
            <span>Change Password</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: PROJECTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "projects" && (
          <div>
            {!isCreatingNew && !editingProject ? (
              <div>
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-3xl text-ink">Project Catalog</h2>
                    <p className="text-sm text-muted font-sans mt-1">
                      Manage screenshots, live demos, GitHub repositories, and writeups dynamically.
                    </p>
                  </div>

                  <button
                    onClick={handleStartCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 transition-opacity shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>

                {loading ? (
                  <div className="text-sm text-muted font-mono p-8 text-center border border-line rounded-xl bg-surface">
                    Loading projects...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="border border-line bg-surface rounded-xl overflow-hidden shadow-xs p-5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Thumbnail Preview */}
                          <div className="aspect-[16/10] bg-paper border border-line rounded-lg mb-4 overflow-hidden relative flex items-center justify-center">
                            {p.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <ImageIcon className="w-8 h-8 text-muted/50 mx-auto mb-1" />
                                <span className="font-mono text-xs text-muted">
                                  No screenshot uploaded
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-mono text-accent uppercase tracking-wider">
                                {p.tag}
                              </div>
                              <h3 className="font-serif text-2xl text-ink mt-1">
                                {p.title}
                              </h3>
                              <p className="text-xs text-muted font-sans mt-1 line-clamp-2">
                                {p.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Links badges */}
                          <div className="mt-4 pt-3 border-t border-line/60 flex flex-wrap gap-2 text-xs font-mono">
                            {p.links.demo ? (
                              <span className="text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                Demo: {p.links.demo}
                              </span>
                            ) : (
                              <span className="text-muted bg-paper px-2 py-0.5 rounded border border-line">
                                Demo: NDA
                              </span>
                            )}

                            {p.links.github ? (
                              <span className="text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                Code: Active
                              </span>
                            ) : (
                              <span className="text-muted bg-paper px-2 py-0.5 rounded border border-line">
                                Code: NDA
                              </span>
                            )}

                            {p.links.writeup && (
                              <span className="text-purple-700 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                Writeup
                              </span>
                            )}

                            {p.links.video && (
                              <span className="text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                Video
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                          <Link
                            href={`/work/${p.id}`}
                            target="_blank"
                            className="text-xs text-muted hover:text-accent font-sans inline-flex items-center gap-1"
                          >
                            <span>Open Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(p)}
                              className="px-3 py-1.5 border border-line rounded-lg text-xs font-sans text-ink hover:border-ink/40 bg-paper transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-sans hover:bg-red-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Project Form: Add / Edit */
              <div className="border border-line bg-surface rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-6 border-b border-line mb-6">
                  <div>
                    <h2 className="font-serif text-3xl text-ink">
                      {isCreatingNew ? "Add New Project" : `Edit Project: ${formData.title}`}
                    </h2>
                    <p className="text-xs text-muted font-mono mt-1">
                      All changes are dynamic and update immediately across the site.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNew(false);
                      setEditingProject(null);
                    }}
                    className="p-2 border border-line rounded-lg text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProjectForm} className="space-y-8 font-sans">
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Project ID (slug for URL: /work/[id]) *
                      </label>
                      <input
                        type="text"
                        value={formData.id}
                        onChange={(e) =>
                          setFormData({ ...formData, id: e.target.value })
                        }
                        placeholder="e.g. ai-document-analyzer"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-paper text-ink font-mono text-sm focus:outline-none focus:border-accent"
                        required
                        disabled={!isCreatingNew}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g. DocSentry"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-paper text-ink text-sm focus:outline-none focus:border-accent font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        One-Line Subtitle / Tagline *
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                        placeholder="e.g. Autonomous documentation-integrity agent"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-paper text-ink text-sm focus:outline-none focus:border-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Category Tag *
                      </label>
                      <input
                        type="text"
                        value={formData.tag}
                        onChange={(e) =>
                          setFormData({ ...formData, tag: e.target.value })
                        }
                        placeholder="e.g. agents · retrieval · CI"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-paper text-ink text-sm focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                  </div>

                  {/* SCREENSHOT & PICTURE SECTION */}
                  <div className="p-5 border border-line rounded-xl bg-paper/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4" />
                          <span>Project Picture / Screenshot (16:10 or 16:9)</span>
                        </h3>
                        <p className="text-xs text-muted mt-0.5">
                          Upload a picture directly or paste any image URL. Leave blank for &quot;Screenshot coming&quot; placeholder.
                        </p>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleUploadProjectImage}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3.5 py-2 bg-surface border border-line text-xs font-sans font-medium text-ink rounded-lg hover:border-ink/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-muted mb-1 uppercase">
                          Image URL or Path
                        </label>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          placeholder="/uploads/my-screenshot.png or https://..."
                          className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink font-mono text-xs focus:outline-none focus:border-accent"
                        />
                      </div>

                      {/* Visual Preview */}
                      <div className="sm:col-span-1">
                        <div className="aspect-[16/10] border border-line rounded-lg overflow-hidden bg-surface relative flex items-center justify-center">
                          {formData.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.image}
                              alt="Screenshot preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-mono text-[10px] text-muted text-center px-2">
                              No image chosen
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ALL PROJECT LINKS SECTION */}
                  <div className="p-5 border border-line rounded-xl bg-paper/60 space-y-4">
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>Project Links & Demos</span>
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
                        Leave blank if private or under NDA — the UI will automatically render &quot;On request (NDA)&quot;.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-muted mb-1 uppercase">
                          Live Demo URL
                        </label>
                        <input
                          type="url"
                          value={formData.demoLink}
                          onChange={(e) =>
                            setFormData({ ...formData, demoLink: e.target.value })
                          }
                          placeholder="https://my-demo-app.com"
                          className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-muted mb-1 uppercase">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={formData.githubLink}
                          onChange={(e) =>
                            setFormData({ ...formData, githubLink: e.target.value })
                          }
                          placeholder="https://github.com/bhatticoder/project-repo"
                          className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-muted mb-1 uppercase">
                          Technical Writeup / Docs URL (e.g. Medium, Blog)
                        </label>
                        <input
                          type="url"
                          value={formData.writeupLink}
                          onChange={(e) =>
                            setFormData({ ...formData, writeupLink: e.target.value })
                          }
                          placeholder="https://medium.com/@mudasarbhatti784/..."
                          className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-muted mb-1 uppercase">
                          Video Walkthrough / Loom URL
                        </label>
                        <input
                          type="url"
                          value={formData.videoLink}
                          onChange={(e) =>
                            setFormData({ ...formData, videoLink: e.target.value })
                          }
                          placeholder="https://loom.com/share/... or YouTube link"
                          className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PLAIN ENGLISH SECTION */}
                  <div className="border border-line rounded-xl p-5 space-y-4 bg-paper/30">
                    <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      Section A: Plain English (For Non-Technical Clients)
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        The Problem (2 sentences in business terms) *
                      </label>
                      <textarea
                        rows={2}
                        value={formData.plainProblem}
                        onChange={(e) =>
                          setFormData({ ...formData, plainProblem: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        What I Built (2 sentences in plain language) *
                      </label>
                      <textarea
                        rows={2}
                        value={formData.plainBuilt}
                        onChange={(e) =>
                          setFormData({ ...formData, plainBuilt: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        What You Get / Outcome (1 sentence client outcome) *
                      </label>
                      <input
                        type="text"
                        value={formData.plainOutcome}
                        onChange={(e) =>
                          setFormData({ ...formData, plainOutcome: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                  </div>

                  {/* ENGINEER VIEW SECTION */}
                  <div className="border border-line rounded-xl p-5 space-y-4 bg-paper/30">
                    <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      Section B: Engineer View (For Technical Reviewers)
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Technical Problem Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.engineerProblem}
                        onChange={(e) =>
                          setFormData({ ...formData, engineerProblem: e.target.value })
                        }
                        placeholder="Leave blank to use Plain English problem"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        How It Works (Enter each step / feature on a new line)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.engineerHow}
                        onChange={(e) =>
                          setFormData({ ...formData, engineerHow: e.target.value })
                        }
                        placeholder="Parses git diffs into Tree-sitter ASTs&#10;Hybrid retrieval using BM25 and ChromaDB&#10;Multi-model evaluator across Groq and Gemini"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm font-mono text-xs focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Trade-offs (Format each line as: What you chose | What you gave up)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.engineerTradeoffs}
                        onChange={(e) =>
                          setFormData({ ...formData, engineerTradeoffs: e.target.value })
                        }
                        placeholder="AST-level diffing over line diffs | Needs grammar per language&#10;Hybrid retrieval over embeddings alone | Extra index maintenance"
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm font-mono text-xs focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Tech Stack Chips (comma-separated) *
                        </label>
                        <input
                          type="text"
                          value={formData.engineerStack}
                          onChange={(e) =>
                            setFormData({ ...formData, engineerStack: e.target.value })
                          }
                          placeholder="Python, FastAPI, Tree-sitter, ChromaDB, Docker"
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Metrics Key (from metrics.ts)
                        </label>
                        <input
                          type="text"
                          value={formData.metricsKey}
                          onChange={(e) =>
                            setFormData({ ...formData, metricsKey: e.target.value })
                          }
                          placeholder="e.g. docsentry, radiology-pipeline, edge-cv-anpr"
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm font-mono text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line">
                    <div className="text-sm font-mono">
                      {saveStatus && (
                        <span
                          className={
                            saveStatus.startsWith("Error")
                              ? "text-red-600"
                              : "text-emerald-700 font-semibold"
                          }
                        >
                          {saveStatus}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNew(false);
                          setEditingProject(null);
                        }}
                        className="px-4 py-2 border border-line rounded-xl text-sm font-medium text-ink hover:border-ink/40 bg-paper transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 transition-opacity shadow-xs cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isCreatingNew ? "Publish Project" : "Save Changes"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SITE SETTINGS & SOCIAL LINKS */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <div className="border border-line bg-surface rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="pb-6 border-b border-line mb-6">
              <h2 className="font-serif text-3xl text-ink">Site Settings & Social Links</h2>
              <p className="text-sm text-muted font-sans mt-1">
                Update your contact info, social accounts, Cal.com scheduling slug, and hero profile photo. All changes update instantly on the site.
              </p>
            </div>

            {loadingSettings ? (
              <div className="text-sm text-muted font-mono p-8 text-center">
                Loading settings...
              </div>
            ) : (
              <form onSubmit={handleSaveSettingsForm} className="space-y-8 font-sans">
                {/* Profile Identity & Photo */}
                <div className="p-5 border border-line rounded-xl bg-paper/50 space-y-4">
                  <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                    1. Profile Identity & Photo
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Avatar Preview */}
                    <div className="sm:col-span-3 flex flex-col items-center gap-2">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-line bg-paper relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={siteSettings.avatarUrl || "/profile.jpg"}
                          alt={siteSettings.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Hidden avatar file input */}
                      <input
                        type="file"
                        ref={avatarInputRef}
                        accept="image/*"
                        onChange={handleUploadAvatar}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="text-xs text-accent hover:underline font-mono inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{uploadingAvatar ? "Uploading..." : "Change Avatar"}</span>
                      </button>
                    </div>

                    <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.name}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, name: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Role Title *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.role}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, role: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Location *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.location}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, location: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-12 grid grid-cols-1 gap-4 pt-3 border-t border-line/60">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Hero Headline (Headline on Homepage)
                        </label>
                        <input
                          type="text"
                          value={siteSettings.headline || ""}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, headline: e.target.value })
                          }
                          placeholder="I build AI systems that do real work for your business."
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                          Hero Subheadline (Plain Language Description)
                        </label>
                        <textarea
                          rows={2}
                          value={siteSettings.subheadline || ""}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, subheadline: e.target.value })
                          }
                          placeholder="Tools that read documents, watch video, check your code, and flag problems automatically..."
                          className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Scheduling Links */}
                <div className="p-5 border border-line rounded-xl bg-paper/50 space-y-4">
                  <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                    2. Contact & Booking
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Primary Email Address *
                      </label>
                      <input
                        type="email"
                        value={siteSettings.email}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent font-mono text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                        Cal.com Booking Slug *
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 bg-paper border border-r-0 border-line text-xs font-mono text-muted rounded-l-lg select-none">
                          cal.com/
                        </span>
                        <input
                          type="text"
                          value={siteSettings.calLink}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, calLink: e.target.value })
                          }
                          placeholder="mudasar-bhatti"
                          className="w-full px-3.5 py-2 rounded-r-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:border-accent font-mono text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Social & Developer Links */}
                <div className="p-5 border border-line rounded-xl bg-paper/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line/60">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                        <Share2 className="w-4 h-4" />
                        <span>3. Social & Developer Links (Dynamic)</span>
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        Add as many social or professional profiles as you need (e.g. LinkedIn, GitHub, YouTube, Discord, Substack). They will automatically appear in the footer and command palette.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-sans font-medium rounded-lg hover:opacity-95 transition-opacity cursor-pointer self-start sm:self-auto shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Social Link</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(siteSettings.socials) && siteSettings.socials.length > 0 ? (
                      siteSettings.socials.map((link, idx) => (
                        <div
                          key={link.id || idx}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 bg-surface border border-line rounded-lg shadow-2xs"
                        >
                          <div className="w-full sm:w-1/3">
                            <label className="block text-[10px] font-mono uppercase text-muted mb-0.5 sm:hidden">
                              Platform Name
                            </label>
                            <input
                              type="text"
                              value={link.platform}
                              onChange={(e) =>
                                handleUpdateSocialLink(idx, "platform", e.target.value)
                              }
                              placeholder="e.g. LinkedIn, Discord, YouTube"
                              className="w-full px-3 py-2 rounded-md border border-line bg-paper text-ink text-xs font-sans focus:outline-none focus:border-accent"
                              required
                            />
                          </div>

                          <div className="w-full sm:flex-1">
                            <label className="block text-[10px] font-mono uppercase text-muted mb-0.5 sm:hidden">
                              Profile URL
                            </label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) =>
                                handleUpdateSocialLink(idx, "url", e.target.value)
                              }
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-md border border-line bg-paper text-ink text-xs font-mono focus:outline-none focus:border-accent"
                              required
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(idx)}
                            className="p-2 border border-red-200 text-red-600 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer self-end sm:self-auto shrink-0"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 border border-dashed border-line rounded-lg text-muted text-xs font-mono bg-surface/50">
                        No links added yet. Click &quot;Add Social Link&quot; above to add your first profile.
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button & Feedback */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line">
                  <div className="text-sm font-mono">
                    {settingsStatus && (
                      <span
                        className={
                          settingsStatus.startsWith("Error")
                            ? "text-red-600"
                            : "text-emerald-700 font-semibold"
                        }
                      >
                        {settingsStatus}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 transition-opacity shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Site Settings & Links</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SECURITY & CHANGE PASSWORD */}
        {/* ========================================================================= */}
        {activeTab === "security" && (
          <div className="max-w-xl mx-auto border border-line bg-surface rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-paper border border-line flex items-center justify-center mb-6 text-accent">
              <KeyRound className="w-6 h-6" strokeWidth={1.5} />
            </div>

            <h2 className="font-serif text-3xl text-ink">Change Admin Password</h2>
            <p className="text-sm text-muted font-sans mt-1">
              Set a custom administrative password or PIN for this dashboard. This password will be required for all future admin sessions.
            </p>

            {/* Cloud Storage & Persistence Advisory Card */}
            <div className="mt-6 p-4 rounded-xl border border-line bg-paper/60 text-xs font-sans text-muted space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>Multi-Tier Storage & Vercel Persistence</span>
              </div>
              <p className="leading-relaxed">
                When deployed on Vercel, passwords and CMS updates are stored across serverless memory and temporary storage.
              </p>
              <div className="pt-2 border-t border-line/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-surface border border-line">
                  <span className="text-ink font-semibold block mb-0.5">Option 1: Vercel Env Var</span>
                  Set <code className="text-accent">ADMIN_SECRET</code> in Vercel Project Settings → Environment Variables.
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-line">
                  <span className="text-ink font-semibold block mb-0.5">Option 2: Git CMS Sync</span>
                  Add <code className="text-accent">GITHUB_TOKEN</code> in Vercel to auto-commit all CMS edits directly to your repository.
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="mt-8 space-y-5 font-sans">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                  Current Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (e.g. Mudasar@2312 or bhatti2026)"
                    className="w-full pl-3.5 pr-11 py-2.5 rounded-lg border border-line bg-paper text-ink text-sm font-mono focus:outline-none focus:border-accent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                  New Password * (minimum 4 characters)
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new custom password"
                    className="w-full pl-3.5 pr-11 py-2.5 rounded-lg border border-line bg-paper text-ink text-sm font-mono focus:outline-none focus:border-accent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new custom password"
                    className="w-full pl-3.5 pr-11 py-2.5 rounded-lg border border-line bg-paper text-ink text-sm font-mono focus:outline-none focus:border-accent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {securityError && (
                <div className="text-xs text-red-600 font-sans p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  {securityError}
                </div>
              )}

              {securityStatus && (
                <div className="text-xs text-emerald-700 font-sans p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{securityStatus}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-2.5 bg-accent text-white font-sans text-sm font-medium rounded-xl hover:opacity-95 transition-opacity shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{changingPassword ? "Updating Password..." : "Update Password"}</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
