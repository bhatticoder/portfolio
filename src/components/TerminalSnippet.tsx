"use client";

import { useEffect, useState, useMemo } from "react";
import { content } from "@/data/content";
import { config } from "@/lib/config";
import { CopyBadge } from "@/components/CopyBadge";

export function TerminalSnippet() {
  const resolvedLines = useMemo(() => {
    return content.terminal.output.map((line) =>
      line.replace("<NEXT_PUBLIC_CAL_LINK>", config.calLink)
    );
  }, []);

  const fullCommand = content.terminal.command;

  const [typedCommand, setTypedCommand] = useState("");
  const [visibleLinesCount, setVisibleLinesCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check prefers-reduced-motion
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setTypedCommand(fullCommand);
        setVisibleLinesCount(resolvedLines.length);
        setIsDone(true);
        return;
      }

      let charIndex = 0;
      const charIntervalTime = 400 / fullCommand.length;

      const typeInterval = setInterval(() => {
        charIndex++;
        setTypedCommand(fullCommand.slice(0, charIndex));
        if (charIndex >= fullCommand.length) {
          clearInterval(typeInterval);

          let lineIndex = 0;
          const lineInterval = setInterval(() => {
            lineIndex++;
            setVisibleLinesCount(lineIndex);
            if (lineIndex >= resolvedLines.length) {
              clearInterval(lineInterval);
              setIsDone(true);
            }
          }, 60);
        }
      }, charIntervalTime);

      return () => {
        clearInterval(typeInterval);
      };
    }, 0);

    return () => clearTimeout(timer);
  }, [fullCommand, resolvedLines]);

  return (
    <div className="w-full border border-line bg-panel rounded-md overflow-hidden text-left shadow-xs">
      {/* Title bar */}
      <div className="h-8 px-3 border-b border-line flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
          <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
          <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
          <span className="ml-2 font-mono text-xs text-muted">~/hire</span>
        </div>
        <CopyBadge value={fullCommand} label="copy" />
      </div>

      {/* Terminal content */}
      <div className="p-4 font-mono text-[13px] leading-[1.6]">
        {/* Accessible full text for screen readers while animating */}
        {!isDone && (
          <div className="sr-only">
            <p>$ {fullCommand}</p>
            {resolvedLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        <div aria-hidden={!isDone}>
          <div className="flex items-center gap-2">
            <span className="text-muted select-none">$</span>
            <span className="text-fg whitespace-pre-wrap break-words">
              {typedCommand}
              {!isDone && typedCommand.length < fullCommand.length && (
                <span className="inline-block w-1.5 h-3.5 bg-fg ml-0.5 align-middle animate-pulse" />
              )}
            </span>
          </div>

          <pre className="mt-2 text-muted whitespace-pre-wrap break-words">
            {resolvedLines.slice(0, visibleLinesCount).join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
