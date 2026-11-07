import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/settingsDb";
import { verifyAdminPassword } from "@/lib/auth";

function isAuthorized(request: NextRequest): boolean {
  const headerKey = request.headers.get("x-admin-key");
  return verifyAdminPassword(headerKey);
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
    const result = await saveSiteSettings(payload);
    if (result.success) {
      return NextResponse.json({
        ok: true,
        settings: getSiteSettings(),
        mode: result.mode,
        message: result.message,
      });
    }
    return NextResponse.json(
      { error: result.message || "Failed to save settings" },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Bad request: " + String(err) }, { status: 400 });
  }
}
