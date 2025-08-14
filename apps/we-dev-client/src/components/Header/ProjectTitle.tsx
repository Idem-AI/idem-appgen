import React, { useState, useRef, useEffect } from "react";
import { ProjectSidebar } from "../Sidebar/ProjectSidebar";
import { getProjectById } from "../../api/persistence/db";
import { useUrlData } from "../../hooks/useUrlData";
import { useTranslation } from "react-i18next";

export function ProjectTitle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [projectData, setProjectData] = useState<any>(null);
  const { projectId } = useUrlData({ append: () => {} });
  const { t } = useTranslation();

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

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 300);
  };

  const handleSidebarMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSidebarMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 300);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Project Icon */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {projectData?.name || "Projet"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {projectId ? `ID: ${projectId.slice(0, 8)}...` : "Aucun projet"}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isSidebarOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Project Sidebar */}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      />
    </>
  );
}
