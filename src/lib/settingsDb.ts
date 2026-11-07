import fs from "fs";
import path from "path";
import { SiteSettings, SocialLink, DEFAULT_SETTINGS } from "../types/settings";

export * from "../types/settings";

const SETTINGS_PATH = path.join(process.cwd(), "src", "data", "settings.json");

export function normalizeSocials(rawSocials: unknown): SocialLink[] {
  if (Array.isArray(rawSocials)) {
    return rawSocials
      .filter((item) => item && typeof item === "object")
      .map((item, index) => ({
        id: String(item.id || `soc-${index}-${Date.now()}`),
        platform: String(item.platform || "Link"),
        url: String(item.url || ""),
      }));
  }
  if (typeof rawSocials === "object" && rawSocials !== null) {
    const list: SocialLink[] = [];
    const entries = Object.entries(rawSocials as Record<string, string>);
    for (const [key, value] of entries) {
      if (typeof value === "string" && value.trim()) {
        const platformName =
          key.toLowerCase() === "linkedin"
            ? "LinkedIn"
            : key.toLowerCase() === "twitter"
            ? "Twitter/X"
            : key.toLowerCase() === "github"
            ? "GitHub"
            : key.toLowerCase() === "medium"
            ? "Medium"
            : key.toLowerCase() === "reddit"
            ? "Reddit"
            : key.toLowerCase() === "instagram"
            ? "Instagram"
            : key.charAt(0).toUpperCase() + key.slice(1);
        list.push({
          id: key,
          platform: platformName,
          url: value.trim(),
        });
      }
    }
    return list;
  }
  return DEFAULT_SETTINGS.socials;
}

export function getSiteSettings(): SiteSettings {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      return DEFAULT_SETTINGS;
    }
    const data = fs.readFileSync(SETTINGS_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      socials: normalizeSocials(parsed.socials),
    };
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
      socials: newSettings.socials
        ? normalizeSocials(newSettings.socials)
        : current.socials,
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(merged, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing settings DB:", err);
    return false;
  }
}
