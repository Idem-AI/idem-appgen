import { ProjectModel } from "../types/project";

const IDEM_API_BASE_URL = process.env.IDEM_API_BASE_URL || "http://localhost:3001";

/**
 * Fetch project data from IDEM API
 */
export async function fetchProjectById(projectId: string): Promise<ProjectModel | null> {
  try {
    const response = await fetch(`${IDEM_API_BASE_URL}/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Project not found: ${projectId}`);
        return null;
      }
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    const project: ProjectModel = await response.json();
    console.log(`Project fetched successfully: ${project.name}`);
    return project;
  } catch (error) {
    console.error("Error fetching project from IDEM API:", error);
    throw error;
  }
}
