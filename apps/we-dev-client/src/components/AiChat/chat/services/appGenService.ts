import { AnalysisResultModel } from "@/api/persistence/models/analysisResult.model";
import { BrandIdentityModel } from "@/api/persistence/models/brand-identity.model";
import { DevelopmentConfigsModel } from "@/api/persistence/models/development.model";
import { ProjectModel } from "@/api/persistence/models/project.model";

export class WebGenService {
  generateWebsitePrompt(project: ProjectModel): string {
    if (!project?.description) {
      throw new Error("Project description is required");
    }

    const sections = [
      this._buildProjectOverview(project),
      this._buildEssentialTechSpecs(
        project,
        project.analysisResultModel.development.configs
      ),
      this._buildBriefBrandGuidelines(project.analysisResultModel.branding),
    ];

    const basePrompt = sections.filter((section) => section).join("\n\n");

    return basePrompt;
  }

  private _buildProjectOverview(project: ProjectModel): string {
    return `# PROJECT OVERVIEW
**Name:** ${project.name}
**Description:** ${project.description}
${project.targets ? `**Target:** ${Array.isArray(project.targets) ? project.targets.join(", ") : project.targets}` : ""}
`;
  }

  // Méthode retirée pour réduire la taille du prompt

  private _buildEssentialTechSpecs(
    project: ProjectModel,
    developmentConfigs: DevelopmentConfigsModel
  ): string {
    const projectConfig = developmentConfigs.projectConfig;
    const frontend = developmentConfigs.frontend;
    const backend = developmentConfigs.backend;

    return `# TECH STACK
**Frontend:** ${frontend.framework} ${frontend.frameworkVersion || ""} / ${Array.isArray(frontend.styling) ? frontend.styling.join(", ") : frontend.styling}
**Backend:** ${backend.language || "Not specified"} ${backend.framework || ""}

**Key Features:**
Authentication: ${projectConfig.authentication == true ? "yes" : "no"}
Authorization: ${projectConfig.authorization == true ? "yes" : "no"}
Payment Integration: ${projectConfig.paymentIntegration == true ? "yes" : "no"}
Multi-language support: ${projectConfig.i18nEnabled == true ? "yes" : "no"}

**Type:** ${project.type || "Not specified"}
`;
  }

  private _formatFeatures(
    features: { [key: string]: boolean | undefined } | string[]
  ): string {
    if (Array.isArray(features)) {
      return features.map((feature) => `- ${feature}`).join("\n");
    }

    return Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(
        ([feature]) => `- ${feature.charAt(0).toUpperCase() + feature.slice(1)}`
      )
      .join("\n");
  }

  private _buildBriefBrandGuidelines(brand: BrandIdentityModel): string {
    const colors = brand.colors.colors
      ? Array.isArray(brand.colors.colors)
        ? JSON.stringify(brand.colors.colors.slice(0, 3))
        : JSON.stringify(brand.colors.colors)
      : "Not specified";

    const typography =
      typeof brand.typography === "object" && brand.typography !== null
        ? JSON.stringify(brand.typography).substring(0, 50) + "..."
        : "Not specified";

    return `# BRAND
**Colors:** ${colors}
**Typography:** ${typography}
`;
  }
}
