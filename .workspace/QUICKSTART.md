# Quick Start Guide - Arweave Permadapp Template

Get your app running and deployed to Arweave in under 5 minutes.

## 1. Clone and Setup

```bash
# Clone your repository (or use this template)
git clone [your-repo-url]
cd [your-project]

# Install dependencies
npm install
```

## 2. Initialize Project Metadata

### Update DOAP.json (Primary Source)
Edit `doap.json` and replace all `{{PLACEHOLDER}}` variables:

```json
{
  "name": "my-awesome-app",
  "description": "My permanent web application",
  "version": "0.1.0",
  "author": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "repository": {
    "url": "https://github.com/yourusername/my-awesome-app"
  }
}
```

### Synchronize All Files
Run the synchronization script to update all project files:

```bash
.workspace/scripts/doap-sync.sh
```

This will automatically update:
- `package.json` with project metadata
- `README.md` with project information
- All other files to stay in sync

### Verify HTML Metadata
The build process automatically injects metadata from `doap.json` into your HTML:
- SEO meta tags
- Open Graph tags
- Twitter Card tags
- Project information

## 3. Start Development

```bash
npm run dev
```

Visit http://localhost:5173 to see your app.

## 4. Customize Styles

Edit design tokens in `src/style/variables.css`:

```css
:root {
  --color-primary: #4f46e5;     /* Your primary color */
  --color-secondary: #7c3aed;   /* Your secondary color */
  --font-sans: 'Your Font', sans-serif;
  /* ... more variables */
}
```

## 5. Version Management

### Version Bump
Use the enhanced version bump script that reads from `doap.json`:

```bash
# Bump patch version (0.1.0 → 0.1.1)
.workspace/scripts/version-bump.sh patch

# Bump minor version (0.1.0 → 0.2.0)
.workspace/scripts/version-bump.sh minor

# Bump major version (0.1.0 → 1.0.0)
.workspace/scripts/version-bump.sh major
```

This automatically:
- Updates version in `doap.json`
- Syncs version to `package.json`
- Updates `dateModified` field
- Prepares for changelog updates

## 6. Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory with:
- Metadata automatically injected from `doap.json`
- SEO tags for search engines
- Social media tags for sharing
- Project information in HTML head

## 7. Deploy to Arweave

### First-time Setup

1. **Get Arweave Wallet:**
   - Visit [arweave.app](https://arweave.app)
   - Create a new wallet
   - Download the JSON file

2. **Fund Your Wallet:**
   - Buy AR tokens (minimum ~0.01 AR)
   - Send to your wallet address

3. **Install arkb:**
   ```bash
   npm install -g arkb
   ```

4. **Save Wallet:**
   ```bash
   # Copy your wallet to the config directory
   cp ~/Downloads/arweave-keyfile-xxx.json .workspace/config/wallet.json
   ```

### Deploy

```bash
# Deploy to production
npm run deploy
```

**That's it!** Your app is now permanently on Arweave.

The deployment will:
- Output a URL like: `https://arweave.net/abc123...xyz789`
- Make project metadata publicly accessible at: `https://arweave.net/abc123...xyz789/doap.json`
- Automatically update `doap.json` with deployment information
- Track version, transaction ID, and deployment date
- Maintain deployment history for future reference

## 8. Backup Repository to Arweave

Create comprehensive backups of your entire workspace to protocol.land (Arweave-based GitHub alternative):

```bash
# Create complete workspace backup
.workspace/scripts/backup-to-protocol-land.sh

# Test backup process (dry run)
.workspace/scripts/backup-to-protocol-land.sh --dry-run
```

The backup script will:
- Copy entire workspace (excluding sensitive files like wallet.json)
- Upload to protocol.land for permanent storage
- Update doap.json with backup history
- Provide permanent backup URL

**What gets backed up:**
- All workspace scaffolding (`.workspace/`, `.cursor/`, `.claude/`)
- Development tools and configuration
- Documentation and reference materials
- Build configurations and scripts
- Project metadata and rules

**What's excluded:**
- `wallet.json` and private keys
- `.env*` files with secrets
- `node_modules/` and `dist/` directories
- Temporary and cache files

## 9. Access Your App

Your app is now:
- Permanently stored on Arweave
- Accessible from any Arweave gateway
- Immutable and censorship-resistant

Alternative URLs:
- `https://[TX_ID].arweave.net`
- `https://ar.io/[TX_ID]`
- `https://arweave.dev/[TX_ID]`

## Next Steps

### Register an ArNS Name

Instead of using a transaction ID, get a friendly URL:

1. Visit [ar.io](https://ar.io)
2. Register your name (e.g., `my-app`)
3. Point it to your transaction ID
4. Access at: `https://my-app.ar.io`

### Add Components

Create reusable components in `src/components/`:

```typescript
// src/components/Button.tsx
import './Button.css'

export function Button({ children, onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {children}
    </button>
  )
}
```

### Add State Management

Install Zustand for lightweight state management:

```bash
npm install zustand
```

### Add Routing

Install React Router for multi-page apps:

```bash
npm install react-router-dom
```

## Development Tips

### Hot Reload
Changes to your code will automatically reload in the browser.

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Preview Build
Test your production build locally:
```bash
npm run build
npm run preview
```

## Troubleshooting

### Build Errors

**Problem:** TypeScript errors during build
- **Solution:** Run `npm run typecheck` to see specific errors

**Problem:** CSS not loading
- **Solution:** Check import order in `src/index.css`

### Deployment Errors

**Problem:** Wallet not found
- **Solution:** Ensure wallet.json is at `.workspace/config/wallet.json`

**Problem:** Insufficient funds
- **Solution:** Check balance and fund your wallet with more AR

**Problem:** arkb not found
- **Solution:** Install globally: `npm install -g arkb`

### Runtime Errors

**Problem:** App not loading on Arweave
- **Solution:** Check browser console for errors
- Ensure `base: './'` in `vite.config.ts`

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Check types

# Version Management
.workspace/scripts/version-bump.sh patch   # Bump patch version
.workspace/scripts/version-bump.sh minor   # Bump minor version
.workspace/scripts/version-bump.sh major   # Bump major version

# File Synchronization
.workspace/scripts/doap-sync.sh            # Sync all files with doap.json
.workspace/scripts/doap-sync.sh --dry-run  # Preview sync changes

# Deployment
npm run deploy       # Production deploy (with confirmation)
npm run deploy:dev   # Dev deploy (no confirmation)
npm run deploy:quick # Quick deploy for testing

# Repository Backup
.workspace/scripts/backup-to-protocol-land.sh        # Complete workspace backup
.workspace/scripts/backup-to-protocol-land.sh --dry-run  # Test backup process
```

## File Structure

```
your-app/
├── src/
│   ├── App.tsx         # Main component
│   ├── App.css         # App styles
│   ├── main.tsx        # Entry point
│   ├── index.css       # Global styles
│   ├── style/          # CSS architecture
│   ├── components/     # Your components
│   └── utils/          # Utility functions
├── .workspace/
│   ├── config/
│   │   ├── wallet.json           # Your wallet (gitignored)
│   │   ├── wallet.json.example   # Template
│   │   └── deploy.config.js      # Deployment config
│   ├── docs/
│   │   └── ref/
│   │       └── reference.doap.json # DOAP schema reference
│   └── scripts/
│       ├── deploy-to-arweave.sh      # Main deploy script
│       ├── version-bump.sh           # Version management
│       ├── doap-sync.sh              # File synchronization
│       └── backup-to-protocol-land.sh # Repository backup
├── .cursor/
│   └── rules/
│       └── project_initialization.mdc # Placeholder replacement guide
├── plugins/
│   └── doap-metadata.ts          # Vite plugin for metadata injection
├── dist/               # Build output (gitignored)
├── doap.json           # Project metadata (source of truth)
├── index.html          # HTML entry with metadata placeholders
├── package.json        # Dependencies (synced from doap.json)
└── vite.config.ts      # Build config with metadata plugin
```

## Support

- **Documentation:** Check [README.md](./README.md) for detailed info
- **Issues:** GitHub Issues (your repo)
- **Arweave Docs:** https://docs.arweave.org
- **Community:** [Arweave Discord](https://discord.gg/arweave)

---

**Congratulations!** You're now building on the permaweb.

