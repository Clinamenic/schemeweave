#!/bin/bash

# Repository Backup to Arweave via Protocol.land
# Usage: ./backup-to-protocol-land.sh [--dry-run]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
WORKSPACE_DIR="$PROJECT_ROOT/.workspace"
CONFIG_DIR="$WORKSPACE_DIR/config"
BACKUP_DIR="$WORKSPACE_DIR/temp/backup-$(date +%Y%m%d-%H%M%S)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if dry run
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    log_info "Running in dry-run mode (no actual backup)"
fi

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if we're in a git repository
    if [[ ! -d ".git" ]]; then
        log_error "Not in a git repository. Please run from project root."
        exit 1
    fi
    
    # Check if protocol.land CLI is available
    if ! command -v protocol &> /dev/null; then
        log_warning "Protocol.land CLI not found. Please install it first."
        log_info "Visit https://protocol.land for installation instructions"
        exit 1
    fi
    
    # Check if arkb is available for Arweave operations
    if ! command -v arkb &> /dev/null; then
        log_warning "arkb not found. Please install arkb for Arweave operations."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Get current repository metadata
get_repo_metadata() {
    log_info "Gathering repository metadata..."
    
    # Get current commit hash
    COMMIT_HASH=$(git rev-parse HEAD)
    
    # Get current branch
    BRANCH=$(git branch --show-current)
    
    # Get repository URL
    REPO_URL=$(git remote get-url origin 2>/dev/null || echo "local")
    
    # Get current version from doap.json or package.json
    if [[ -f "doap.json" ]]; then
        VERSION=$(node -p "require('./doap.json').version" 2>/dev/null || echo "unknown")
        APP_NAME=$(node -p "require('./doap.json').name" 2>/dev/null || echo "project")
    else
        VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
        APP_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "project")
    fi
    
    log_success "Repository metadata gathered"
}

# Create backup directory with selective copying
create_backup() {
    log_info "Creating backup directory..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Copy entire workspace with exclusions
    log_info "Copying workspace files (excluding sensitive data)..."
    
    # Use rsync for efficient copying with exclusions
    rsync -av \
        --exclude='.git/' \
        --exclude='node_modules/' \
        --exclude='dist/' \
        --exclude='.env*' \
        --exclude='wallet.json' \
        --exclude='*.key' \
        --exclude='*.pem' \
        --exclude='.DS_Store' \
        --exclude='Thumbs.db' \
        --exclude='*.log' \
        --exclude='*.tmp' \
        --exclude='.workspace/temp/' \
        --exclude='.workspace/config/wallet.json' \
        --exclude='.workspace/config/*.key' \
        --exclude='.workspace/config/*.pem' \
        "$PROJECT_ROOT/" "$BACKUP_DIR/"
    
    # Remove the backup directory from itself to avoid recursion
    rm -rf "$BACKUP_DIR/.workspace/temp/"
    
    log_success "Backup directory created at $BACKUP_DIR"
}

# Generate backup manifest
generate_manifest() {
    log_info "Generating backup manifest..."
    
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local file_count=$(find "$BACKUP_DIR" -type f | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    
    # Create manifest file
    cat > "$BACKUP_DIR/BACKUP_MANIFEST.json" << EOF
{
  "@type": "BackupManifest",
  "timestamp": "$timestamp",
  "version": "$VERSION",
  "appName": "$APP_NAME",
  "commitHash": "$COMMIT_HASH",
  "branch": "$BRANCH",
  "repositoryUrl": "$REPO_URL",
  "fileCount": $file_count,
  "totalSize": "$total_size",
  "backupType": "complete-workspace",
  "description": "Complete workspace backup including dev tools and configuration",
  "exclusions": [
    ".git/",
    "node_modules/",
    "dist/",
    ".env*",
    "wallet.json",
    "*.key",
    "*.pem",
    ".DS_Store",
    "Thumbs.db",
    "*.log",
    "*.tmp",
    ".workspace/temp/",
    ".workspace/config/wallet.json",
    ".workspace/config/*.key",
    ".workspace/config/*.pem"
  ]
}
EOF
    
    log_success "Backup manifest generated"
}

# Upload to protocol.land
upload_to_protocol_land() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "DRY RUN: Would upload to protocol.land"
        PROTOCOL_LAND_URL="https://protocol.land/dry-run/backup"
        ARWEAVE_TX_ID="dry-run-tx-id"
        return 0
    fi
    
    log_info "Uploading backup to protocol.land..."
    
    # Create protocol.land repository if it doesn't exist
    local repo_name="${APP_NAME}-backup"
    local protocol_land_url="https://protocol.land/$(whoami)/$repo_name"
    
    # Initialize protocol.land repository
    cd "$BACKUP_DIR"
    
    # Use protocol.land CLI to create/update repository
    if protocol repo create "$repo_name" --public 2>/dev/null || true; then
        log_info "Repository created/updated on protocol.land"
    else
        log_warning "Could not create protocol.land repository, proceeding with upload"
    fi
    
    # Upload using arkb for Arweave integration
    local upload_output=$(arkb deploy "$BACKUP_DIR" \
        --wallet "$CONFIG_DIR/wallet.json" \
        --auto-confirm \
        --tag "App-Name" "$APP_NAME-backup" \
        --tag "App-Version" "$VERSION" \
        --tag "Content-Type" "application/json" \
        --tag "Backup-Type" "complete-workspace" \
        --tag "Backup-Date" "$(date -u +"%Y-%m-%d")" \
        --verbose 2>&1)
    
    if [[ $? -eq 0 ]]; then
        # Extract transaction ID
        ARWEAVE_TX_ID=$(echo "$upload_output" | grep -o 'https://arweave.net/[A-Za-z0-9_-]\{43\}' | sed 's|https://arweave.net/||' | head -1)
        PROTOCOL_LAND_URL="https://arweave.net/$ARWEAVE_TX_ID"
        
        if [[ -n "$ARWEAVE_TX_ID" ]]; then
            log_success "Backup uploaded successfully!"
            log_success "Transaction ID: $ARWEAVE_TX_ID"
            log_success "Protocol.land URL: $PROTOCOL_LAND_URL"
        else
            log_warning "Upload may have succeeded, but couldn't extract transaction ID"
        fi
    else
        log_error "Upload failed"
        echo "$upload_output"
        exit 1
    fi
}

# Update doap.json with backup record
update_doap_backup() {
    log_info "Updating doap.json with backup record..."
    
    if [[ -f "$PROJECT_ROOT/doap.json" ]]; then
        local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        local file_count=$(find "$BACKUP_DIR" -type f | wc -l)
        local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
        
        node -e "
            const fs = require('fs');
            const doapData = JSON.parse(fs.readFileSync('$PROJECT_ROOT/doap.json', 'utf8'));
            
            // Create backup record
            const backupRecord = {
                '@type': 'BackupRecord',
                timestamp: '$timestamp',
                version: '$VERSION',
                commitHash: '$COMMIT_HASH',
                branch: '$BRANCH',
                protocolLandUrl: '$PROTOCOL_LAND_URL',
                arweaveTxId: '$ARWEAVE_TX_ID',
                fileCount: $file_count,
                totalSize: '$total_size',
                backupType: 'complete-workspace',
                description: 'Complete workspace backup including dev tools and configuration'
            };
            
            // Initialize backupHistory array if it doesn't exist
            if (!doapData.backupHistory) {
                doapData.backupHistory = [];
            }
            
            // Add new backup record to the beginning of the array
            doapData.backupHistory.unshift(backupRecord);
            
            // Update dateModified
            doapData.dateModified = '$timestamp';
            
            // Write back to file
            fs.writeFileSync('$PROJECT_ROOT/doap.json', JSON.stringify(doapData, null, 2));
        "
        
        log_success "Updated doap.json with backup record"
    else
        log_warning "doap.json not found, skipping backup record update"
    fi
}

# Cleanup temporary files
cleanup() {
    log_info "Cleaning up temporary files..."
    
    if [[ -d "$BACKUP_DIR" ]]; then
        rm -rf "$BACKUP_DIR"
        log_success "Temporary backup directory removed"
    fi
}

# Main execution
main() {
    log_info "🔄 Repository Backup to Protocol.land"
    log_info "===================================="
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Execute backup workflow
    check_prerequisites
    get_repo_metadata
    create_backup
    generate_manifest
    upload_to_protocol_land
    update_doap_backup
    cleanup
    
    log_success "🎉 Backup completed successfully!"
    log_success "Protocol.land URL: $PROTOCOL_LAND_URL"
    log_success "Arweave Transaction: $ARWEAVE_TX_ID"
}

# Run main function with all arguments
main "$@"


