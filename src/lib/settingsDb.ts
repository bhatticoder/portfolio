import fs from "fs";
import path from "path";
import { SiteSettings, DEFAULT_SETTINGS } from "@/types/settings";

export * from "@/types/settings";

const SETTINGS_PATH = path.join(process.cwd(), "src", "data", "settings.json");

export function getSiteSettings(): SiteSettings {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      return DEFAULT_SETTINGS;
    }
    const data = fs.readFileSync(SETTINGS_PATH, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (err) {
    console.error("Error reading settings DB:", err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSiteSettings(newSettings: Partial<SiteSettings>): boolean {
  try {
    const current = getSiteSettings();
    const merged: SiteSettings = {
      ...current,
      ...newSettings,
      socials: {
        ...current.socials,
        ...(newSettings.socials || {}),
      },
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(merged, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing settings DB:", err);
    return false;
  }
}
