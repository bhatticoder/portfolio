"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMounted } from "@/lib/useMounted";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "w-8 h-8 inline-flex items-center justify-center border border-line rounded-md text-muted",
          className
        )}
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-8 h-8 inline-flex items-center justify-center border border-line rounded-md text-muted hover:text-fg transition-colors cursor-pointer",
        className
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
