import { LandingPageConfig } from "../../../../api/persistence/models/development.model";
import { ChatType } from "../../../Sidebar/ProjectSidebar";

export class MultiChatPromptService {
  
  /**
   * Generate the appropriate prompt based on LandingPageConfig and ChatType
   */
  generatePrompt(projectData: any, chatType: ChatType): string {
    const landingPageConfig = projectData.analysisResultModel?.development?.configs?.landingPageConfig || LandingPageConfig.NONE;
    
    switch (landingPageConfig) {
      case LandingPageConfig.SEPARATE:
        return this.generateSeparatePrompt(projectData, chatType);
      
      case LandingPageConfig.INTEGRATED:
        return this.generateIntegratedPrompt(projectData);
      
      case LandingPageConfig.ONLY_LANDING:
        return this.generateLandingOnlyPrompt(projectData);
      
      case LandingPageConfig.NONE:
      default:
        return this.generateAppOnlyPrompt(projectData);
    }
  }

  /**
   * Generate prompt for SEPARATE config (two separate chats)
   */
  private generateSeparatePrompt(projectData: any, chatType: ChatType): string {
    const baseInfo = this.getBaseProjectInfo(projectData);
    const techStack = this.getTechStackInfo(projectData);
    
    if (chatType === ChatType.LANDING_PAGE) {
      return `# Separate Landing Page Generation

${baseInfo}

## Objective
Create a separate and independent landing page to present the "${projectData.name}" project.

## Landing Page Specifications
- **Type**: Marketing landing page separate from the application
- **Goal**: Present the product, convert visitors to users
- **Integration**: Link to main application but separate codebase

## Recommended Technologies
${techStack}

## Sections to Include
1. **Hero Section**: Catchy title, subtitle, primary CTA
2. **Features**: Main product features
3. **Benefits**: User advantages
4. **Social Proof**: Testimonials, client logos (if applicable)
5. **Pricing**: Pricing plans (if applicable)
6. **Footer**: Useful links, contact, legal notices

## Constraints
${this.getConstraints(projectData)}

## Instructions
- Create a modern and responsive landing page
- Optimize for conversion and SEO
- Use subtle animations and attractive design
- Include clear CTAs to the application
- Ensure design consistency with brand identity

Generate the complete landing page code with all necessary files.`;
    } else {
      return `# Application Generation (Separate Configuration)

${baseInfo}

## Objective
Create the main "${projectData.name}" application without integrated landing page.

## Application Specifications
- **Type**: Complete web application
- **Landing Page**: Separate (managed in another chat)
- **Focus**: Business features and user interface

## Technologies
${techStack}

## Features to Develop
${this.getFeatures(projectData)}

## Constraints
${this.getConstraints(projectData)}

## Instructions
- Create a complete and functional web application
- Implement all required business features
- Ensure excellent UX/UI
- Optimize performance and security
- Include authentication and user management
- Landing page will be managed separately

Generate the complete application code with all necessary files.`;
    }
  }

  /**
   * Generate prompt for INTEGRATED config (single chat with landing page included)
   */
  private generateIntegratedPrompt(projectData: any): string {
    const baseInfo = this.getBaseProjectInfo(projectData);
    const techStack = this.getTechStackInfo(projectData);
    
    return `# Application Generation with Integrated Landing Page

${baseInfo}

## Objective
Create a complete "${projectData.name}" web application with integrated landing page.

## Architecture
- **Type**: Monolithic application with integrated landing page
- **Structure**: Landing page + Application in the same project
- **Routing**: Separate routes for landing (/), app (/app/*, /dashboard/*, etc.)

## Technologies
${techStack}

## Integrated Landing Page Sections
1. **Hero Section**: Product presentation
2. **Features**: Main features
3. **Benefits**: User advantages
4. **CTA**: Buttons to signup/login
5. **Footer**: Legal information

## Application Features
${this.getFeatures(projectData)}

## Constraints
${this.getConstraints(projectData)}

## Instructions
- Create a complete application with integrated landing page
- Use a routing system to separate landing and app
- Ensure smooth transition between landing and application
- Implement authentication with appropriate redirection
- Optimize for SEO on the landing page
- Maintain design consistency between landing and app

Generate the complete code with integrated landing page and all features.`;
  }

  /**
   * Generate prompt for ONLY_LANDING config (landing page only)
   */
  private generateLandingOnlyPrompt(projectData: any): string {
    const baseInfo = this.getBaseProjectInfo(projectData);
    const techStack = this.getTechStackInfo(projectData);
    
    return `# Landing Page Generation Only

${baseInfo}

## Objective
Create a standalone landing page for "${projectData.name}" without any application functionality.

## Specifications
- **Type**: Marketing landing page only
- **Application**: None - pure landing page
- **Focus**: Conversion, presentation, and marketing

## Technologies
${techStack}

## Landing Page Sections
1. **Hero Section**: Compelling headline, value proposition, primary CTA
2. **Features**: Key product features and benefits
3. **Social Proof**: Testimonials, reviews, client logos
4. **Pricing**: Pricing plans and packages (if applicable)
5. **About**: Company/product information
6. **Contact**: Contact form and information
7. **Footer**: Legal links, social media, additional info

## Constraints
${this.getConstraints(projectData)}

## Instructions
- Create a high-converting standalone landing page
- Focus on marketing and conversion optimization
- Implement modern design with smooth animations
- Optimize for SEO and performance
- Include clear call-to-action buttons
- Make it fully responsive across all devices
- No application functionality needed

Generate the complete landing page code with all necessary files.`;
  }

  /**
   * Generate prompt for NONE config (application only)
   */
  private generateAppOnlyPrompt(projectData: any): string {
    const baseInfo = this.getBaseProjectInfo(projectData);
    const techStack = this.getTechStackInfo(projectData);
    
    return `# Web Application Generation

${baseInfo}

## Objective
Create the "${projectData.name}" web application without landing page.

## Specifications
- **Type**: Pure web application
- **Landing Page**: None
- **Focus**: User interface and business features only

## Technologies
${techStack}

## Features to Develop
${this.getFeatures(projectData)}

## Constraints
${this.getConstraints(projectData)}

## Instructions
- Create a complete and functional web application
- Start directly with authentication interface or dashboard
- Implement all required business features
- Ensure excellent UX/UI
- Optimize performance and security
- Include complete user management

Generate the complete application code with all necessary files.`;
  }

  /**
   * Get base project information
   */
  private getBaseProjectInfo(projectData: any): string {
    return `## Project Information
- **Name**: ${projectData.name}
- **Description**: ${projectData.description || 'No description provided'}
- **Type**: ${projectData.type || 'web'}
- **Team**: ${projectData.teamSize || 'Not specified'}
- **Scope**: ${projectData.scope || 'Not specified'}`;
  }

  /**
   * Get technology stack information
   */
  private getTechStackInfo(projectData: any): string {
    const techStack = projectData.analysisResultModel?.development?.configs?.techStack;
    if (!techStack) return '- No technology specified';
    
    return Object.entries(techStack)
      .map(([key, value]) => `- **${key}**: ${value}`)
      .join('\n');
  }

  /**
   * Get project features
   */
  private getFeatures(projectData: any): string {
    const features = projectData.analysisResultModel?.development?.features;
    if (!features || features.length === 0) return '- No features specified';
    
    return features.map((feature: any) => `- ${feature.name}: ${feature.description}`).join('\n');
  }

  /**
   * Get project constraints
   */
  private getConstraints(projectData: any): string {
    const constraints = projectData.constraints || [];
    if (constraints.length === 0) return '- Aucune contrainte spécifique';
    
    return constraints.map((constraint: string) => `- ${constraint}`).join('\n');
  }
}
