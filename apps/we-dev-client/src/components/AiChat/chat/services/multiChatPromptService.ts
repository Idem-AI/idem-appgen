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
      return `# Génération de Landing Page Séparée

${baseInfo}

## Objectif
Créer une landing page séparée et indépendante pour présenter le projet "${projectData.name}".

## Spécifications de la Landing Page
- **Type**: Page d'accueil marketing séparée de l'application
- **Objectif**: Présenter le produit, convertir les visiteurs en utilisateurs
- **Intégration**: Lien vers l'application principale mais code séparé

## Technologies Recommandées
${techStack}

## Sections à Inclure
1. **Hero Section**: Titre accrocheur, sous-titre, CTA principal
2. **Features**: Principales fonctionnalités du produit
3. **Benefits**: Avantages pour les utilisateurs
4. **Social Proof**: Témoignages, logos clients (si applicable)
5. **Pricing**: Plans tarifaires (si applicable)
6. **Footer**: Liens utiles, contact, mentions légales

## Contraintes
${this.getConstraints(projectData)}

## Instructions
- Créez une landing page moderne et responsive
- Optimisez pour la conversion et le SEO
- Utilisez des animations subtiles et un design attractif
- Incluez des CTA clairs vers l'application
- Assurez-vous que le design soit cohérent avec l'identité de marque

Générez le code complet de la landing page avec tous les fichiers nécessaires.`;
    } else {
      return `# Génération d'Application (Configuration Séparée)

${baseInfo}

## Objectif
Créer l'application principale "${projectData.name}" sans landing page intégrée.

## Spécifications de l'Application
- **Type**: Application web complète
- **Landing Page**: Séparée (gérée dans un autre chat)
- **Focus**: Fonctionnalités métier et interface utilisateur

## Technologies
${techStack}

## Fonctionnalités à Développer
${this.getFeatures(projectData)}

## Contraintes
${this.getConstraints(projectData)}

## Instructions
- Créez une application web complète et fonctionnelle
- Implémentez toutes les fonctionnalités métier requises
- Assurez-vous d'une UX/UI excellente
- Optimisez les performances et la sécurité
- Incluez l'authentification et la gestion des utilisateurs
- La landing page sera gérée séparément

Générez le code complet de l'application avec tous les fichiers nécessaires.`;
    }
  }

  /**
   * Generate prompt for INTEGRATED config (single chat with landing page included)
   */
  private generateIntegratedPrompt(projectData: any): string {
    const baseInfo = this.getBaseProjectInfo(projectData);
    const techStack = this.getTechStackInfo(projectData);
    
    return `# Génération d'Application avec Landing Page Intégrée

${baseInfo}

## Objectif
Créer une application web complète "${projectData.name}" avec landing page intégrée.

## Architecture
- **Type**: Application monolithique avec landing page intégrée
- **Structure**: Landing page + Application dans le même projet
- **Routing**: Routes séparées pour landing (/), app (/app/*, /dashboard/*, etc.)

## Technologies
${techStack}

## Sections de la Landing Page Intégrée
1. **Hero Section**: Présentation du produit
2. **Features**: Fonctionnalités principales
3. **Benefits**: Avantages utilisateurs
4. **CTA**: Boutons vers inscription/connexion
5. **Footer**: Informations légales

## Fonctionnalités de l'Application
${this.getFeatures(projectData)}

## Contraintes
${this.getConstraints(projectData)}

## Instructions
- Créez une application complète avec landing page intégrée
- Utilisez un système de routing pour séparer landing et app
- Assurez-vous d'une transition fluide entre landing et application
- Implémentez l'authentification avec redirection appropriée
- Optimisez pour SEO sur la landing page
- Maintenez une cohérence de design entre landing et app

Générez le code complet avec landing page intégrée et toutes les fonctionnalités.`;
  }

  /**
   * Generate prompt for NONE config (application only)
   */
  private generateAppOnlyPrompt(projectData: any): string {
    const baseInfo = this.getBaseProjectInfo(projectData);
    const techStack = this.getTechStackInfo(projectData);
    
    return `# Génération d'Application Web

${baseInfo}

## Objectif
Créer l'application web "${projectData.name}" sans landing page.

## Spécifications
- **Type**: Application web pure
- **Landing Page**: Aucune
- **Focus**: Interface utilisateur et fonctionnalités métier uniquement

## Technologies
${techStack}

## Fonctionnalités à Développer
${this.getFeatures(projectData)}

## Contraintes
${this.getConstraints(projectData)}

## Instructions
- Créez une application web complète et fonctionnelle
- Commencez directement par l'interface d'authentification ou dashboard
- Implémentez toutes les fonctionnalités métier requises
- Assurez-vous d'une excellente UX/UI
- Optimisez les performances et la sécurité
- Incluez la gestion complète des utilisateurs

Générez le code complet de l'application avec tous les fichiers nécessaires.`;
  }

  /**
   * Get base project information
   */
  private getBaseProjectInfo(projectData: any): string {
    return `## Informations du Projet
- **Nom**: ${projectData.name}
- **Description**: ${projectData.description || 'Aucune description fournie'}
- **Type**: ${projectData.type || 'web'}
- **Équipe**: ${projectData.teamSize || 'Non spécifié'}
- **Portée**: ${projectData.scope || 'Non spécifiée'}`;
  }

  /**
   * Get technology stack information
   */
  private getTechStackInfo(projectData: any): string {
    const configs = projectData.analysisResultModel?.development?.configs;
    if (!configs) return '- Technologies par défaut recommandées';

    let techStack = '';
    
    if (configs.frontend) {
      techStack += `- **Frontend**: ${configs.frontend.framework}`;
      if (configs.frontend.frameworkVersion) {
        techStack += ` v${configs.frontend.frameworkVersion}`;
      }
      techStack += `\n- **Styling**: ${Array.isArray(configs.frontend.styling) ? configs.frontend.styling.join(', ') : configs.frontend.styling}\n`;
    }

    if (configs.backend) {
      techStack += `- **Backend**: ${configs.backend.framework}`;
      if (configs.backend.frameworkVersion) {
        techStack += ` v${configs.backend.frameworkVersion}`;
      }
      techStack += `\n- **API**: ${configs.backend.apiType}\n`;
    }

    if (configs.database) {
      techStack += `- **Base de données**: ${configs.database.provider}`;
      if (configs.database.version) {
        techStack += ` v${configs.database.version}`;
      }
      techStack += '\n';
    }

    return techStack || '- Technologies par défaut recommandées';
  }

  /**
   * Get project features
   */
  private getFeatures(projectData: any): string {
    const configs = projectData.analysisResultModel?.development?.configs;
    if (!configs) return '- Fonctionnalités de base à implémenter';

    let features = '';
    
    if (configs.projectConfig) {
      const config = configs.projectConfig;
      if (config.authentication) features += '- Authentification utilisateur\n';
      if (config.authorization) features += '- Gestion des autorisations\n';
      if (config.seoEnabled) features += '- Optimisation SEO\n';
      if (config.contactFormEnabled) features += '- Formulaire de contact\n';
      if (config.analyticsEnabled) features += '- Analytics intégrés\n';
      if (config.i18nEnabled) features += '- Internationalisation\n';
      if (config.performanceOptimized) features += '- Optimisation des performances\n';
      if (config.paymentIntegration) features += '- Intégration de paiement\n';
    }

    // Add frontend features
    if (configs.frontend?.features) {
      const frontendFeatures = configs.frontend.features;
      if (typeof frontendFeatures === 'object') {
        if (frontendFeatures.routing) features += '- Système de routing\n';
        if (frontendFeatures.componentLibrary) features += '- Bibliothèque de composants\n';
        if (frontendFeatures.testing) features += '- Tests automatisés\n';
        if (frontendFeatures.pwa) features += '- Progressive Web App\n';
      }
    }

    // Add backend features
    if (configs.backend?.features) {
      const backendFeatures = configs.backend.features;
      if (typeof backendFeatures === 'object') {
        if (backendFeatures.documentation) features += '- Documentation API\n';
        if (backendFeatures.logging) features += '- Système de logs\n';
      }
    }

    return features || '- Fonctionnalités de base à implémenter';
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
