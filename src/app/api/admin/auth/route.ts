import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "bhatti2026";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    if (key === ADMIN_SECRET) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

