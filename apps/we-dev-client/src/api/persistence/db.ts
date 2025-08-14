import type { ProjectModel } from "./models/project.model";
import type { UserModel } from "./userModel";

/**
 * Define the base URL for your API.
 * It's recommended to use an environment variable for this.
 */
const API_BASE_URL =
  import.meta.env.IDEM_API_BASE_URL || "http://localhost:3001/api";

export async function getCurrentUser(): Promise<UserModel | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("User not authenticated");
        return null;
      }

      console.error("Error fetching current user:", response.statusText);

      return null;
    }

    const user = (await response.json()) as UserModel;
    console.log(user);

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function checkAuth(): Promise<void> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return Promise.reject(new Error("User not authenticated"));
  }

  return Promise.resolve();
}

export async function getProjectById(
  projectId: string
): Promise<ProjectModel | null> {
  try {
    await checkAuth();

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      credentials: "include",
    });

    if (response.status === 404) {
      console.warn("Project not found:", projectId);
      return null;
    }

    if (!response.ok) {
      console.error("Error getting project from API:", response.statusText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as ProjectModel;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
}

export async function getUserProjects(): Promise<ProjectModel[] | null> {
  try {
    await checkAuth();

    const response = await fetch(`${API_BASE_URL}/projects`, {
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error getting projects from API:", response.statusText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as ProjectModel[];
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
}
