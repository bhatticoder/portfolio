import { readDataFile, writeDataFile, StorageWriteResult } from "./storage";

interface AuthData {
  pin: string;
  updatedAt?: string;
}

export function getAdminPassword(): string {
  // 1. Highest priority: Vercel environment variable ADMIN_SECRET
  if (process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.trim()) {
    return process.env.ADMIN_SECRET.trim();
  }

  // 2. Read from multi-tier storage (memory, /tmp, or bundled src/data/auth.json)
  const data = readDataFile<AuthData>("auth.json", { pin: "Mudasar@2312" });
  if (data && data.pin && typeof data.pin === "string" && data.pin.trim()) {
    return data.pin.trim();
  }

  return "Mudasar@2312";
}

export function verifyAdminPassword(provided: string | null | undefined): boolean {
  if (!provided) return false;
  const actual = getAdminPassword();
  const cleanProvided = provided.trim();
  
  // Direct match with active password
  if (cleanProvided === actual) return true;

  // Migration fallback: allow initial default PIN during setup
  if (cleanProvided === "bhatti2026" && (actual === "bhatti2026" || actual === "Mudasar@2312")) {
    return true;
  }

  return false;
}

export async function setAdminPassword(newPin: string): Promise<StorageWriteResult> {
  const cleanPin = newPin.trim();
  return await writeDataFile("auth.json", {
    pin: cleanPin,
    updatedAt: new Date().toISOString(),
  });
}
