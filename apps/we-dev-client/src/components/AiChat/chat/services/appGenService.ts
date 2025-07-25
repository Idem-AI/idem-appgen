import { AnalysisResultModel } from "@/api/persistence/models/analysisResult.model";
import { BrandIdentityModel } from "@/api/persistence/models/brand-identity.model";
import { DevelopmentConfigsModel } from "@/api/persistence/models/development.model";
import { ProjectModel } from "@/api/persistence/models/project.model";

export class WebGenService {
  generateWebsitePrompt(project: ProjectModel): string {
    console.log("Generating website prompt...");
    console.log("Project:", project);
    console.log("Analysis Result:", project.analysisResultModel);
    console.log(
      "Development Configs:",
      project.analysisResultModel.development.configs
    );

    if (!project?.description) {
      throw new Error("Project description is required");
    }

    const sections = [
      this._buildProjectOverview(project),
      this._buildUMLDiagrams(project.analysisResultModel),
      this._buildTechnicalSpecs(
        project,
        project.analysisResultModel.development.configs
      ),
      this._buildBrandGuidelines(project.analysisResultModel.branding),
      this._buildDevelopmentStack(
        project.analysisResultModel.development.configs
      ),
      this._buildContentStrategy(),
      this._buildDesignRequirements(),
      this._buildOutputRequirements(
        project.analysisResultModel.development.configs
      ),
      this._buildQualityStandards(),
    ];

    const basePrompt = sections.filter((section) => section).join("\n\n");

    return basePrompt;
  }

  private _buildProjectOverview(project: ProjectModel): string {
    return `# PROJECT OVERVIEW
**Name:** ${project.name}
**Description:** ${project.description}
**Target Audience:** ${project.targets ? JSON.stringify(project.targets) : "Not specified"}
`;
  }

  private _buildUMLDiagrams(analysisResult: AnalysisResultModel): string {
    const design = analysisResult.design;
    return `# UML DIAGRAMS & DESIGN
**Design Information:** ${design ? JSON.stringify(design, null, 2) : "No design information available"}
`;
  }

  private _buildTechnicalSpecs(
    project: ProjectModel,
    developmentConfigs: DevelopmentConfigsModel
  ): string {
    const projectConfig = developmentConfigs.projectConfig;
    const frontend = developmentConfigs.frontend;

    return `# TECHNICAL SPECIFICATIONS
**Web Technology:** ${frontend.framework.toUpperCase()} ${frontend.frameworkVersion || ""}
**Styling:** ${Array.isArray(frontend.styling) ? frontend.styling.join(", ") : frontend.styling}
${frontend.stateManagement ? `**State Management:** ${frontend.stateManagement}` : ""}

**Core Features:**
- SEO: ${projectConfig.seoEnabled ? "Advanced optimization" : "Basic"}
- Contact Form: ${projectConfig.contactFormEnabled ? "Included" : "Excluded"}
- Analytics: ${projectConfig.analyticsEnabled ? "Configured" : "Not included"}
- i18n: ${projectConfig.i18nEnabled ? "Multi-language" : "Single language"}
- Performance: ${projectConfig.performanceOptimized ? "Optimized" : "Standard"}
- Authentication: ${projectConfig.authentication ? "Enabled" : "Disabled"}
- Authorization: ${projectConfig.authorization ? "Enabled" : "Disabled"}
${projectConfig.paymentIntegration ? "- Payment Integration: Enabled" : ""}

**Frontend Features:**
${this._formatFeatures(frontend.features)}

**Requirements:**
- ${project.type === "web" ? "Mobile-first responsive design" : "Platform-specific approach"}
- Component-based architecture
- TypeScript best practices
${
  developmentConfigs.constraints.length
    ? `
**Constraints:**
${developmentConfigs.constraints.map((c) => `- ${c}`).join("\n")}`
    : ""
}`;
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

  private _buildBrandGuidelines(brand: BrandIdentityModel): string {
    return `# BRAND GUIDELINES
**Visual Identity:**
- Colors: ${JSON.stringify(brand.colors.colors)}
- Typography: ${JSON.stringify(brand.typography)}
${brand.logo?.svg ? `- Logo: ${brand.logo.svg}` : ""}
`;
  }

  private _buildDevelopmentStack(
    developmentConfigs: DevelopmentConfigsModel
  ): string {
    const { frontend, backend, database } = developmentConfigs;

    return `# DEVELOPMENT STACK
**Frontend:**
- Framework: ${frontend.framework} ${frontend.frameworkVersion || ""}
- Styling: ${Array.isArray(frontend.styling) ? frontend.styling.join(", ") : frontend.styling}
${frontend.stateManagement ? `- State Management: ${frontend.stateManagement}` : ""}

**Backend:**
- Language: ${backend.language || "Not specified"} ${backend.languageVersion || ""}
- Framework: ${backend.framework} ${backend.frameworkVersion || ""}
- API Type: ${backend.apiType} ${backend.apiVersion || ""}
${backend.orm ? `- ORM: ${backend.orm} ${backend.ormVersion || ""}` : ""}

**Database:**
- Provider: ${database.provider} ${database.version || ""}
- Type: ${database.type || "Not specified"}
${database.orm ? `- ORM: ${database.orm} ${database.ormVersion || ""}` : ""}

**Backend Features:**
${this._formatFeatures(backend.features)}

**Database Features:**
${this._formatFeatures(database.features)}`;
  }

  private _buildContentStrategy(): string {
    return `# CONTENT STRATEGY
**Structure:**
1. Hero section with clear value proposition
2. Key benefits/features
3. Social proof
4. Call-to-action

**Guidelines:**
- Concise, scannable content
- Action-oriented language
- Benefit-focused messaging`;
  }

  private _buildDesignRequirements(): string {
    return `# DESIGN REQUIREMENTS
**Principles:**
- Clean, modern aesthetic
- Strong visual hierarchy
- Strategic white space
- Consistent spacing system

**Components:**
- Responsive navigation
- Attractive hero section
- Clearly styled CTAs
- Organized content sections`;
  }

  private _buildOutputRequirements(
    developmentConfigs: DevelopmentConfigsModel
  ): string {
    const { frontend, backend, database } = developmentConfigs;

    return `# OUTPUT REQUIREMENTS
**Code Structure:**
- Well-structured ${frontend.framework} components
- TypeScript typing throughout
- Environment configuration for ${backend.framework}
- ${backend.apiType} API implementation
- ${database.provider} database integration

**Frontend Deliverables:**
- ${frontend.framework} ${frontend.frameworkVersion || ""} application
- ${Array.isArray(frontend.styling) ? frontend.styling.join(" + ") : frontend.styling} styling
${frontend.stateManagement ? `- ${frontend.stateManagement} state management setup` : ""}

**Backend Deliverables:**
- ${backend.framework} ${backend.frameworkVersion || ""} server
- ${backend.apiType} endpoints
${backend.orm ? `- ${backend.orm} ORM configuration` : ""}
- Database schema for ${database.provider}

**Documentation:**
- Setup instructions for full stack
- API documentation
- Database schema documentation
- Component documentation
- Deployment guide`;
  }

  private _buildQualityStandards(): string {
    return `# QUALITY STANDARDS
- WCAG AA accessibility
- Cross-browser compatibility
- Mobile-responsive
- Optimized performance
- Clean, maintainable code`;
  }
}
