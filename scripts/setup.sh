#!/bin/bash

# CivicChain Database Population Setup Script
# This script helps set up and run the database population scripts

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "${CYAN}${1}${NC}"
}

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_header "🚀 CivicChain Database Population Setup"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/dummyData.json" ]; then
    print_error "dummyData.json not found in project root: $PROJECT_ROOT"
    print_info "Please run this script from the scripts directory of your CivicChain project"
    exit 1
fi

print_success "Found project root: $PROJECT_ROOT"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (version 14 or higher)"
    print_info "Visit: https://nodejs.org/en/download/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Check if we're in the scripts directory
cd "$SCRIPT_DIR"

# Check if axios is available in parent directory
if [ -f "$PROJECT_ROOT/node_modules/axios/package.json" ]; then
    print_success "Axios found in parent project"
    USE_PARENT_MODULES=true
else
    print_warning "Axios not found in parent project, will install locally"
    USE_PARENT_MODULES=false
fi

# Install dependencies if needed
if [ "$USE_PARENT_MODULES" = false ]; then
    if [ ! -f "node_modules/axios/package.json" ]; then
        print_info "Installing dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
fi

# Check configuration
print_info "Checking configuration..."
if [ -f "config.json" ]; then
    print_success "Configuration file found"
    
    # Extract API URL from config
    API_URL=$(node -e "console.log(JSON.parse(require('fs').readFileSync('config.json', 'utf8')).apiConfig.baseUrl)")
    print_info "API Base URL: $API_URL"
else
    print_error "Configuration file not found"
    exit 1
fi

# Function to run population script
run_population() {
    local script_name=$1
    local script_description=$2
    
    print_header "$script_description"
    echo "----------------------------------------------"
    
    if [ "$USE_PARENT_MODULES" = true ]; then
        # Use parent node_modules
        NODE_PATH="$PROJECT_ROOT/node_modules" node "$script_name"
    else
        # Use local node_modules
        node "$script_name"
    fi
}

# Show menu
echo ""
print_header "Available Options:"
echo "1. Test API connection"
echo "2. Run basic population script"
echo "3. Run enhanced population script (recommended)"
echo "4. Show configuration"
echo "5. Edit configuration"
echo "6. Exit"
echo ""

read -p "Choose an option (1-6): " choice

case $choice in
    1)
        print_info "Testing API connection..."
        if [ "$USE_PARENT_MODULES" = true ]; then
            NODE_PATH="$PROJECT_ROOT/node_modules" node -e "require('./populateDatabaseEnhanced.js').testApiConnection().then(result => { console.log('\\n' + (result ? '✓ Connection test: SUCCESS' : '✗ Connection test: FAILED')); process.exit(result ? 0 : 1); }).catch(err => { console.error('\\n✗ Connection test FAILED:', err.message); process.exit(1); })"
        else
            node -e "require('./populateDatabaseEnhanced.js').testApiConnection().then(result => { console.log('\\n' + (result ? '✓ Connection test: SUCCESS' : '✗ Connection test: FAILED')); process.exit(result ? 0 : 1); }).catch(err => { console.error('\\n✗ Connection test FAILED:', err.message); process.exit(1); })"
        fi
        ;;
    2)
        run_population "populateDatabase.js" "🔄 Running Basic Population Script"
        ;;
    3)
        run_population "populateDatabaseEnhanced.js" "🚀 Running Enhanced Population Script"
        ;;
    4)
        print_info "Current configuration:"
        cat config.json | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8')), null, 2))"
        ;;
    5)
        print_info "Opening configuration file for editing..."
        if command -v code &> /dev/null; then
            code config.json
        elif command -v nano &> /dev/null; then
            nano config.json
        elif command -v vi &> /dev/null; then
            vi config.json
        else
            print_warning "No suitable editor found. Please edit config.json manually."
        fi
        ;;
    6)
        print_info "Goodbye!"
        exit 0
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

print_success "Setup script completed!"
