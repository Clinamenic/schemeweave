# Project Backup System to Arweave via Protocol.land

**Created:** 2025-10-22T19:31:25Z  
**Status:** Planning Phase  
**Target:** 005d_project_backup rule implementation

## Baseline Knowledge

### Current Repository Structure
- **Template workspace**: `starter-permadapp/` contains scaffolding for new projects
- **Key directories**: `.workspace/`, `.cursor/`, `src/`, `dist/`
- **Configuration files**: `doap.json`, `package.json`, `vite.config.ts`
- **Sensitive files**: `.workspace/config/wallet.json`, `.env` files
- **Documentation**: `.workspace/docs/` with planning, architecture, and reference docs

### Protocol.land Integration Requirements
- **Arweave-based**: Permanent storage for entire repository
- **Git-compatible**: Must support standard Git operations
- **Selective backup**: Include workspace scaffolding, exclude sensitive data
- **Automation**: Integrate with existing deployment workflow

### Existing Framework Integration Points
- **005a_project_initialization.mdc**: Project setup workflow
- **005b_project_update.mdc**: Version management workflow  
- **005c_project_deploy.mdc**: Deployment workflow
- **doap.json**: Central metadata source
- **deploy-to-arweave.sh**: Main deployment script

## Type Definitions

### Backup Configuration
```typescript
interface BackupConfig {
  protocolLandRepo: string;
  excludePatterns: string[];
  includeWorkspace: boolean;
  backupFrequency: 'manual' | 'on-deploy' | 'scheduled';
  encryptionRequired: boolean;
}

interface BackupManifest {
  timestamp: string;
  version: string;
  commitHash: string;
  protocolLandUrl: string;
  arweaveTxId: string;
  fileCount: number;
  totalSize: string;
}
```

### Backup Script Interface
```typescript
interface BackupScript {
  createBackup(): Promise<BackupManifest>;
  verifyBackup(manifest: BackupManifest): Promise<boolean>;
  restoreFromBackup(manifest: BackupManifest): Promise<void>;
}
```

## Implementation Order

### Phase 1: Research and Setup
1. **Protocol.land Account Setup**
   - Create account on protocol.land
   - Configure Arweave wallet integration
   - Test basic repository operations

2. **Backup Strategy Design**
   - Define exclusion patterns for sensitive files
   - Design backup manifest structure
   - Plan integration with existing workflow

### Phase 2: Core Backup Script
3. **Create `.workspace/scripts/backup-to-protocol-land.sh`**
   - Implement selective file copying
   - Handle sensitive file exclusion
   - Generate backup manifest
   - Push to protocol.land repository

4. **Backup Verification System**
   - Implement backup integrity checks
   - Create restoration testing
   - Add backup validation commands

### Phase 3: Framework Integration
5. **Update 005d_project_backup.mdc Rule**
   - Define backup workflow standards
   - Specify exclusion patterns
   - Document verification procedures

6. **Integrate with Existing Workflow**
   - Add backup step to deployment process
   - Update doap.json with backup metadata
   - Create backup history tracking

### Phase 4: Automation and Documentation
7. **Automated Backup Triggers**
   - Integrate with version-bump.sh
   - Add to deploy-to-arweave.sh workflow
   - Create scheduled backup option

8. **Documentation and Testing**
   - Update QUICKSTART.md with backup procedures
   - Create backup restoration guide
   - Test end-to-end backup workflow

## Integration Points

### File System Integration
- **Source**: Entire workspace including `.workspace/` directories
- **Exclusions**: `wallet.json`, `.env*`, `node_modules/`, `dist/`
- **Manifest**: Backup metadata in `.workspace/config/backups.json`

### Workflow Integration
- **Initialization**: Add backup setup to 005a workflow
- **Updates**: Trigger backup on version bumps (005b)
- **Deployment**: Include backup in deployment process (005c)
- **Metadata**: Update doap.json with backup information

### Protocol.land Integration
- **Repository**: Create dedicated backup repository
- **Authentication**: Use Arweave wallet for protocol.land access
- **Persistence**: Leverage Arweave's permanent storage
- **Access**: Public repository with backup history

## Success Criteria

### Functional Requirements
- **Complete backup**: Entire workspace preserved excluding sensitive files
- **Protocol.land integration**: Successful push to Arweave-based repository
- **Manifest generation**: Accurate backup metadata and verification
- **Restoration capability**: Ability to restore from backup

### Performance Requirements
- **Backup time**: Complete backup in under 5 minutes
- **Storage efficiency**: Minimal duplicate data storage
- **Verification speed**: Backup validation in under 2 minutes

### Integration Requirements
- **Workflow compatibility**: Seamless integration with existing rules
- **Metadata consistency**: Backup info in doap.json and local config
- **Documentation**: Clear backup and restoration procedures

## Risk & Rollback

### Primary Risks
- **Sensitive data exposure**: Wallet files or secrets in backup
- **Protocol.land availability**: Service downtime affecting backups
- **Storage costs**: Arweave transaction fees for large repositories
- **Authentication issues**: Wallet access problems

### Mitigation Strategies
- **Exclusion patterns**: Comprehensive sensitive file filtering
- **Local fallback**: Maintain local backup copies
- **Cost monitoring**: Track Arweave transaction costs
- **Multiple wallets**: Backup authentication methods

### Rollback Plan
- **Local restoration**: Use local Git repository as primary source
- **Manual backup**: Fallback to manual protocol.land operations
- **Alternative storage**: Consider other Arweave-based solutions
- **Documentation**: Clear rollback procedures in documentation

## Implementation Requirements (Confirmed)

### Backup Strategy
- **Frequency**: Manual backups when user invokes 005d rule
- **Scope**: Complete workspace including dev, config, and workspace files
- **Exclusions**: Only truly sensitive files (wallet.json, .env, private keys)
- **Repository**: GitHub as primary, protocol.land as backup destination
- **History**: Comprehensive backup history in doap.json
- **Access**: Public protocol.land repository
- **Implementation**: Standalone backup script triggered by 005d rule

### File Inclusion Strategy
- **Include**: All workspace scaffolding, dev tools, config files, documentation
- **Include**: .workspace/, .cursor/, .claude/ directories
- **Include**: Build configs, scripts, rules, documentation
- **Exclude**: Only wallet.json, .env*, private keys, temporary files
- **Exclude**: node_modules/, dist/, .git/ (standard exclusions)

### Backup History Management
- **doap.json Integration**: Add backupHistory array with comprehensive records
- **Metadata Tracking**: Timestamp, version, commit hash, protocol.land URL
- **Verification**: File counts, checksums, backup integrity
- **Retention**: Keep all backup records for complete history
