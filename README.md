# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

A web application built for permanent deployment to [Arweave](https://arweave.org), the decentralized permanent storage network.

## DOAP.json Template System

This template workspace includes a comprehensive DOAP.json metadata management system:

- **`doap.json`** - Central metadata source with placeholder variables
- **Automatic HTML metadata injection** - SEO and social media tags generated from DOAP.json
- **Version management** - Semantic versioning with automatic synchronization
- **Deployment tracking** - Arweave deployments automatically recorded
- **Cross-file synchronization** - Keep all project files in sync
- **Public metadata access** - DOAP.json automatically included in deployed sites

### Initializing a New Project

1. **Clone this template workspace**
2. **Replace placeholders** in `doap.json` with your project information
3. **Run synchronization** to update all files: `.workspace/scripts/doap-sync.sh`
4. **Test the build process** to ensure metadata injection works

For detailed instructions, see the [Project Initialization Guide](.cursor/rules/project_initialization.mdc).

## Features

- 100% Client-Side - Runs entirely in the browser
- Permanent Storage - Deploy once, accessible forever on Arweave
- Modern Stack - React 18, TypeScript, Vite
- Raw CSS - Lightweight, maintainable styling with CSS custom properties
- Zero Config - Pre-configured for optimal Arweave deployment

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

The built files will be in the `dist` directory.

## Deploy to Arweave

### Setup

1. Get an Arweave wallet from [arweave.app](https://arweave.app)
2. Fund it with AR tokens (~0.001-0.01 AR per deployment)
3. Save your wallet to `.workspace/config/wallet.json`

### Deploy Commands

```bash
# Production deployment (with confirmation)
npm run deploy

# Development deployment
npm run deploy:dev

# Quick deployment
npm run deploy:quick
```

### Deployment Guide

For detailed instructions, troubleshooting, and best practices, see:
- [Arweave Deployment Guide](.workspace/docs/temp/arweave-deployment-guide.md)

## Project Structure

```
.
├── src/                    # Application source code
│   ├── components/         # React components
│   ├── style/             # CSS architecture
│   │   ├── variables.css  # Design tokens (colors, spacing, etc.)
│   │   ├── reset.css      # CSS reset
│   │   └── base.css       # Base element styles
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

## CSS Architecture

This template uses raw CSS with modern features instead of utility frameworks like Tailwind:

- **Design Tokens:** Centralized variables in `variables.css`
- **Semantic Styles:** Base element styling in `base.css`
- **Component Scoped:** Import CSS per component

**Benefits:**
- Smaller bundle size (~3KB vs 50KB+ for Tailwind)
- Zero runtime overhead
- Better for permanent storage
- Teaches modern CSS fundamentals

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run deploy` - Deploy to Arweave (production)
- `npm run deploy:dev` - Deploy to Arweave (development)
- `npm run deploy:quick` - Quick deploy for testing

### Customization

1. **Initialize project metadata** in `doap.json`:
   - Replace all `{{PLACEHOLDER}}` variables with your project information
   - Use the [Project Initialization Guide](.cursor/rules/project_initialization.mdc) for detailed instructions

2. **Synchronize files** with DOAP.json:
   ```bash
   .workspace/scripts/doap-sync.sh
   ```

3. **Modify design tokens** in `src/styles/variables.css`:
   - Colors
   - Spacing
   - Typography
   - Shadows

4. **Add components** in `src/components/`

5. **Add utilities** in `src/utils/`

## Documentation

- [Arweave Deployment Guide](.workspace/docs/temp/arweave-deployment-guide.md)
- [Development Workflow](.workspace/context.md)
- [Refinement Plan](.workspace/docs/temp/arweave-boilerplate-refinement-plan.md)

## Arweave Deployment

Your app will be **permanently accessible** on Arweave at:
```
https://arweave.net/[TRANSACTION_ID]
```

### Optional: ArNS (Arweave Name System)

Register a human-readable name at [ar.io](https://ar.io) to replace the transaction ID:
- Example: `https://my-app.ar.io` instead of `https://arweave.net/abc123...`

## Security

**Important:** Never commit sensitive files!

The `.gitignore` is configured to protect:
- `.workspace/config/wallet.json` - Your Arweave wallet
- `.workspace/config/deployments.json` - Deployment history

Always verify these are not staged before committing:
```bash
git status
```

## License

MIT

## Resources

- [Arweave Documentation](https://docs.arweave.org)
- [Arkb CLI Tool](https://github.com/textury/arkb)
- [AR.IO Gateway](https://ar.io)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

