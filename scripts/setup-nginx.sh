#!/bin/bash

################################################################################
# WDS Shop Store - Nginx Setup Script
#
# This script automates Nginx configuration for Turborepo deployment.
# Configures reverse proxy for Next.js frontend and NestJS API with SSL.
#
# Usage:
#   sudo ./scripts/setup-nginx.sh [domain] [api_domain]
#
# Examples:
#   sudo ./scripts/setup-nginx.sh example.com api.example.com
#   sudo ./scripts/setup-nginx.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Default values
WEB_DOMAIN="${1:-}"
API_DOMAIN="${2:-}"
WEB_ROOT="${WEB_ROOT:-/home/$SUDO_USER/wds-shop-store-fullstack}"
API_PORT="${API_PORT:-4000}"
WEB_PORT="${WEB_PORT:-3000}"
EMAIL="${EMAIL:-admin@${WEB_DOMAIN:-localhost}}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root (use sudo)"
    exit 1
fi

# Prompt for domains if not provided
if [ -z "$WEB_DOMAIN" ]; then
    echo ""
    read -p "Enter your main domain (e.g., example.com): " WEB_DOMAIN
    read -p "Enter your API domain (e.g., api.example.com) [default: api.$WEB_DOMAIN]: " input_api
    API_DOMAIN="${input_api:-api.$WEB_DOMAIN}"
fi

if [ -z "$WEB_DOMAIN" ]; then
    print_error "Domain is required"
    exit 1
fi

# Display configuration
print_info "Nginx Configuration"
echo "================================"
echo "Web Domain:     $WEB_DOMAIN"
echo "API Domain:     $API_DOMAIN"
echo "Web Root:       $WEB_ROOT"
echo "API Port:       $API_PORT"
echo "Web Port:       $WEB_PORT"
echo "================================"
echo ""
read -p "Continue? (y/n): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    print_info "Aborted by user"
    exit 0
fi

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    print_info "Installing Nginx..."
    apt update
    apt install -y nginx
    print_success "Nginx installed"
else
    print_success "Nginx is already installed"
fi

# Create Nginx configuration directory
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONF_DIR="/etc/nginx/conf.d"

# Create shared configuration for Turborepo apps
print_info "Creating shared Nginx configuration..."

cat > "$NGINX_CONF_DIR/turborepo-common.conf" << 'EOF'
# Common configuration for Turborepo applications

# Upstream for Next.js application
upstream nextjs_upstream {
    server localhost:3000;
    keepalive 64;
}

# Upstream for NestJS API
upstream nestjs_upstream {
    server localhost:4000;
    keepalive 64;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=web_limit:10m rate=30r/s;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# Remove Nginx version
server_tokens off;
EOF

print_success "Shared configuration created"

# Create Web configuration (Next.js)
print_info "Creating Nginx configuration for web application..."

cat > "$NGINX_SITES_AVAILABLE/$WEB_DOMAIN" << EOF
# Redirect HTTP to HTTPS (will be handled by Certbot)
server {
    listen 80;
    listen [::]:80;
    server_name $WEB_DOMAIN www.$WEB_DOMAIN;

    # Allow Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect to HTTPS (temporary, will be updated by Certbot)
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS configuration (will be updated by Certbot)
server {
    listen 80;
    listen [::]:80;
    server_name $WEB_DOMAIN www.$WEB_DOMAIN;

    # Security headers
    include /etc/nginx/conf.d/turborepo-common.conf;

    # Add CSP header (adjust for your needs)
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://$API_DOMAIN;" always;

    # Client body size limit
    client_max_body_size 10M;

    # Rate limiting
    limit_req zone=web_limit burst=50 nodelay;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Next.js static files (served directly by Nginx)
    location /_next/static {
        alias $WEB_ROOT/apps/web/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Next.js static assets
    location /static {
        alias $WEB_ROOT/apps/web/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Public files
    location /public {
        alias $WEB_ROOT/apps/web/public;
        add_header Cache-Control "public, max-age=86400";
        access_log off;
    }

    # Favicon and robots.txt
    location = /favicon.ico {
        alias $WEB_ROOT/apps/web/public/favicon.ico;
        access_log off;
        log_not_found off;
    }

    location = /robots.txt {
        alias $WEB_ROOT/apps/web/public/robots.txt;
        access_log off;
        log_not_found off;
    }

    # Next.js images optimization
    location /_next/image {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_cache_valid 200 60m;
        add_header X-Cache-Status \$upstream_cache_status;
    }

    # All other requests to Next.js
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://nextjs_upstream;
        access_log off;
    }
}
EOF

print_success "Web configuration created"

# Create API configuration (NestJS)
print_info "Creating Nginx configuration for API..."

cat > "$NGINX_SITES_AVAILABLE/$API_DOMAIN" << EOF
# Redirect HTTP to HTTPS (will be handled by Certbot)
server {
    listen 80;
    listen [::]:80;
    server_name $API_DOMAIN;

    # Allow Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect to HTTPS (temporary, will be updated by Certbot)
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS configuration (will be updated by Certbot)
server {
    listen 80;
    listen [::]:80;
    server_name $API_DOMAIN;

    # Security headers
    include /etc/nginx/conf.d/turborepo-common.conf;

    # API-specific security
    add_header Content-Security-Policy "default-src 'none'" always;

    # Client body size limit (for file uploads)
    client_max_body_size 50M;

    # Rate limiting for API
    limit_req zone=api_limit burst=20 nodelay;

    # CORS handling (basic - your app should handle CORS)
    add_header Access-Control-Allow-Origin "https://$WEB_DOMAIN" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization" always;

    # Handle OPTIONS for CORS preflight
    if (\$request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "https://$WEB_DOMAIN";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization";
        add_header Access-Control-Max-Age 1728000;
        add_header Content-Type 'text/plain; charset=utf-8';
        add_header Content-Length 0;
        return 204;
    }

    # Gzip compression for API responses
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types application/json application/xml text/xml text/plain application/javascript;

    # API documentation (Swagger)
    location /api/docs {
        proxy_pass http://nestjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # All API requests
    location / {
        proxy_pass http://nestjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts (API can take longer)
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
        proxy_read_timeout 90s;

        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://nestjs_upstream;
        access_log off;
    }

    # API-specific monitoring endpoint
    location /metrics {
        # Require basic auth (optional - uncomment to enable)
        # auth_basic "API Metrics";
        # auth_basic_user_file /etc/nginx/.htpasswd;
        proxy_pass http://nestjs_upstream;
        access_log off;
    }
}
EOF

print_success "API configuration created"

# Enable sites
print_info "Enabling Nginx sites..."

# Remove existing symlinks if they exist
rm -f "$NGINX_SITES_ENABLED/$WEB_DOMAIN" 2>/dev/null || true
rm -f "$NGINX_SITES_ENABLED/$API_DOMAIN" 2>/dev/null || true
rm -f "$NGINX_SITES_ENABLED/default" 2>/dev/null || true

# Create new symlinks
ln -sf "$NGINX_SITES_AVAILABLE/$WEB_DOMAIN" "$NGINX_SITES_ENABLED/$WEB_DOMAIN"
ln -sf "$NGINX_SITES_AVAILABLE/$API_DOMAIN" "$NGINX_SITES_ENABLED/$API_DOMAIN"

print_success "Sites enabled"

# Test Nginx configuration
print_info "Testing Nginx configuration..."
if nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    print_info "Run 'nginx -t' to see errors"
    exit 1
fi

# Restart Nginx
print_info "Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx
print_success "Nginx restarted and enabled"

# Install Certbot if not present
if ! command -v certbot &> /dev/null; then
    print_info "Installing Certbot for SSL..."
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_success "Certbot is already installed"
fi

# Prompt for SSL setup
echo ""
print_warning "SSL certificates will be obtained using Let's Encrypt."
echo "Make sure:"
echo "  1. DNS records for $WEB_DOMAIN and $API_DOMAIN point to this server"
echo "  2. Port 80 is accessible from the internet"
echo "  3. No other services are blocking port 80"
echo ""
read -p "Obtain SSL certificates now? (y/n): " obtain_ssl

if [[ "$obtain_ssl" =~ ^[Yy]$ ]]; then
    print_info "Obtaining SSL certificate for $WEB_DOMAIN..."
    if certbot --nginx -d "$WEB_DOMAIN" -d "www.$WEB_DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --redirect; then
        print_success "SSL certificate obtained for $WEB_DOMAIN"
    else
        print_warning "Failed to obtain SSL for $WEB_DOMAIN. You can run manually:"
        print_info "sudo certbot --nginx -d $WEB_DOMAIN -d www.$WEB_DOMAIN"
    fi

    print_info "Obtaining SSL certificate for $API_DOMAIN..."
    if certbot --nginx -d "$API_DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --redirect; then
        print_success "SSL certificate obtained for $API_DOMAIN"
    else
        print_warning "Failed to obtain SSL for $API_DOMAIN. You can run manually:"
        print_info "sudo certbot --nginx -d $API_DOMAIN"
    fi
else
    print_info "Skipping SSL setup. Run manually when ready:"
    print_info "sudo certbot --nginx -d $WEB_DOMAIN -d www.$WEB_DOMAIN"
    print_info "sudo certbot --nginx -d $API_DOMAIN"
fi

# Setup log rotation for custom logs
print_info "Setting up log rotation..."

cat > /etc/logrotate.d/turborepo-apps << 'EOF'
/var/log/nginx/*-access.log
/var/log/nginx/*-error.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}
EOF

print_success "Log rotation configured"

# Display summary
echo ""
echo "════════════════════════════════════════════════════════════════"
print_success "Nginx setup completed!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Configuration Summary:"
echo "  Web URL:     https://$WEB_DOMAIN"
echo "  API URL:     https://$API_DOMAIN"
echo "  Config files: /etc/nginx/sites-available/$WEB_DOMAIN"
echo "               /etc/nginx/sites-available/$API_DOMAIN"
echo ""
echo "Next Steps:"
echo "  1. Ensure your applications are running:"
echo "     pm2 status"
echo ""
echo "  2. Test your websites:"
echo "     curl https://$WEB_DOMAIN"
echo "     curl https://$API_DOMAIN/health"
echo ""
echo "  3. Check Nginx logs if needed:"
echo "     tail -f /var/log/nginx/${WEB_DOMAIN}-error.log"
echo "     tail -f /var/log/nginx/${API_DOMAIN}-error.log"
echo ""
echo "  4. Renewal of SSL certificates is automatic (certbot timer)"
echo ""
echo "Useful Commands:"
echo "  Test Nginx config:    sudo nginx -t"
echo "  Reload Nginx:         sudo systemctl reload nginx"
echo "  Restart Nginx:        sudo systemctl restart nginx"
echo "  View Nginx status:    sudo systemctl status nginx"
echo "  Renew SSL manually:   sudo certbot renew"
echo "════════════════════════════════════════════════════════════════"
