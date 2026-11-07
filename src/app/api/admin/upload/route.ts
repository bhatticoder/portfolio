import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key");
  if (!verifyAdminPassword(adminKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate mime type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, WebP, SVG, or PDF." },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || ".png";
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const uniqueName = `${Date.now()}-${baseName}${ext}`;

    // Create Base64 data URL as universal fallback
    const base64DataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    // 1. Try local write (succeeds in local development)
    let savedLocally = false;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, buffer);
      savedLocally = true;
    } catch {
      // Running on read-only filesystem (Vercel)
      savedLocally = false;
    }

    // 2. If GITHUB_TOKEN is present on Vercel, commit image directly to GitHub repository
    const ghToken = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "").trim();
    if (ghToken && !savedLocally) {
      try {
        const repo = (process.env.GITHUB_REPO || "bhatticoder/portfolio").trim();
        const branch = (process.env.GITHUB_BRANCH || "main").trim();
        const ghPath = `public/uploads/${uniqueName}`;
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${ghPath}`;

        const ghRes = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "Bhatti-Portfolio-CMS",
          },
          body: JSON.stringify({
            message: `cms: upload image ${uniqueName}`,
            content: buffer.toString("base64"),
            branch,
          }),
        });

        if (ghRes.ok) {
          return NextResponse.json({
            ok: true,
            url: `/uploads/${uniqueName}`,
            filename: uniqueName,
            storage: "github",
          });
        }
      } catch (err) {
        console.error("Failed to commit image to GitHub:", err);
      }
    }

    if (savedLocally) {
      return NextResponse.json({
        ok: true,
        url: `/uploads/${uniqueName}`,
        filename: uniqueName,
        storage: "local",
      });
    }

    // 3. Fallback on Vercel without GitHub Token: Return Base64 data URL
    // Works 100% reliably in <img> and Next.js Image without requiring disk write
    return NextResponse.json({
      ok: true,
      url: base64DataUrl,
      filename: uniqueName,
      storage: "data-url",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed: " + String(err) }, { status: 500 });
  }
}
