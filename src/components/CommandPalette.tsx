"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search } from "lucide-react";
import { config } from "@/lib/config";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { content } from "@/data/content";

interface CommandItem {
  id: string;
  title: string;
  group: "Navigate" | "Case studies" | "Actions";
  shortcut?: string;
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCaseStudy?: (id: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenCaseStudy,
}: CommandPaletteProps) {
  const router = useRouter();
  const settings = useSiteSettings();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const { resolvedTheme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state during render when query changes
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  // Sync state during render when isOpen changes
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }

  const navigateTo = useCallback(
    (path: string) => {
      onClose();
      router.push(path);
    },
    [onClose, router]
  );

  const selectCaseStudy = useCallback(
    (id: string) => {
      onClose();
      if (onOpenCaseStudy) {
        onOpenCaseStudy(id);
      }
      router.push(`/work/${id}`);
    },
    [onClose, onOpenCaseStudy, router]
  );

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigate
      {
        id: "nav-home",
        title: "Home",
        group: "Navigate",
        shortcut: "G H",
        run: () => navigateTo("/"),
      },
      {
        id: "nav-work",
        title: "Selected Work (Case Studies)",
        group: "Navigate",
        shortcut: "G W",
        run: () => navigateTo("/work"),
      },
      {
        id: "nav-process",
        title: "How I work (Process & Parameters)",
        group: "Navigate",
        shortcut: "G P",
        run: () => navigateTo("/process"),
      },
      {
        id: "nav-skills",
        title: "What I work with (Tech Stack)",
        group: "Navigate",
        shortcut: "G S",
        run: () => navigateTo("/stack"),
      },
      {
        id: "nav-faq",
        title: "Terms & FAQ",
        group: "Navigate",
        shortcut: "G F",
        run: () => navigateTo("/faq"),
      },
      {
        id: "nav-book",
        title: "Book a scoping call",
        group: "Navigate",
        shortcut: "G B",
        run: () => navigateTo("/book"),
      },
      {
        id: "nav-admin",
        title: "Admin CMS Dashboard",
        group: "Navigate",
        shortcut: "A",
        run: () => navigateTo("/admin"),
      },
      // Case Studies
      {
        id: "cs-docsentry",
        title: "DocSentry — Doc integrity agent",
        group: "Case studies",
        shortcut: "1",
        run: () => selectCaseStudy("docsentry"),
      },
      {
        id: "cs-radiology",
        title: "Radiology & Document Pipeline",
        group: "Case studies",
        shortcut: "2",
        run: () => selectCaseStudy("radiology-pipeline"),
      },
      {
        id: "cs-anpr",
        title: "Real-Time Vehicle & Plate Recognition",
        group: "Case studies",
        shortcut: "3",
        run: () => selectCaseStudy("edge-cv-anpr"),
      },
      {
        id: "cs-pocketdesk",
        title: "PocketDesk — Browser desktop streamer",
        group: "Case studies",
        shortcut: "4",
        run: () => selectCaseStudy("pocketdesk"),
      },
      // Actions
      {
        id: "act-copy-email",
        title: "Copy email",
        group: "Actions",
        shortcut: "E",
        run: () => {
          copyToClipboard(settings.email || config.email);
          onClose();
        },
      },
      {
        id: "act-copy-curl",
        title: "Copy curl command",
        group: "Actions",
        run: () => {
          copyToClipboard(content.terminal.command);
          onClose();
        },
      },
      {
        id: "act-cal",
        title: "Open Cal.com ↗",
        group: "Actions",
        run: () => {
          window.open(
            `https://cal.com/${settings.calLink || config.calLink}`,
            "_blank",
            "noopener,noreferrer"
          );
          onClose();
        },
      },
      {
        id: "act-theme",
        title: "Toggle theme",
        group: "Actions",
        shortcut: "T",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          onClose();
        },
      },
      {
        id: "act-gh",
        title: "Open GitHub ↗",
        group: "Actions",
        run: () => {
          window.open(settings.socials?.github || config.github, "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "act-li",
        title: "Open LinkedIn ↗",
        group: "Actions",
        run: () => {
          window.open(settings.socials?.linkedin || config.linkedin, "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "act-tw",
        title: "Open Twitter/X ↗",
        group: "Actions",
        run: () => {
          window.open(settings.socials?.twitter || config.twitter, "_blank", "noopener,noreferrer");
          onClose();
        },
      },
      {
        id: "act-medium",
        title: "Open Medium ↗",
        group: "Actions",
        run: () => {
          window.open(settings.socials?.medium || config.medium, "_blank", "noopener,noreferrer");
          onClose();
        },
      },
    ],
    [
      navigateTo,
      selectCaseStudy,
      copyToClipboard,
      onClose,
      resolvedTheme,
      setTheme,
      settings,
    ]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.group.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].run();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] border border-line bg-surface rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans"
      >
        {/* Search Input */}
        <div className="h-14 px-4 border-b border-line flex items-center gap-3">
          <Search className="w-5 h-5 text-muted shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search work, process, or actions..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <kbd className="font-mono text-[11px] text-muted border border-line px-1.5 py-0.5 rounded-sm bg-paper">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-line/40">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted font-sans">
              No matching results found
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={cmd.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-sm rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-paper text-accent font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] uppercase font-mono text-muted tracking-wider">
                      {cmd.group}
                    </span>
                    <span className="text-muted/60">/</span>
                    <span className="text-ink">{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd className="font-mono text-[10px] text-muted border border-line px-1.5 py-0.5 rounded-sm bg-paper">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
