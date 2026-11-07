"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteSettings, DEFAULT_SETTINGS } from "@/types/settings";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: SiteSettings;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  useEffect(() => {
    const handleSettingsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };
    window.addEventListener("bhatti-settings-updated", handleSettingsUpdated);
    return () => {
      window.removeEventListener("bhatti-settings-updated", handleSettingsUpdated);
    };
  }, []);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("bhatti-settings-updated", { detail: newSettings })
      );
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  const ctx = useContext(SiteSettingsContext);
  return ctx ? ctx.settings : DEFAULT_SETTINGS;
}

export function useUpdateSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  return ctx ? ctx.updateSettings : () => {};
}

export function updateCachedSettings(newSettings: SiteSettings) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("bhatti-settings-updated", { detail: newSettings })
    );
  }
}

