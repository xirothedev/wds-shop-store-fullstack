#!/bin/bash

################################################################################
# WDS Shop Store - VPS Deployment Script
#
# This script automates the deployment process to an Ubuntu VPS using PM2.
#
# Prerequisites:
#   - Ubuntu VPS with SSH access
#   - Node.js latest installed
#   - pnpm installed
#   - Neon database (serverless Postgres) configured
#   - Domain name configured (optional)
#
# Usage:
#   ./scripts/vps-deploy.sh [setup|deploy|restart|stop|logs|status]
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Log directory
LOG_DIR="$PROJECT_ROOT/logs"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install the latest Node.js LTS version."
        exit 1
    fi

    # Node.js version check (ensure it's not too old)
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_warning "Node.js version 20 or higher recommended. Current version: $(node -v)"
    fi
    print_success "Node.js $(node -v) installed"

    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not installed. Installing..."
        npm install -g pnpm
    fi
    print_success "pnpm $(pnpm -v) installed"

    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 is not installed. Installing..."
        npm install -g pm2
    fi
    print_success "PM2 $(pm2 -v) installed"

    # Create logs directory
    mkdir -p "$LOG_DIR"
    print_success "Logs directory created at $LOG_DIR"
}

# Function to setup environment files
setup_env_files() {
    print_info "Setting up environment files..."

    # API .env
    if [ ! -f "$PROJECT_ROOT/apps/api/.env" ]; then
        if [ -f "$PROJECT_ROOT/apps/api/.env.example" ]; then
            cp "$PROJECT_ROOT/apps/api/.env.example" "$PROJECT_ROOT/apps/api/.env"
            print_warning "Created apps/api/.env from .env.example. Please update with your production values."
        else
            print_warning "No .env.example found in apps/api. Creating basic .env file..."
            cat > "$PROJECT_ROOT/apps/api/.env" << EOF
NODE_ENV=production
PORT=4000
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wds_shop"
# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRATION=7d
# CORS
CORS_ORIGIN="http://localhost:3000,https://yourdomain.com"
EOF
            print_warning "Created basic apps/api/.env. Please update with your production values!"
        fi
    else
        print_success "apps/api/.env already exists"
    fi

    # Web .env
    if [ ! -f "$PROJECT_ROOT/apps/web/.env" ]; then
        if [ -f "$PROJECT_ROOT/apps/web/.env.example" ]; then
            cp "$PROJECT_ROOT/apps/web/.env.example" "$PROJECT_ROOT/apps/web/.env"
            print_warning "Created apps/web/.env from .env.example. Please update with your production values."
        else
            print_warning "No .env.example found in apps/web. Creating basic .env file..."
            cat > "$PROJECT_ROOT/apps/web/.env" << EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL="http://localhost:4000"
EOF
            print_warning "Created basic apps/web/.env. Please update with your production values!"
        fi
    else
        print_success "apps/web/.env already exists"
    fi
}

# Function to install dependencies and build
install_and_build() {
    print_info "Installing dependencies..."
    cd "$PROJECT_ROOT"
    pnpm install --frozen-lockfile
    print_success "Dependencies installed"

    print_info "Building applications..."
    pnpm build
    print_success "Applications built successfully"
}

# Function to setup PM2 startup
setup_pm2_startup() {
    print_info "Setting up PM2 startup script..."
    pm2 startup
    print_info "PM2 startup configured. Run the command above to enable auto-start on boot."
}

# Function to deploy applications
deploy() {
    print_info "Starting deployment..."

    # Stop existing processes
    print_info "Stopping existing PM2 processes..."
    pm2 stop wds-api wds-web 2>/dev/null || true
    pm2 delete wds-api wds-web 2>/dev/null || true

    # Start with ecosystem config
    print_info "Starting applications with PM2..."
    pm2 start "$PROJECT_ROOT/ecosystem.config.js"

    # Save PM2 process list
    pm2 save

    print_success "Deployment completed successfully!"
    print_info "Application status:"
    pm2 status
}

# Function to restart applications
restart() {
    print_info "Restarting applications..."
    pm2 restart wds-api wds-web
    print_success "Applications restarted"
}

# Function to stop applications
stop() {
    print_info "Stopping applications..."
    pm2 stop wds-api wds-web
    print_success "Applications stopped"
}

# Function to show logs
logs() {
    pm2 logs wds-api wds-web
}

# Function to show status
status() {
    pm2 status
    pm2 describe wds-api
    pm2 describe wds-web
}

# Main script logic
main() {
    case "${1:-deploy}" in
        setup)
            print_info "Running initial setup..."
            check_prerequisites
            setup_env_files
            install_and_build
            setup_pm2_startup
            print_success "Setup completed! Now run './scripts/vps-deploy.sh deploy' to deploy."
            ;;
        deploy)
            check_prerequisites
            setup_env_files
            install_and_build
            deploy
            ;;
        restart)
            restart
            ;;
        stop)
            stop
            ;;
        logs)
            logs
            ;;
        status)
            status
            ;;
        *)
            echo "Usage: $0 {setup|deploy|restart|stop|logs|status}"
            echo ""
            echo "Commands:"
            echo "  setup    - Initial setup (install dependencies, build, configure PM2)"
            echo "  deploy   - Deploy applications to PM2"
            echo "  restart  - Restart all applications"
            echo "  stop     - Stop all applications"
            echo "  logs     - Show application logs"
            echo "  status   - Show application status"
            exit 1
            ;;
    esac
}

main "$@"
