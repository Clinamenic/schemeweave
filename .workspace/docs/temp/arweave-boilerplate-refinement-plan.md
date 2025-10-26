# Arweave Boilerplate Refinement Plan

**Date:** 2025-10-17  
**Status:** Planning  
**Purpose:** Transform starter-permadapp into a robust, generalized template for Arweave web applications

## Executive Summary

Based on successful development and deployment of Lattelier, we now have real-world insights into what an Arweave permadapp boilerplate needs. The current `starter-permadapp` workspace has good foundations but requires significant updates to become a production-ready template for modern web apps deployed to Arweave.

### Key Issues Identified

1. **Outdated Tech Stack** - Currently configured for Electron desktop apps, not web apps
2. **Missing Critical Files** - No README, no deployment config, no example templates
3. **Incomplete Deployment Flow** - Scripts missing `--auto-confirm`, outdated metadata
4. **Incorrect .gitignore** - Excludes `.workspace/` which should be in the repo
5. **Legacy Naming** - References to "Glyph Potluck" instead of generic placeholders
6. **Missing Documentation** - No deployment guide, no setup instructions
7. **No Build Optimization** - Missing Vite/build configuration for Arweave
8. **Empty Config Directory** - No example configs or wallet templates

## Current State Analysis

### What Exists (Good)

✅ **Workspace Philosophy**
- `.workspace/` directory structure established
- Clear separation of concerns (scaffolding vs project code)
- `context.md` with solid orientation for assistants

✅ **Version Management**
- `version-bump.sh` script for semantic versioning
- Conventional commits workflow documented
- CHANGELOG.md template (empty but present)

✅ **Deployment Scripts (Partial)**
- `deploy-to-arweave.sh` with good structure
- `quick-deploy.sh` with fallback test page
- Wallet path configuration

✅ **Assistant Integration**
- `.cursorindexingignore` properly configured
- Multi-assistant support philosophy

### What's Missing or Broken

❌ **Package Configuration**
- Configured for Electron, not web apps
- No Vite, React, or modern web dependencies
- No build scripts for web deployment
- Wrong "main" entry point (Electron main.js)

❌ **Core Documentation**
- No README.md with setup instructions
- No deployment guide
- No architecture documentation
- No quick-start guide

❌ **Deployment Configuration**
- Missing `.workspace/config/deploy.config.js`
- Missing `.workspace/config/wallet.json.example`
- No ArNS configuration examples
- Scripts have old "Glyph Potluck" branding
- Missing `--auto-confirm` flag (causes interactive hang)

❌ **Build Optimization**
- No `vite.config.ts` with Arweave-optimized settings
- No Tailwind or PostCSS configuration
- No chunk splitting or asset optimization

❌ **Security Configuration**
- `.gitignore` excludes `.workspace/` (should be included)
- `.gitignore` doesn't protect `wallet.json` or `deployments.json`
- No security warnings in documentation

❌ **Project Templates**
- No example component structure
- No TypeScript configuration
- No ESLint/code quality setup
- No example app.tsx or main entry point

❌ **NPM Scripts**
- No `deploy`, `deploy:dev`, `deploy:quick` shortcuts
- No modern build scripts (`dev`, `build`, `preview`)

## Proposed Refinements

### Phase 1: Foundation & Configuration

#### 1.1 Update Package.json

**Goal:** Transform from Electron config to modern web app template

**Changes:**
```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "type": "module",
  "description": "{{PROJECT_DESCRIPTION}}",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "typecheck": "tsc --noEmit",
    "deploy": ".workspace/scripts/deploy-to-arweave.sh --prod",
    "deploy:dev": ".workspace/scripts/deploy-to-arweave.sh --dev",
    "deploy:quick": ".workspace/scripts/quick-deploy.sh"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

**Placeholders to replace:**
- `{{PROJECT_NAME}}` - User's project name
- `{{PROJECT_DESCRIPTION}}` - User's project description

#### 1.2 Fix .gitignore

**Goal:** Include workspace scaffolding, exclude only sensitive files

**Changes:**
```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules

# Build output
dist
dist-ssr
dist-electron
tsconfig.tsbuildinfo
*.local

# Environment variables
.env
.env.local
.env.production

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Development tools (keep .workspace/ - it's part of the repo)
.cursor/
.cursorindexingignore
.specstory/
.obsidian/

# Arweave deployment (NEVER commit wallet or deployment history)
.workspace/config/wallet.json
.workspace/config/deployments.json

# Python virtual environments
.venv/
python-env/

# Legacy/unused
.quartz-cache
.replit
replit.nix
```

**Key changes:**
- Remove `.workspace/` from exclusions
- Add specific exclusions for `wallet.json` and `deployments.json`
- Add clear security comment

#### 1.3 Create Vite Configuration

**Goal:** Optimize builds for Arweave deployment

**New file:** `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Optimize for Arweave deployment
        target: 'es2015',
        minify: 'esbuild',
        sourcemap: false, // Reduce deployment size
        // Chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                },
            },
        },
        assetsInlineLimit: 4096, // Inline small assets
        chunkSizeWarningLimit: 1000,
    },
    // Use relative paths for Arweave deployment
    base: './',
})
```

#### 1.4 Create TypeScript Configuration

**New file:** `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**New file:** `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### 1.5 Create CSS Architecture

**Philosophy:** Use modern CSS with custom properties (variables), semantic elements, and efficient global styles. No framework overhead, maximum flexibility.

**Benefits of Raw CSS Approach:**
- **Zero Runtime Overhead**: No framework classes to parse or purge
- **Smaller Bundle Size**: ~3KB vs 50KB+ for Tailwind
- **Better Performance**: Direct CSS, no utility class lookups
- **Framework Agnostic**: Works with any JS framework or vanilla JS
- **Educational Value**: Teaches CSS fundamentals and modern features
- **Customizable**: Full control over every style decision
- **Maintainable**: Clear separation of concerns, semantic class names
- **Modern Features**: Custom properties, color-mix(), cascade layers, container queries

**CSS File Structure:**
1. **variables.css** - Design tokens (single source of truth)
2. **reset.css** - Normalize browser defaults
3. **base.css** - Semantic element styles
4. **Component CSS** - Scoped styles imported per component

**New file:** `src/style/variables.css`
```css
/* CSS Custom Properties (Design Tokens) */
:root {
  /* Colors - Semantic naming */
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-primary-light: #818cf8;
  
  --color-secondary: #7c3aed;
  --color-accent: #06b6d4;
  
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Spacing - Consistent scale */
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.5rem;     /* 24px */
  --space-xl: 2rem;       /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 4rem;      /* 64px */
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
  
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Borders & Radius */
  --border-width: 1px;
  --border-width-thick: 2px;
  
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-index layers */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #111827;
    --color-surface: #1f2937;
    --color-border: #374151;
    
    --color-text: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-text-tertiary: #9ca3af;
  }
}
```

**New file:** `src/style/reset.css`
```css
/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100vh;
  line-height: var(--line-height-normal);
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}
```

**New file:** `src/style/base.css`
```css
/* Base element styles using design tokens */

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-background);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }
h5 { font-size: var(--text-lg); }
h6 { font-size: var(--text-base); }

p {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

small {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background-color: var(--color-surface);
  padding: 0.125rem 0.25rem;
  border-radius: var(--radius-sm);
}

/* Interactive elements */
button {
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-base);
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

input, textarea, select {
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color var(--transition-base);
}

input:focus, textarea:focus, select:focus {
  border-color: var(--color-primary);
  outline: none;
}
```


### Phase 2: Deployment Infrastructure

#### 2.1 Update Deployment Scripts

**File:** `.workspace/scripts/deploy-to-arweave.sh`

**Critical fix:** Add `--auto-confirm` flag (line 123)
```bash
local deploy_output=$(arkb deploy "$BUILD_DIR" \
    --wallet "$WALLET_PATH" \
    --auto-confirm \
    --verbose 2>&1)
```

**Generalize metadata tags:**
```bash
# Read from deploy.config.js or use defaults
local app_name=$(node -p "try { require('./.workspace/config/deploy.config.js').appName } catch(e) { require('./package.json').name }" 2>/dev/null || echo "Arweave-App")
local category=$(node -p "try { require('./.workspace/config/deploy.config.js').tags.find(t => t.name === 'Category').value } catch(e) { 'web-app' }" 2>/dev/null || echo "web-app")

local tags="--tag App-Name $app_name"
tags="$tags --tag App-Version $version"
tags="$tags --tag Content-Type text/html"
tags="$tags --tag App-Type web-app"
tags="$tags --tag Category $category"
```

**File:** `.workspace/scripts/quick-deploy.sh`

**Critical fixes:**
1. Add `--auto-confirm` flag (line 138)
2. Remove hardcoded "Glyph Potluck" test page
3. Require actual build

```bash
# Build the app
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ No package.json found in project root${NC}"
    exit 1
fi

echo -e "${BLUE}Building app...${NC}"
npm run build

if [[ ! -d "dist" ]]; then
    echo -e "${RED}❌ Build failed - no dist/ directory found${NC}"
    exit 1
fi

# Deploy directly with arkb for maximum speed
echo -e "${GREEN}Deploying to Arweave with arkb...${NC}"
arkb deploy dist --wallet .workspace/config/wallet.json --auto-confirm

echo -e "${GREEN}✅ Quick deployment complete!${NC}"
```

#### 2.2 Create Deployment Configuration

**New file:** `.workspace/config/deploy.config.js`
```javascript
// Arweave deployment configuration
const path = require('path');

module.exports = {
  // Wallet configuration
  walletPath: path.join(__dirname, 'wallet.json'),
  
  // Build configuration
  buildDir: 'dist',
  buildCommand: 'npm run build',
  
  // Deployment settings
  appName: '{{APP_NAME}}', // Replace with your app name
  description: '{{APP_DESCRIPTION}}', // Replace with your app description
  
  // ArNS configuration (optional)
  arnsName: '{{ARNS_NAME}}', // Reserve this name for later
  
  // Tags for discovery
  tags: [
    { name: 'App-Name', value: '{{APP_NAME}}' },
    { name: 'App-Version', value: process.env.npm_package_version || '0.1.0' },
    { name: 'Content-Type', value: 'text/html' },
    { name: 'App-Type', value: 'web-app' },
    { name: 'Category', value: '{{CATEGORY}}' }, // e.g., 'productivity', 'design-tools', 'games'
    { name: 'Keywords', value: '{{KEYWORDS}}' } // e.g., 'tool,utility,web3'
  ],
  
  // Deployment options
  options: {
    // Automatically open the deployed app after upload
    openAfterDeploy: true,
    
    // Show verbose output during deployment
    verbose: true,
    
    // Retry failed uploads
    retryAttempts: 3
  }
};
```

**New file:** `.workspace/config/wallet.json.example`
```json
{
  "kty": "RSA",
  "n": "YOUR_WALLET_N_VALUE_HERE",
  "e": "AQAB",
  "d": "YOUR_WALLET_D_VALUE_HERE",
  "p": "YOUR_WALLET_P_VALUE_HERE",
  "q": "YOUR_WALLET_Q_VALUE_HERE",
  "dp": "YOUR_WALLET_DP_VALUE_HERE",
  "dq": "YOUR_WALLET_DQ_VALUE_HERE",
  "qi": "YOUR_WALLET_QI_VALUE_HERE"
}
```

### Phase 3: Documentation

#### 3.1 Create README.md

**New file:** `README.md`
```markdown
# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

A web application built for permanent deployment to [Arweave](https://arweave.org), the decentralized permanent storage network.

## Features

- 100% Client-Side
- Permanent Storage on Arweave
- [Add your features here]

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- [Arweave wallet](https://arweave.app) with AR tokens (for deployment)
- [arkb](https://github.com/textury/arkb) CLI tool: `npm install -g arkb`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Deploy to Arweave

**Setup:**
1. Get an Arweave wallet from [arweave.app](https://arweave.app)
2. Fund it with AR tokens (~0.001-0.01 AR per deployment)
3. Save your wallet to `.workspace/config/wallet.json`

**Deploy:**

```bash
# Production deployment (with confirmation)
npm run deploy

# Development deployment
npm run deploy:dev

# Quick deployment
npm run deploy:quick
```

For detailed deployment instructions, see [Arweave Deployment Guide](.workspace/docs/temp/arweave-deployment-guide.md).

## Project Structure

```
.
├── src/                    # Application source code
│   ├── components/         # React components
│   ├── styles/            # CSS architecture
│   │   ├── variables.css  # Design tokens (colors, spacing, etc.)
│   │   ├── reset.css      # CSS reset
│   │   ├── base.css       # Base element styles
│   │   └── utilities.css  # Utility classes
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   ├── App.css            # App-specific styles
│   ├── main.tsx           # Entry point
│   └── index.css          # Global style imports
├── .workspace/            # Development scaffolding
│   ├── config/            # Deployment configuration
│   ├── scripts/           # Automation scripts
│   └── docs/              # Documentation
├── dist/                  # Build output (gitignored)
├── index.html             # HTML entry point
├── package.json           # Project dependencies
├── vite.config.ts         # Build configuration
└── README.md              # This file
```

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Modern CSS (Custom Properties, Cascade Layers)
- **Deployment:** Arweave Permaweb

## Documentation

- [Arweave Deployment Guide](.workspace/docs/temp/arweave-deployment-guide.md)
- [Development Workflow](.workspace/context.md)

## License

MIT
```

#### 3.2 Create Arweave Deployment Guide

**Copy from Lattelier:** `.workspace/docs/temp/arweave-deployment-guide.md`
- Already comprehensive and well-structured
- Just needs placeholder replacements
- Include troubleshooting section

#### 3.3 Create Quick Start Guide

**New file:** `.workspace/docs/temp/QUICKSTART.md`
```markdown
# Quick Start Guide

## 1. Clone and Setup

```bash
git clone [your-repo-url]
cd [your-project]
npm install
```

## 2. Customize Your Project

1. **Update package.json:**
   - Change `name` to your project name
   - Update `description`

2. **Configure deployment:**
   - Edit `.workspace/config/deploy.config.js`
   - Replace `{{APP_NAME}}`, `{{CATEGORY}}`, etc.

3. **Set up Arweave wallet:**
   - Get wallet from [arweave.app](https://arweave.app)
   - Save to `.workspace/config/wallet.json`

## 3. Start Development

```bash
npm run dev
```

## 4. Build and Deploy

```bash
# Build
npm run build

# Deploy
npm run deploy
```

## 5. Access Your App

Your app will be permanently available at:
```
https://arweave.net/[TRANSACTION_ID]
```

For more details, see the [full README](../../README.md).
```

### Phase 4: Example Application Structure

#### 4.1 Create Minimal App Template

**New file:** `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{PROJECT_NAME}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**New file:** `src/main.tsx`
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**New file:** `src/App.tsx`
```typescript
import React from 'react'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="welcome-card">
        <h1>{{PROJECT_NAME}}</h1>
        <p className="description">{{PROJECT_DESCRIPTION}}</p>
        
        <div className="info-box">
          <p className="font-medium">
            This is a starter template for Arweave permadapps.
          </p>
          <p className="text-sm">
            Start building your app by editing <code>src/App.tsx</code>
          </p>
        </div>
        
        <div className="features">
          <h2>Built With</h2>
          <ul>
            <li>⚛️ React 18 + TypeScript</li>
            <li>⚡ Vite - Lightning fast builds</li>
            <li>🎨 Modern CSS with custom properties</li>
            <li>🌐 Arweave - Permanent decentralized storage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
```

**New file:** `src/App.css`
```css
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.welcome-card {
  background-color: var(--color-background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--space-2xl);
  max-width: 42rem;
  width: 100%;
}

.welcome-card h1 {
  margin-bottom: var(--space-md);
}

.welcome-card .description {
  margin-bottom: var(--space-xl);
  font-size: var(--text-lg);
}

.info-box {
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border: var(--border-width) solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.info-box p:first-child {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-sm);
}

.info-box p:last-child {
  color: var(--color-primary);
}

.features {
  margin-top: var(--space-xl);
}

.features h2 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.features ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.features li {
  padding: var(--space-sm);
  color: var(--color-text-secondary);
}
```

**New file:** `src/index.css`
```css
/* Import global styles in order */
@import './style/variables.css';
@import './style/reset.css';
@import './style/base.css';

/* Additional global styles can go here */
```

#### 4.2 Create ESLint Configuration

**New file:** `.eslintrc.cjs`
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

### Phase 5: Automation & Utilities

#### 5.1 Create Setup Script

**New file:** `.workspace/scripts/setup.sh`
```bash
#!/bin/bash

# Starter Permadapp Setup Script
# Helps configure a new project from the template

set -e

echo "🚀 Arweave Permadapp Setup"
echo "=========================="

# Get project details
read -p "Project Name: " PROJECT_NAME
read -p "Project Description: " PROJECT_DESCRIPTION
read -p "Category (e.g., productivity, design-tools, games): " CATEGORY
read -p "Keywords (comma-separated): " KEYWORDS
read -p "ArNS Name (optional): " ARNS_NAME

# Update package.json
echo "Updating package.json..."
node -e "
const pkg = require('./package.json');
pkg.name = '$PROJECT_NAME';
pkg.description = '$PROJECT_DESCRIPTION';
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

# Update deploy.config.js
echo "Updating deployment configuration..."
sed -i.bak "s/{{APP_NAME}}/$PROJECT_NAME/g" .workspace/config/deploy.config.js
sed -i.bak "s/{{APP_DESCRIPTION}}/$PROJECT_DESCRIPTION/g" .workspace/config/deploy.config.js
sed -i.bak "s/{{CATEGORY}}/$CATEGORY/g" .workspace/config/deploy.config.js
sed -i.bak "s/{{KEYWORDS}}/$KEYWORDS/g" .workspace/config/deploy.config.js
sed -i.bak "s/{{ARNS_NAME}}/$ARNS_NAME/g" .workspace/config/deploy.config.js
rm .workspace/config/deploy.config.js.bak

# Update README
echo "Updating README..."
sed -i.bak "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" README.md
sed -i.bak "s/{{PROJECT_DESCRIPTION}}/$PROJECT_DESCRIPTION/g" README.md
rm README.md.bak

# Update index.html
sed -i.bak "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" index.html
rm index.html.bak

# Update App.tsx
sed -i.bak "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" src/App.tsx
sed -i.bak "s/{{PROJECT_DESCRIPTION}}/$PROJECT_DESCRIPTION/g" src/App.tsx
rm src/App.tsx.bak

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get an Arweave wallet from https://arweave.app"
echo "2. Save your wallet to .workspace/config/wallet.json"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
echo ""
```

#### 5.2 Update Context Documentation

**File:** `.workspace/context.md`

Add section on Arweave deployment:
```markdown
## Arweave Deployment

This project is designed for permanent deployment to Arweave's permaweb.

### Quick Deploy

```bash
npm run deploy        # Production
npm run deploy:dev    # Development
npm run deploy:quick  # Quick iteration
```

### Configuration

- **Wallet:** `.workspace/config/wallet.json` (not in git)
- **Settings:** `.workspace/config/deploy.config.js`
- **Scripts:** `.workspace/scripts/deploy-to-arweave.sh`

### Deployment Tags

Each deployment includes metadata tags for discoverability:
- App-Name
- App-Version (from package.json)
- Content-Type (text/html)
- App-Type (web-app)
- Category (configurable)
- Keywords (configurable)
- Environment (production/development)

### ArNS

Optionally register a human-readable name at [ar.io](https://ar.io) to replace the transaction ID URL.
```

### Phase 6: Testing & Validation

#### 6.1 Create Test Checklist

**New file:** `.workspace/docs/temp/deployment-checklist.md`
```markdown
# Deployment Checklist

## Pre-Deployment

- [ ] All changes committed to git
- [ ] Version bumped (if needed): `.workspace/scripts/version-bump.sh`
- [ ] CHANGELOG.md updated
- [ ] README.md accurate
- [ ] Dependencies up to date: `npm audit`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Linting passes: `npm run lint`

## Build Verification

- [ ] Build succeeds: `npm run build`
- [ ] Build output in `dist/` directory
- [ ] Asset sizes reasonable (check `dist/` size)
- [ ] Preview works: `npm run preview`

## Deployment

- [ ] Arweave wallet funded (check balance)
- [ ] deploy.config.js configured
- [ ] Test deployment: `npm run deploy:dev`
- [ ] Verify dev deployment loads correctly
- [ ] Production deployment: `npm run deploy`

## Post-Deployment

- [ ] Save transaction ID
- [ ] Test production URL
- [ ] Update deployments.json
- [ ] Tag release: `git tag vX.Y.Z`
- [ ] Push to GitHub: `git push && git push --tags`
- [ ] (Optional) Register ArNS name

## Rollback Plan

If deployment fails or has issues:
1. Previous version still accessible at its transaction ID
2. Can redeploy previous version's `dist/` folder
3. Update ArNS to point to previous transaction ID (if using)
```

## Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. Fix `.gitignore` - Include `.workspace/`, protect secrets
2. Update deployment scripts with `--auto-confirm`
3. Remove "Glyph Potluck" references
4. Create `.workspace/config/wallet.json.example`

### Phase 2: Core Infrastructure (Week 1)
1. Transform `package.json` to web app template
2. Create Vite, TypeScript, Tailwind configs
3. Update deployment scripts for generalization
4. Create `deploy.config.js` template

### Phase 3: Documentation (Week 1-2)
1. Create README.md
2. Create QUICKSTART.md
3. Copy/adapt Arweave deployment guide from Lattelier
4. Create deployment checklist

### Phase 4: Templates & Examples (Week 2)
1. Create minimal app structure (index.html, main.tsx, App.tsx)
2. Create ESLint configuration
3. Add example components directory structure
4. Add utility/helper templates

### Phase 5: Automation (Week 2-3)
1. Create setup.sh script
2. Update context.md with Arweave info
3. Add npm scripts for all workflows
4. Test end-to-end setup process

### Phase 6: Polish & Testing (Week 3)
1. Test complete setup flow
2. Verify all documentation accuracy
3. Create example deployment
4. Gather feedback and iterate

## Success Metrics

### Must Have
- [ ] Fresh clone → working app in under 5 minutes
- [ ] Clear, accurate documentation
- [ ] Successful deployment on first try
- [ ] All scripts work non-interactively
- [ ] Security: wallet and secrets protected

### Should Have
- [ ] Optimized build sizes (<100KB gzipped for minimal app)
- [ ] Example components and patterns
- [ ] Clear troubleshooting guides
- [ ] Multiple deployment options documented

### Nice to Have
- [ ] Interactive setup wizard
- [ ] Pre-configured component library integration
- [ ] CI/CD examples (GitHub Actions)
- [ ] Multi-environment deployment strategies

## Risk Assessment

### High Risk
1. **Breaking existing workflows** - Some users may have customized scripts
   - *Mitigation:* Version the template, document migration
   
2. **Wallet security issues** - Accidentally committing wallet.json
   - *Mitigation:* Strong .gitignore, clear warnings, example files

### Medium Risk
1. **Build size bloat** - Including too many dependencies by default
   - *Mitigation:* Keep core minimal, document optional additions
   
2. **Deployment cost surprises** - Users not understanding AR costs
   - *Mitigation:* Clear cost estimates in docs, calculator tool

### Low Risk
1. **Arweave API changes** - Breaking deployment scripts
   - *Mitigation:* Document arkb version, test regularly

## CSS Best Practices

### Modern CSS Features to Leverage

1. **CSS Custom Properties (Variables)**
   - Single source of truth for design tokens
   - Runtime updates (e.g., theme switching)
   - Scoped to components or global

2. **color-mix() Function**
   - Dynamic color variations
   - No need for pre-generated shades
   - Example: `color-mix(in srgb, var(--color-primary) 10%, transparent)`

3. **Logical Properties**
   - `margin-inline`, `padding-block` for better i18n
   - Automatic RTL/LTR support

4. **Container Queries** (optional)
   - Component-based responsive design
   - Better than media queries for reusable components

5. **Cascade Layers** (optional)
   - Control specificity without !important
   - `@layer reset, base, utilities, components, overrides;`

### Why This Matters for Arweave

- **Permanent Storage**: Every byte counts when it's stored forever
- **No CDN**: Can't rely on external CSS frameworks
- **Performance**: Direct CSS is faster than runtime utility parsing
- **Longevity**: Raw CSS ages better than framework-specific code

## Open Questions

1. **State Management:** Include Zustand/Redux by default, or keep minimal?
   - *Recommendation:* Minimal by default, document how to add
   
2. **TypeScript:** Strict by default or gradual adoption?
   - *Recommendation:* Strict by default for better DX
   
3. **Testing:** Include Vitest/Jest setup?
   - *Recommendation:* Phase 2 addition, not initial release

4. **ArNS Integration:** Build in ArNS support or document separately?
   - *Recommendation:* Document separately, keep deployment simple
   
5. **CSS Preprocessors:** Support SCSS/LESS?
   - *Recommendation:* No - modern CSS features are sufficient

## Appendix: Placeholder System

To make the template truly reusable, we need a consistent placeholder system:

### Placeholders to Use

```
{{PROJECT_NAME}}        - User's project name
{{PROJECT_DESCRIPTION}} - User's project description
{{APP_NAME}}           - App name for Arweave (usually same as project)
{{CATEGORY}}           - Arweave category (productivity, design-tools, etc.)
{{KEYWORDS}}           - Comma-separated keywords for discovery
{{ARNS_NAME}}          - Optional ArNS name reservation
{{GITHUB_REPO}}        - GitHub repository URL
{{AUTHOR}}             - Project author
{{LICENSE}}            - License type
```

### Files Requiring Placeholders

- `package.json`
- `.workspace/config/deploy.config.js`
- `README.md`
- `index.html`
- `src/App.tsx`
- `QUICKSTART.md`

### Replacement Strategy

1. **Manual:** User runs setup.sh which prompts and replaces
2. **Automated:** GitHub template repository feature auto-replaces
3. **Hybrid:** Setup script with sensible defaults, user can skip

**Recommendation:** Start with manual setup.sh, evolve to automated

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize** which phases to implement first
3. **Create issues** for each major task
4. **Assign ownership** for different components
5. **Set timeline** for initial release
6. **Test with real users** before finalizing

---

**Prepared by:** AI Assistant (Claude/Cursor)  
**Based on:** Successful Lattelier deployment experience  
**Status:** Ready for review and implementation

