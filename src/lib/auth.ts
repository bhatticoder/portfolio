import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), "src", "data", "auth.json");

export function getAdminPassword(): string {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
      if (data && data.pin && typeof data.pin === "string") {
        return data.pin.trim();
      }
    }
  } catch (err) {
    console.error("Error reading auth.json:", err);
  }
  return (process.env.ADMIN_SECRET || "bhatti2026").trim();
}

export function verifyAdminPassword(provided: string | null | undefined): boolean {
  if (!provided) return false;
  const actual = getAdminPassword();
  return provided.trim() === actual;
}

export function setAdminPassword(newPin: string): boolean {
  try {
    fs.writeFileSync(
      AUTH_FILE,
      JSON.stringify(
        {
          pin: newPin.trim(),
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
    return true;
  } catch (err) {
    console.error("Error writing auth.json:", err);
    return false;
  }
}
