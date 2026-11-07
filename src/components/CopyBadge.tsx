"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface CopyBadgeProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyBadge({ value, label, className }: CopyBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 font-mono text-xs text-muted hover:text-fg border border-line rounded-sm transition-colors cursor-pointer",
        className
      )}
      aria-label={label || (copied ? "Copied" : "Copy to clipboard")}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-ok" strokeWidth={1.5} />
          <span className="text-ok font-mono text-xs" aria-live="polite">
            copied
          </span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
          {label && (
            <span className="font-mono text-xs" aria-live="polite">
              {label}
            </span>
          )}
        </>
      )}
    </button>
  );
}

