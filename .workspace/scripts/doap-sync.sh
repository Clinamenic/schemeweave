#!/bin/bash

# DOAP.json Synchronization Script
#
# Purpose: Keep package.json, README.md, and other files synchronized with doap.json
# Usage: .workspace/scripts/doap-sync.sh [--dry-run]

set -euo pipefail

# Resolve repo root from this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Configuration
DOAP_JSON_PATH="$REPO_ROOT/doap.json"
PACKAGE_JSON_PATH="$REPO_ROOT/package.json"
README_PATH="$REPO_ROOT/README.md"
CHANGELOG_PATH="$REPO_ROOT/CHANGELOG.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if doap.json exists
if [[ ! -f "$DOAP_JSON_PATH" ]]; then
    echo -e "${RED}Error: doap.json not found at $DOAP_JSON_PATH${NC}"
    echo "Please ensure doap.json exists before running sync"
    exit 1
fi

# Parse command line arguments
DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo -e "${YELLOW}Running in dry-run mode${NC}"
fi

# Extract metadata from doap.json
extract_metadata() {
    node -e "
        const fs = require('fs');
        const doapData = JSON.parse(fs.readFileSync('$DOAP_JSON_PATH', 'utf8'));
        
        console.log('NAME=' + (doapData.name || ''));
        console.log('VERSION=' + (doapData.version || ''));
        console.log('DESCRIPTION=' + (doapData.description || ''));
        console.log('AUTHOR_NAME=' + (doapData.author?.name || ''));
        console.log('AUTHOR_EMAIL=' + (doapData.author?.email || ''));
        console.log('REPOSITORY_URL=' + (doapData.repository?.url || ''));
        console.log('HOMEPAGE_URL=' + (doapData.homepage || ''));
        console.log('KEYWORDS=' + (doapData.keywords?.join(', ') || ''));
    "
}

# Sync package.json
sync_package_json() {
    echo -e "${BLUE}Syncing package.json...${NC}"
    
    if [[ ! -f "$PACKAGE_JSON_PATH" ]]; then
        echo -e "${YELLOW}Warning: package.json not found, skipping${NC}"
        return
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}Would update package.json with:${NC}"
        echo "  name: $NAME"
        echo "  version: $VERSION"
        echo "  description: $DESCRIPTION"
        echo "  author: $AUTHOR_NAME <$AUTHOR_EMAIL>"
        echo "  repository: $REPOSITORY_URL"
        echo "  homepage: $HOMEPAGE_URL"
        echo "  keywords: $KEYWORDS"
        return
    fi
    
    node -e "
        const fs = require('fs');
        const packageData = JSON.parse(fs.readFileSync('$PACKAGE_JSON_PATH', 'utf8'));
        
        // Update fields from doap.json
        packageData.name = '$NAME';
        packageData.version = '$VERSION';
        packageData.description = '$DESCRIPTION';
        
        // Update author field
        if ('$AUTHOR_NAME' && '$AUTHOR_EMAIL') {
            packageData.author = '$AUTHOR_NAME <$AUTHOR_EMAIL>';
        }
        
        // Update repository field
        if ('$REPOSITORY_URL') {
            packageData.repository = {
                type: 'git',
                url: '$REPOSITORY_URL'
            };
        }
        
        // Update homepage
        if ('$HOMEPAGE_URL') {
            packageData.homepage = '$HOMEPAGE_URL';
        }
        
        // Update keywords
        if ('$KEYWORDS') {
            packageData.keywords = '$KEYWORDS'.split(', ').filter(k => k.trim());
        }
        
        // Write back to file
        fs.writeFileSync('$PACKAGE_JSON_PATH', JSON.stringify(packageData, null, 2));
    "
    
    echo -e "${GREEN}Updated package.json${NC}"
}

# Sync README.md
sync_readme() {
    echo -e "${BLUE}Syncing README.md...${NC}"
    
    if [[ ! -f "$README_PATH" ]]; then
        echo -e "${YELLOW}Warning: README.md not found, skipping${NC}"
        return
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}Would update README.md with:${NC}"
        echo "  Title: $NAME"
        echo "  Description: $DESCRIPTION"
        echo "  Version: $VERSION"
        return
    fi
    
    # Update README.md title and description
    sed -i.bak "s/^# .*/# $NAME/" "$README_PATH"
    sed -i.bak "s/^## Description.*/## Description\n\n$DESCRIPTION/" "$README_PATH"
    
    # Remove backup file
    rm -f "$README_PATH.bak"
    
    echo -e "${GREEN}Updated README.md${NC}"
}

# Validate synchronization
validate_sync() {
    echo -e "${BLUE}Validating synchronization...${NC}"
    
    # Check if package.json version matches doap.json
    if [[ -f "$PACKAGE_JSON_PATH" ]]; then
        local package_version=$(node -p "require('$PACKAGE_JSON_PATH').version" 2>/dev/null || echo "")
        if [[ "$package_version" != "$VERSION" ]]; then
            echo -e "${RED}Error: Version mismatch - package.json: $package_version, doap.json: $VERSION${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}Validation passed${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🔄 DOAP.json Synchronization${NC}"
    echo -e "${BLUE}============================${NC}"
    
    # Extract metadata from doap.json
    echo -e "${BLUE}Extracting metadata from doap.json...${NC}"
    eval $(extract_metadata)
    
    echo -e "${GREEN}Extracted metadata:${NC}"
    echo "  Name: $NAME"
    echo "  Version: $VERSION"
    echo "  Description: $DESCRIPTION"
    echo "  Author: $AUTHOR_NAME <$AUTHOR_EMAIL>"
    echo "  Repository: $REPOSITORY_URL"
    echo "  Homepage: $HOMEPAGE_URL"
    echo "  Keywords: $KEYWORDS"
    echo ""
    
    # Sync files
    sync_package_json
    sync_readme
    
    # Validate synchronization
    validate_sync
    
    echo -e "${GREEN}✅ Synchronization complete!${NC}"
    echo ""
    echo "Synced files:"
    echo "  - package.json"
    echo "  - README.md"
    echo ""
    echo "All files are now synchronized with doap.json"
}

# Run main function with all arguments
main "$@"
