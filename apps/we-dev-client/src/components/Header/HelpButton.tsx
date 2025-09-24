import React, { useState } from "react";
import { ProjectTutorial } from "../Onboarding/ProjectTutorial";
import { useUrlData } from "../../hooks/useUrlData";
import { getProjectById } from "../../api/persistence/db";

export function HelpButton() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const { projectId } = useUrlData({ append: () => {} });

  const handleHelpClick = async () => {
    if (projectId) {
      try {
        const project = await getProjectById(projectId);
        setProjectData(project);
        setShowTutorial(true);
      } catch (error) {
        console.error("Error loading project for tutorial:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleHelpClick}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        title="Show Tutorial"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showTutorial && projectData && (
        <ProjectTutorial
          projectData={projectData}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </>
  );
}
