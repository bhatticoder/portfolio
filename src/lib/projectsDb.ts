import { CaseStudy } from "@/data/caseStudies";
import { readDataFile, writeDataFile, StorageWriteResult } from "./storage";

export function getAllProjects(): CaseStudy[] {
  try {
    return readDataFile<CaseStudy[]>("projects.json", []);
  } catch (err) {
    console.error("Error reading projects DB:", err);
    return [];
  }
}

export function getProjectById(id: string): CaseStudy | null {
  const projects = getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function saveAllProjects(projects: CaseStudy[]): Promise<StorageWriteResult> {
  try {
    return await writeDataFile("projects.json", projects);
  } catch (err) {
    console.error("Error writing to projects DB:", err);
    return {
      success: false,
      mode: "local",
      message: "Error writing projects: " + String(err),
    };
  }
}

export async function createProject(project: CaseStudy): Promise<StorageWriteResult> {
  const projects = getAllProjects();
  const existing = projects.find((p) => p.id === project.id);
  if (existing) {
    return {
      success: false,
      mode: "local",
      message: "Project with this ID already exists",
    };
  }
  projects.unshift(project);
  return await saveAllProjects(projects);
}

export async function updateProject(id: string, updatedData: Partial<CaseStudy>): Promise<StorageWriteResult> {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return {
      success: false,
      mode: "local",
      message: "Project not found",
    };
  }
  projects[index] = { ...projects[index], ...updatedData };
  return await saveAllProjects(projects);
}

export async function deleteProject(id: string): Promise<StorageWriteResult> {
  const projects = getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) {
    return {
      success: false,
      mode: "local",
      message: "Project not found to delete",
    };
  }
  return await saveAllProjects(filtered);
}
