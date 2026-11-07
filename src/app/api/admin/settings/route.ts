import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/settingsDb";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "bhatti2026";

function isAuthorized(request: NextRequest): boolean {
  const headerKey = request.headers.get("x-admin-key");
  return headerKey === ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const payload = await request.json();
    const success = saveSiteSettings(payload);
    if (success) {
      return NextResponse.json({ ok: true, settings: getSiteSettings() });
    }
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: "Bad request: " + String(err) }, { status: 400 });
  }
}

