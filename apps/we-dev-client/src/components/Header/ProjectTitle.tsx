import React, { useState, useEffect } from "react";
import { getProjectById } from "../../api/persistence/db";
import { useUrlData } from "../../hooks/useUrlData";

export function ProjectTitle() {
  const [projectData, setProjectData] = useState<any>(null);
  const { projectId } = useUrlData({ append: () => {} });

  // Load project data
  const loadProjectData = async () => {
    if (!projectId) return;
    
    try {
      const project = await getProjectById(projectId);
      setProjectData(project);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  return (
    <div className="flex items-center space-x-3 px-3 py-2">
      {/* Project Icon */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Project Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {projectData?.name || "Project"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Generation Workspace
        </div>
      </div>

      {/* Generation Status Badge */}
      <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
        Active Project
      </div>
    </div>
  );
}
