import React, { useState, useEffect } from "react";
import { useUrlData } from "../../hooks/useUrlData";
import { getProjectById, getProjectGeneration } from "../../api/persistence/db";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ProjectSidebarProps) {
  const { t } = useTranslation();
  const { projectId } = useUrlData({ append: () => {} });
  const [projectData, setProjectData] = useState(null);
  const [hasGeneration, setHasGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        
        // Load project data
        const project = await getProjectById(projectId);
        if (project) {
          setProjectData(project);
          
          // Check if generation exists
          const generation = await getProjectGeneration(projectId);
          setHasGeneration(!!generation);
        }
      } catch (error) {
        console.error("Error loading project data:", error);
        toast.error("Erreur lors du chargement du projet");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projet
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-4 flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : projectData ? (
              <div className="space-y-4">
                {/* Project Name */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    {projectData.name}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {projectData.description || "Aucune description"}
                  </p>
                </div>

                {/* Generation Status */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Génération
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hasGeneration 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}>
                      {hasGeneration ? "Terminée" : "En attente"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasGeneration 
                      ? "La génération est disponible"
                      : "Aucune génération trouvée"
                    }
                  </p>
                </div>

                {/* Chat Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Chat du projet
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Discutez avec l'IA pour ce projet spécifique
                  </p>
                  
                  {/* Project-specific chat indicator */}
                  <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Chat actif pour {projectData.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Projet non trouvé</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
