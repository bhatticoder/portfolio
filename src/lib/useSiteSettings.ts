"use client";

import { useState, useEffect } from "react";
import { SiteSettings, DEFAULT_SETTINGS } from "@/types/settings";

let cachedSettings: SiteSettings | null = null;
const listeners = new Set<(s: SiteSettings) => void>();

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(
    cachedSettings || DEFAULT_SETTINGS
  );

  useEffect(() => {
    const handler = (s: SiteSettings) => setSettings(s);
    listeners.add(handler);

    // Fetch latest settings from API
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: SiteSettings) => {
        if (data && data.name) {
          cachedSettings = data;
          listeners.forEach((l) => l(data));
        }
      })
      .catch(() => {
        // Fallback to default
      });

    return () => {
      listeners.delete(handler);
    };
  }, []);

  return settings;
}

export function updateCachedSettings(newSettings: SiteSettings) {
  cachedSettings = newSettings;
  listeners.forEach((l) => l(newSettings));
}

