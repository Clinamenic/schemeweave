# Schemeweave

Semantic Document Composer - Web-based tool for creating DOAP and FOAF documents with form-based interface and real-time JSON preview.

A web application built for permanent deployment to [Arweave](https://arweave.org), the decentralized permanent storage network.

## Overview

Schemeweave is a semantic document composer that enables users to create structured documents following established schemas like DOAP (Description of a Project) and FOAF (Friend of a Friend). The application provides an intuitive form-based interface with real-time preview capabilities and multiple export formats.

## Features

- **Schema-Based Form Generation**: Support for DOAP and FOAF schemas with dynamic form creation
- **Real-Time Preview**: Live JSON preview with multiple format support (JSON, JSON-LD, XML, Turtle)
- **Export Functionality**: Download documents in various formats with custom filename and format selection
- **Terminal Aesthetic**: Clean, professional interface inspired by classic computer terminals
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **SAWA Framework Compliance**: Built following the Semantic Arweave Web App specification

## Technical Architecture

- **Frontend**: React 18 with TypeScript for type safety and modern development experience
- **Build System**: Vite for fast development and optimized production builds
- **State Management**: Zustand for lightweight, efficient state management
- **Form Handling**: react-hook-form with Zod validation for robust form processing
- **Styling**: Semantic CSS with design tokens and modern CSS features
- **Deployment**: Arweave permaweb for permanent, decentralized hosting

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Modern web browser with JavaScript enabled

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

## Usage

1. **Select Schema**: Choose between DOAP or FOAF schema from the navigation header
2. **Choose Template**: Select a template within the chosen schema
3. **Fill Form**: Complete the form fields with your document information
4. **Preview**: View real-time preview of your document in the sidebar
5. **Export**: Download your document in your preferred format (JSON, JSON-LD, XML, or Turtle)

## Deploy to Arweave

### Setup

1. Get an Arweave wallet from [arweave.app](https://arweave.app)
2. Fund it with AR tokens (approximately 0.001-0.01 AR per deployment)
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

## Project Structure

```
.
├── src/                    # Application source code
│   ├── components/         # React components
│   │   ├── DocumentForm.tsx    # Dynamic form generation
│   │   ├── PreviewPanel.tsx    # Real-time preview
│   │   ├── NavigationHeader.tsx # Schema/template selection
│   │   ├── Toolbar.tsx         # Global actions
│   │   ├── ExportDialog.tsx    # Export functionality
│   │   └── icons.tsx           # SVG icon components
│   ├── styles/            # CSS architecture
│   │   ├── variables.css  # Design tokens
│   │   ├── reset.css      # CSS reset
│   │   ├── base.css       # Base element styles
│   │   └── utilities.css  # Utility classes
│   ├── stores/            # State management
│   │   └── useAppStore.ts # Zustand store
│   ├── services/          # Business logic
│   │   └── schemas.ts     # Schema definitions
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application-specific styles
│   ├── main.tsx           # Entry point
│   └── index.css          # Global style imports
├── .workspace/            # Development scaffolding
│   ├── config/            # Deployment configuration
│   ├── scripts/           # Automation scripts
│   └── docs/              # Documentation
├── dist/                  # Build output (gitignored)
├── index.html             # HTML entry point
├── doap.json              # Project metadata
├── package.json           # Project dependencies
├── vite.config.ts         # Build configuration
└── README.md              # This file
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Form Handling**: react-hook-form + Zod
- **Styling**: Modern CSS with custom properties
- **Deployment**: Arweave Permaweb

## CSS Architecture

Schemeweave uses a semantic CSS approach with modern features:

- **Design Tokens**: Centralized variables in `src/styles/variables.css`
- **Semantic Styles**: Meaningful class names that describe purpose
- **Component Scoped**: CSS imported per component for maintainability
- **Modern Features**: Custom properties, cascade layers, logical properties

**Benefits:**

- Smaller bundle size (approximately 3KB vs 50KB+ for utility frameworks)
- Zero runtime overhead
- Better for permanent storage on Arweave
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

1. **Modify Design Tokens** in `src/styles/variables.css`:

   - Colors
   - Spacing
   - Typography
   - Shadows

2. **Add New Schemas** in `src/services/schemas.ts`:

   - Define schema structure
   - Add field definitions
   - Create templates

3. **Extend Components** in `src/components/`:

   - Add new UI components
   - Extend existing functionality

4. **Add Utilities** in `src/utils/`:
   - Helper functions
   - Data processing utilities

## Version Management

Schemeweave follows semantic versioning with automated version management:

- **Version Source**: `doap.json` serves as the single source of truth
- **Automatic Sync**: Version updates propagate to all project files
- **Release Process**: Automated version bumping based on conventional commits

## Documentation

- [Architecture Documentation](.workspace/docs/arch/Architecture.md)
- [SAWA Framework Specification](.workspace/docs/arch/SAWA%20Framework%20Specification.md)
- [Development Workflow](.workspace/context.md)
- [Dithering Texture Strategy](.workspace/docs/temp/2025-01-26-dithering-texture-strategy.md)

## Deployment

This application is deployed on Arweave and accessible at:
- **Primary URL**: https://arweave.net/7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug
- **Project Metadata**: https://arweave.net/7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug/doap.json
- **Version**: 0.3.1
- **Deployed**: 2025-10-27

### Alternative Access Points
- https://7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug.arweave.net
- https://ar.io/7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug
- https://arweave.dev/7YOG_B2X7eff3fxXPym8IKUr351nPHMA2XTUaIpNzug

### Optional: ArNS (Arweave Name System)

Register a human-readable name at [ar.io](https://ar.io) to replace the transaction ID:

- Example: `https://schemeweave.ar.io` instead of `https://arweave.net/abc123...`

## Security

**Important:** Never commit sensitive files!

The `.gitignore` is configured to protect:

- `.workspace/config/wallet.json` - Your Arweave wallet
- `.workspace/config/deployments.json` - Deployment history

Always verify these are not staged before committing:

```bash
git status
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Resources

- [Arweave Documentation](https://docs.arweave.org)
- [Arkb CLI Tool](https://github.com/textury/arkb)
- [AR.IO Gateway](https://ar.io)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [react-hook-form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

## Support

For questions, issues, or contributions, please visit the [GitHub repository](https://github.com/Clinamenic/schemeweave).
