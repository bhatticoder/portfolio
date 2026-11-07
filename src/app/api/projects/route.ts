import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/projectsDb";

export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json(projects, {
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  });
}
