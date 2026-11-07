"use client";

import { useState, useEffect } from "react";
import { CommandPalette } from "@/components/CommandPalette";

export function GlobalPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpen);
    };
  }, []);

  return <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

