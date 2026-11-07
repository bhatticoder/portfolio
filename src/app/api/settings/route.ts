import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settingsDb";

export async function GET() {
  const settings = getSiteSettings();
  return NextResponse.json(settings, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

