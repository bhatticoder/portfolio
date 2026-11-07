"use client";

import { useSyncExternalStore } from "react";
import { content } from "@/data/content";
import { useMounted } from "@/lib/useMounted";

function subscribeOnline(callback: () => void) {
  const interval = setInterval(callback, 60000);
  return () => clearInterval(interval);
}

function getIsOnlineClient(): boolean {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      hour: "numeric",
      hour12: false,
    });
    const currentHour = parseInt(formatter.format(new Date()), 10);
    // Working window: 14:00 to 02:00 PKT
    return currentHour >= 14 || currentHour < 2;
  } catch {
    return false;
  }
}

export function AvailabilityBadge() {
  const mounted = useMounted();
  const isOnline = useSyncExternalStore(
    subscribeOnline,
    getIsOnlineClient,
    () => false
  );

  const badgeText = !mounted
    ? `Available · ${content.availability.window}`
    : isOnline
    ? `Online now · ${content.availability.window}`
    : `Offline · back 14:00 PKT · replies within 1 business day`;

  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div
        className="border border-line rounded-full px-3 h-7 inline-flex items-center gap-2 font-mono text-xs cursor-default select-none"
        title={content.availability.covers}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full bg-ok inline-block ${
            isOnline ? "animate-pulse" : ""
          }`}
          style={isOnline ? { animationDuration: "2s" } : undefined}
        />
        <span>{badgeText}</span>
      </div>
      <p className="hidden sm:block text-muted font-mono text-xs">
        {content.availability.engagement}
      </p>
    </div>
  );
}
