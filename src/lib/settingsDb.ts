import { SiteSettings, SocialLink, DEFAULT_SETTINGS } from "../types/settings";
import { readDataFile, writeDataFile, StorageWriteResult } from "./storage";

export * from "../types/settings";

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
    const raw = readDataFile<SiteSettings>("settings.json", DEFAULT_SETTINGS);
    return {
      ...DEFAULT_SETTINGS,
      ...raw,
      socials: normalizeSocials(raw.socials),
    };
  } catch (err) {
    console.error("Error reading settings DB:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(newSettings: Partial<SiteSettings>): Promise<StorageWriteResult> {
  try {
    const current = getSiteSettings();
    const merged: SiteSettings = {
      ...current,
      ...newSettings,
      socials: newSettings.socials
        ? normalizeSocials(newSettings.socials)
        : current.socials,
    };
    return await writeDataFile("settings.json", merged);
  } catch (err) {
    console.error("Error writing settings DB:", err);
    return {
      success: false,
      mode: "local",
      message: "Error writing settings: " + String(err),
    };
  }
}
