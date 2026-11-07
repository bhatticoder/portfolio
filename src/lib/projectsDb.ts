import fs from "fs";
import path from "path";
import { CaseStudy } from "@/data/caseStudies";

const DB_PATH = path.join(process.cwd(), "src", "data", "projects.json");

export function getAllProjects(): CaseStudy[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data) as CaseStudy[];
  } catch (err) {
    console.error("Error reading projects DB:", err);
    return [];
  }
}

export function getProjectById(id: string): CaseStudy | null {
  const projects = getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

export function saveAllProjects(projects: CaseStudy[]): boolean {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing to projects DB:", err);
    return false;
  }
}

export function createProject(project: CaseStudy): boolean {
  const projects = getAllProjects();
  const existing = projects.find((p) => p.id === project.id);
  if (existing) {
    return false; // Already exists
  }
  projects.unshift(project);
  return saveAllProjects(projects);
}

export function updateProject(id: string, updatedData: Partial<CaseStudy>): boolean {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  projects[index] = { ...projects[index], ...updatedData };
  return saveAllProjects(projects);
}

export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) {
    return false;
  }
  return saveAllProjects(filtered);
}

