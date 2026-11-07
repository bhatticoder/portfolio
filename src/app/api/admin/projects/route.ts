import { NextRequest, NextResponse } from "next/server";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/projectsDb";
import { verifyAdminPassword } from "@/lib/auth";

function isAuthorized(request: NextRequest): boolean {
  const key =
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return verifyAdminPassword(key);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projects = getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id || !body.title) {
      return NextResponse.json(
        { error: "id and title are required" },
        { status: 400 }
      );
    }

    const result = await createProject(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to create project" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      project: body,
      mode: result.mode,
      message: result.message,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse or create project", details: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json(
        { error: "id is required for update" },
        { status: 400 }
      );
    }

    const result = await updateProject(id, data);
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Project not found or failed to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: result.mode,
      message: result.message,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update project", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 }
      );
    }

    const result = await deleteProject(id);
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Project not found or could not be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: result.mode,
      message: result.message,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete project", details: String(err) },
      { status: 500 }
    );
  }
}
