#!/bin/bash

################################################################################
# WDS Shoe Store - Nginx Setup Script
# Domain: shoe.naberious.dev (Web) & api.shoe.naberious.dev (API)
#
# This script sets up Nginx configuration for the specific domains.
#
# Usage:
#   sudo ./scripts/nginx-setup-shoe.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WEB_DOMAIN="shoe.naberious.dev"
API_DOMAIN="api.shoe.naberious.dev"
PROJECT_ROOT="/home/xiro/workspace/wds-shop-store-fullstack"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONF_DIR="/etc/nginx/conf.d"

# Functions
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root (use sudo)"
    exit 1
fi

# Display configuration
print_info "Nginx Setup for WDS Shoe Store"
echo "================================"
echo "Web Domain:     $WEB_DOMAIN"
echo "API Domain:     $API_DOMAIN"
echo "Project Root:   $PROJECT_ROOT"
echo "================================"
echo ""
read -p "Continue? (y/n): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    print_info "Aborted by user"
    exit 0
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    print_info "Installing Nginx..."
    apt update
    apt install -y nginx
    print_success "Nginx installed"
else
    print_success "Nginx is already installed"
fi

# Create shared configuration
print_info "Creating shared Nginx configuration..."
cp "$PROJECT_ROOT/nginx/turborepo-common.conf" "$NGINX_CONF_DIR/turborepo-common.conf"
print_success "Shared configuration created"

# Create Web configuration
print_info "Creating Nginx configuration for $WEB_DOMAIN..."
cp "$PROJECT_ROOT/nginx/$WEB_DOMAIN.conf" "$NGINX_SITES_AVAILABLE/$WEB_DOMAIN"
print_success "Web configuration created"

# Create API configuration
print_info "Creating Nginx configuration for $API_DOMAIN..."
cp "$PROJECT_ROOT/nginx/$API_DOMAIN.conf" "$NGINX_SITES_ENABLED/$API_DOMAIN"
print_success "API configuration created"

# Enable sites
print_info "Enabling Nginx sites..."
rm -f "$NGINX_SITES_ENABLED/$WEB_DOMAIN" 2>/dev/null || true
rm -f "$NGINX_SITES_ENABLED/$API_DOMAIN" 2>/dev/null || true
rm -f "$NGINX_SITES_ENABLED/default" 2>/dev/null || true

ln -sf "$NGINX_SITES_AVAILABLE/$WEB_DOMAIN" "$NGINX_SITES_ENABLED/$WEB_DOMAIN"
ln -sf "$NGINX_SITES_AVAILABLE/$API_DOMAIN" "$NGINX_SITES_ENABLED/$API_DOMAIN"
print_success "Sites enabled"

# Test Nginx configuration
print_info "Testing Nginx configuration..."
if nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Restart Nginx
print_info "Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx
print_success "Nginx restarted and enabled"

# Install Certbot
if ! command -v certbot &> /dev/null; then
    print_info "Installing Certbot for SSL..."
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_success "Certbot is already installed"
fi

# Prompt for SSL
echo ""
print_warning "SSL certificates will be obtained using Let's Encrypt."
echo "Make sure DNS records point to this server:"
echo "  - $WEB_DOMAIN"
echo "  - $API_DOMAIN"
echo ""
read -p "Obtain SSL certificates now? (y/n): " obtain_ssl

if [[ "$obtain_ssl" =~ ^[Yy]$ ]]; then
    print_info "Obtaining SSL certificate for $WEB_DOMAIN..."
    certbot --nginx -d "$WEB_DOMAIN" --non-interactive --agree-tos --email "admin@$WEB_DOMAIN" --redirect || true

    print_info "Obtaining SSL certificate for $API_DOMAIN..."
    certbot --nginx -d "$API_DOMAIN" --non-interactive --agree-tos --email "admin@$WEB_DOMAIN" --redirect || true
fi

# Summary
echo ""
echo "════════════════════════════════════════════════════════════════"
print_success "Nginx setup completed!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "URLs:"
echo "  Web:  https://$WEB_DOMAIN"
echo "  API:  https://$API_DOMAIN"
echo ""
echo "Config files:"
echo "  /etc/nginx/sites-available/$WEB_DOMAIN"
echo "  /etc/nginx/sites-available/$API_DOMAIN"
echo ""
echo "Commands:"
echo "  Test:   sudo nginx -t"
echo "  Reload: sudo systemctl reload nginx"
echo "  Logs:   sudo tail -f /var/log/nginx/${WEB_DOMAIN}-error.log"
echo "════════════════════════════════════════════════════════════════"
