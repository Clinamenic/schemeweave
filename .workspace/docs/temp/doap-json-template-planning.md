# DOAP JSON Template Implementation Plan

## Objective

To establish `doap.json` as the **fundamental source of truth** for project metadata in `@starter-permadapp/`, with integrated automation for version management, deployment tracking, and changelog synchronization.

## Core Architecture Principles

### 1. DOAP.json as Source of Truth
- **Primary Metadata**: All project details (name, description, version, etc.) originate from `doap.json`
- **Script Integration**: Version bump and deployment scripts read from and update `doap.json`
- **Deployment Tracking**: Maintains array of site deployments with versions, Arweave hashes, and links
- **Changelog Integration**: Synchronizes with `CHANGELOG.md` for verbose commit history

### 2. Template System
- **Project Initialization**: `.cursor/rules/project_initialization.mdc` guides placeholder replacement
- **Reference Documentation**: `.workspace/docs/ref/reference.doap.json` provides vocabulary and schema reference
- **Automated Integration**: Scripts automatically update `doap.json` during version bumps and deployments

## Analysis of Existing Projects

Based on examination of `@Autoglypha/` and `@lattelier/` projects, the following common attributes have been identified:

### Project Characteristics
- **Technology Stack**: React + TypeScript + Vite applications
- **Deployment**: Arweave-based permanent web applications
- **Architecture**: Client-side web applications with modern build tools
- **Versioning**: Semantic versioning (e.g., 0.2.0, 0.3.0)
- **Licensing**: MIT license
- **Repository Structure**: GitHub-based with standardized scripts

### Key Metadata Requirements
- Project name and description
- Version information
- Technology stack details
- Repository and homepage URLs
- Author/maintainer information
- License information
- Issue tracking and documentation links
- Deployment information (Arweave-specific)

## Vocabulary Standards

The template utilizes established vocabularies for maximum interoperability:

- **Schema.org**: Primary vocabulary for software applications and related entities
- **DOAP (Description of a Project)**: RDF schema for software project metadata
- **JSON-LD**: Linked data format for structured metadata

## DOAP JSON Template

```json
{
  "@context": [
    "https://schema.org/",
    "http://usefulinc.com/ns/doap#"
  ],
  "@type": "SoftwareApplication",
  "name": "{{PROJECT_NAME}}",
  "description": "{{PROJECT_DESCRIPTION}}",
  "url": "{{PROJECT_HOMEPAGE_URL}}",
  "version": "{{PROJECT_VERSION}}",
  "dateCreated": "{{CREATION_DATE}}",
  "dateModified": "{{LAST_MODIFIED_DATE}}",
  "license": "https://opensource.org/licenses/MIT",
  "programmingLanguage": [
    "TypeScript",
    "JavaScript"
  ],
  "runtimePlatform": "Web Browser",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Any",
  "author": {
    "@type": "Person",
    "name": "{{AUTHOR_NAME}}",
    "email": "{{AUTHOR_EMAIL}}",
    "url": "{{AUTHOR_URL}}"
  },
  "maintainer": {
    "@type": "Person",
    "name": "{{MAINTAINER_NAME}}",
    "email": "{{MAINTAINER_EMAIL}}"
  },
  "contributor": [
    {
      "@type": "Person",
      "name": "{{CONTRIBUTOR_NAME}}",
      "email": "{{CONTRIBUTOR_EMAIL}}"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "{{ORGANIZATION_NAME}}",
    "url": "{{ORGANIZATION_URL}}"
  },
  "repository": {
    "@type": "SoftwareSourceCode",
    "url": "{{REPOSITORY_URL}}",
    "programmingLanguage": "TypeScript",
    "license": "https://opensource.org/licenses/MIT",
    "codeRepository": "{{REPOSITORY_URL}}"
  },
  "issueTracker": "{{ISSUE_TRACKER_URL}}",
  "homepage": "{{HOMEPAGE_URL}}",
  "downloadUrl": "{{DOWNLOAD_URL}}",
  "releaseNotes": "{{RELEASE_NOTES_URL}}",
  "documentation": "{{DOCUMENTATION_URL}}",
  "keywords": [
    "{{KEYWORD_1}}",
    "{{KEYWORD_2}}",
    "{{KEYWORD_3}}"
  ],
  "featureList": [
    "{{FEATURE_1}}",
    "{{FEATURE_2}}",
    "{{FEATURE_3}}"
  ],
  "softwareRequirements": [
    {
      "@type": "SoftwareApplication",
      "name": "Node.js",
      "version": "18+"
    },
    {
      "@type": "SoftwareApplication", 
      "name": "npm",
      "version": "8+"
    }
  ],
  "deployments": [
    {
      "@type": "WebSite",
      "version": "{{DEPLOYMENT_VERSION}}",
      "url": "{{DEPLOYMENT_URL}}",
      "transactionId": "{{ARWEAVE_TX_ID}}",
      "arweaveUrl": "https://arweave.net/{{ARWEAVE_TX_ID}}",
      "deploymentDate": "{{DEPLOYMENT_DATE}}",
      "environment": "{{DEPLOYMENT_ENV}}",
      "description": "Permanent deployment on Arweave permaweb",
      "hostingProvider": "Arweave"
    }
  ],
  "buildSystem": {
    "@type": "SoftwareApplication",
    "name": "Vite",
    "version": "5.0+"
  },
  "dependencies": [
    {
      "@type": "SoftwareApplication",
      "name": "React",
      "version": "18.2.0"
    },
    {
      "@type": "SoftwareApplication",
      "name": "TypeScript",
      "version": "5.3+"
    }
  ],
  "changelog": {
    "@type": "WebPage",
    "url": "{{CHANGELOG_URL}}",
    "description": "Project changelog with version history and commit details"
  },
  "relatedProjects": [
    {
      "@type": "SoftwareApplication",
      "name": "{{RELATED_PROJECT_NAME}}",
      "url": "{{RELATED_PROJECT_URL}}",
      "description": "{{RELATED_PROJECT_DESCRIPTION}}"
    }
  ],
  "funding": {
    "@type": "MonetaryGrant",
    "funder": {
      "@type": "Organization",
      "name": "{{FUNDER_NAME}}"
    }
  }
}
```

## Template Variables

The template uses placeholder variables that should be replaced with actual project-specific values:

### Required Variables
- `{{PROJECT_NAME}}`: Official project name
- `{{PROJECT_DESCRIPTION}}`: Brief project description
- `{{PROJECT_VERSION}}`: Current semantic version
- `{{AUTHOR_NAME}}`: Primary author name
- `{{REPOSITORY_URL}}`: Source code repository URL

### Optional Variables
- `{{PROJECT_HOMEPAGE_URL}}`: Project homepage
- `{{AUTHOR_EMAIL}}`: Author contact email
- `{{MAINTAINER_NAME}}`: Project maintainer
- `{{CONTRIBUTOR_NAME}}`: Additional contributors
- `{{ORGANIZATION_NAME}}`: Publishing organization
- `{{ISSUE_TRACKER_URL}}`: Issue tracking system
- `{{DOCUMENTATION_URL}}`: Project documentation
- `{{DEPLOYMENT_URL}}`: Live deployment URL
- `{{KEYWORD_X}}`: Relevant keywords
- `{{FEATURE_X}}`: Key project features

## Script Integration Architecture

### 1. Version Bump Integration
The existing `version-bump.sh` script will be enhanced to:
- **Read from doap.json**: Extract current version from `doap.json` instead of `package.json`
- **Update doap.json**: Write new version to `doap.json` as source of truth
- **Sync package.json**: Update `package.json` from `doap.json` values
- **Update dateModified**: Automatically update the `dateModified` field
- **Changelog Integration**: Trigger changelog updates based on `doap.json` version changes

### 2. Deployment Integration
The `deploy-to-arweave.sh` script will be enhanced to:
- **Read Project Metadata**: Extract project name, version, and description from `doap.json`
- **Update Deployments Array**: Add new deployment record to `deployments` array
- **Version Tracking**: Link deployments to specific semantic versions
- **Arweave Integration**: Store transaction IDs and URLs in `doap.json`
- **Environment Tracking**: Distinguish between dev/prod deployments

### 3. Changelog Synchronization
- **Version Consistency**: Ensure `CHANGELOG.md` versions match `doap.json` versions
- **Metadata Extraction**: Use `doap.json` as source for project name and description in changelog
- **Deployment References**: Link changelog entries to specific deployments

### 4. Build Process Integration
The build process will be enhanced to inject `doap.json` metadata into HTML:
- **Vite Plugin**: Custom plugin to read `doap.json` and inject metadata into HTML `<head>`
- **Template Variables**: Replace placeholders in `index.html` with actual project metadata
- **SEO Optimization**: Automatic generation of meta tags, Open Graph, and Twitter Card data
- **Deployment Info**: Include version and deployment information in HTML

## Implementation Guidelines

### 1. Template Customization
- **Project Initialization Rule**: Create `.cursor/rules/project_initialization.mdc` with placeholder replacement instructions
- **Reference Documentation**: Create `.workspace/docs/ref/reference.doap.json` as comprehensive schema reference
- **Automated Replacement**: Use AI assistant to replace placeholders based on user directives

### 2. Script Modifications
- **version-bump.sh Enhancement**: Modify to read/write `doap.json` as primary source
- **deploy-to-arweave.sh Enhancement**: Add deployment tracking to `doap.json`
- **New Scripts**: Create `doap-sync.sh` for synchronizing `doap.json` with other files

### 3. Build Process Enhancement
- **Vite Plugin Development**: Create custom plugin for `doap.json` metadata injection
- **HTML Template Updates**: Modify `index.html` to include metadata placeholders
- **Build Integration**: Integrate metadata injection into primary build process

### 4. Validation and Maintenance
- **JSON Schema Validation**: Create schema for `doap.json` structure validation
- **Automated Sync**: Scripts to keep `package.json`, `README.md`, etc. in sync with `doap.json`
- **Version Consistency**: Ensure all version references point to `doap.json`

## Usage Examples

### For Autoglypha Project
```json
{
  "@context": [
    "https://schema.org/",
    "http://usefulinc.com/ns/doap#"
  ],
  "@type": "SoftwareApplication",
  "name": "Autoglypha",
  "description": "Glyph-based Cellular Automata Animation - Modern React/TypeScript version",
  "version": "0.2.0",
  "programmingLanguage": ["TypeScript", "JavaScript"],
  "applicationCategory": "WebApplication",
  "keywords": ["cellular-automata", "glyphs", "animation", "react", "typescript"],
  "featureList": [
    "Image Upload and Processing",
    "Interactive Configuration",
    "Animation Modes",
    "Real-time Preview",
    "Responsive Design"
  ]
}
```

### For Lattelier Project
```json
{
  "@context": [
    "https://schema.org/",
    "http://usefulinc.com/ns/doap#"
  ],
  "@type": "SoftwareApplication",
  "name": "Lattelier",
  "description": "Professional web-based lattice distortion and pattern generation tool",
  "version": "0.3.0",
  "programmingLanguage": ["TypeScript", "JavaScript"],
  "applicationCategory": "WebApplication",
  "keywords": ["lattice", "distortion", "patterns", "graphics", "react", "typescript"],
  "featureList": [
    "Interactive Grid Generation",
    "Well-Based Deformation",
    "Advanced Distortion Controls",
    "Multiple Export Options",
    "Professional Workflow"
  ]
}
```

## Build Process Integration Details

### **HTML Template Structure**
The `index.html` template will include metadata placeholders:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Basic SEO -->
  <title>{{PROJECT_NAME}} - {{PROJECT_DESCRIPTION}}</title>
  <meta name="description" content="{{PROJECT_DESCRIPTION}}">
  <meta name="keywords" content="{{KEYWORDS}}">
  
  <!-- Project Info -->
  <meta name="application-name" content="{{PROJECT_NAME}}">
  <meta name="version" content="{{PROJECT_VERSION}}">
  <meta name="author" content="{{AUTHOR_NAME}}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="{{PROJECT_NAME}}">
  <meta property="og:description" content="{{PROJECT_DESCRIPTION}}">
  <meta property="og:url" content="{{PROJECT_URL}}">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{{PROJECT_NAME}}">
  <meta name="twitter:description" content="{{PROJECT_DESCRIPTION}}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="{{PROJECT_URL}}">
  
  <!-- Deployment Info -->
  <meta name="deployment-version" content="{{PROJECT_VERSION}}">
  <meta name="deployment-date" content="{{DEPLOYMENT_DATE}}">
  
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### **Vite Plugin Implementation**
Create a custom Vite plugin for metadata injection:

```typescript
// plugins/doap-metadata.ts
import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export function doapMetadataPlugin(options: {
  doapPath: string
}): Plugin {
  return {
    name: 'doap-metadata',
    transformIndexHtml: {
      enforce: 'pre',
      transform(html, context) {
        // Read doap.json
        const doapData = JSON.parse(fs.readFileSync(options.doapPath, 'utf8'))
        
        // Extract metadata
        const metadata = {
          PROJECT_NAME: doapData.name,
          PROJECT_DESCRIPTION: doapData.description,
          PROJECT_VERSION: doapData.version,
          AUTHOR_NAME: doapData.author?.name,
          PROJECT_URL: doapData.url,
          KEYWORDS: doapData.keywords?.join(', '),
          DEPLOYMENT_DATE: new Date().toISOString()
        }
        
        // Replace placeholders in HTML
        let processedHtml = html
        Object.entries(metadata).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`
          processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), value || '')
        })
        
        return processedHtml
      }
    }
  }
}
```

### **Vite Configuration Integration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { doapMetadataPlugin } from './plugins/doap-metadata'

export default defineConfig({
  plugins: [
    react(),
    doapMetadataPlugin({
      doapPath: './doap.json'
    })
  ]
})
```

## Implementation Order

### Phase 1: Core Infrastructure
1. **Create Template Files**:
   - `doap.json` template in starter-permadapp root
   - `.workspace/docs/ref/reference.doap.json` (comprehensive schema reference)
   - `.cursor/rules/project_initialization.mdc` (placeholder replacement guide)

2. **Script Enhancement**:
   - Modify `version-bump.sh` to use `doap.json` as source of truth
   - Enhance `deploy-to-arweave.sh` to update deployments array
   - Create `doap-sync.sh` for cross-file synchronization

3. **Build Process Integration**:
   - Create Vite plugin for `doap.json` metadata injection
   - Update `index.html` template with metadata placeholders
   - Integrate plugin into `vite.config.ts`

### Phase 2: Project Integration
4. **Starter-Permadapp Implementation**:
   - Replace placeholders in starter-permadapp `doap.json`
   - Test script integrations
   - Validate version bump and deployment workflows
   - Test build process with metadata injection

5. **Reference Projects**:
   - Create `doap.json` for Autoglypha project
   - Create `doap.json` for Lattelier project
   - Test deployment tracking and version management
   - Validate HTML metadata injection

### Phase 3: Documentation and Standards
6. **Documentation Updates**:
   - Update README files to reference `doap.json` metadata
   - Create usage guidelines for template customization
   - Document script integration patterns
   - Document build process metadata injection

7. **Validation and Maintenance**:
   - Create JSON schema for `doap.json` validation
   - Establish conventions for metadata maintenance
   - Create automated sync procedures
   - Test HTML metadata injection across different projects

## File Structure

```
starter-permadapp/
├── doap.json                          # Template with placeholders
├── index.html                         # HTML template with metadata placeholders
├── vite.config.ts                     # Enhanced with doap-metadata plugin
├── plugins/
│   └── doap-metadata.ts              # Vite plugin for metadata injection
├── .workspace/
│   ├── docs/
│   │   ├── ref/
│   │   │   └── reference.doap.json    # Comprehensive schema reference
│   │   └── temp/
│   │       └── doap-json-template-planning.md
│   └── scripts/
│       ├── version-bump.sh            # Enhanced to use doap.json
│       ├── deploy-to-arweave.sh       # Enhanced to track deployments
│       └── doap-sync.sh              # New: sync doap.json with other files
└── .cursor/
    └── rules/
        └── project_initialization.mdc # Placeholder replacement guide
```

## Success Criteria

- **Version Management**: `doap.json` serves as single source of truth for version information
- **Deployment Tracking**: All Arweave deployments automatically recorded in `doap.json`
- **Changelog Integration**: Version changes in `doap.json` trigger changelog updates
- **Template System**: New projects can easily initialize with placeholder replacement
- **Script Integration**: All existing workflows (version bump, deployment) work seamlessly with `doap.json`
- **Build Process Integration**: HTML metadata automatically generated from `doap.json` during build
- **SEO Optimization**: Complete meta tags, Open Graph, and Twitter Card data generated automatically
- **Deployment Metadata**: Version and deployment information included in HTML head

## References

- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [DOAP Vocabulary](http://usefulinc.com/ns/doap#)
- [JSON-LD Specification](https://json-ld.org/)
- [Semantic Versioning](https://semver.org/)
