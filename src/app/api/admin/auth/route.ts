import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    if (verifyAdminPassword(key)) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid admin key / PIN" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

