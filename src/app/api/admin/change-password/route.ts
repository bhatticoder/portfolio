import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(currentPassword)) {
      return NextResponse.json(
        { error: "Current password does not match" },
        { status: 401 }
      );
    }

    if (newPassword.trim().length < 4) {
      return NextResponse.json(
        { error: "New password must be at least 4 characters long" },
        { status: 400 }
      );
    }

    const success = setAdminPassword(newPassword);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to save new password" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Bad request: " + String(err) },
      { status: 400 }
    );
  }
}
