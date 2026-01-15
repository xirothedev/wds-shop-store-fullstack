# VPS Deployment Guide with PM2

This guide covers deploying the WDS Shop Store application to an Ubuntu VPS using PM2 process manager.

## Prerequisites

### VPS Requirements

- **OS**: Ubuntu 20.04 or 22.04 LTS
- **RAM**: Minimum 1GB (2GB recommended)
- **CPU**: 1+ cores
- **Storage**: 10GB+ SSD

### Software Required

- **Node.js**: Latest LTS version (20+ recommended)
- **pnpm**: Latest version
- **Neon Database**: Serverless Postgres (https://neon.tech)
- **PM2**: Latest version
- **Git**: For cloning repository
- **Nginx** (optional): For reverse proxy and SSL

### External Services

- **Neon Database**: Create a free account at https://neon.tech
- **Cloudflare R2** (optional): For file storage
- **Domain name** (optional): For production deployment

## Initial Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Latest Node.js LTS

```bash
# Using NodeSource repository for latest LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show latest LTS version
npm -v
```

### 3. Install pnpm

```bash
npm install -g pnpm
pnpm -v
```

### 4. Install PM2

```bash
npm install -g pm2
pm2 -v
```

### 5. Install Git

```bash
sudo apt install -y git
```

### 6. (Optional) Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Neon Database Setup

### 1. Create Neon Database

1. Go to https://neon.tech and sign up for a free account
2. Create a new project
3. Copy the connection string

### 2. Get Neon Connection String

From Neon dashboard, get your connection string in this format:

```
postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
```

Note: Neon automatically uses connection pooling with `?sslmode=require` and `?pgbouncer=true` parameters.

## Application Deployment

### 1. Clone Repository

```bash
# Clone to your home directory or /var/www
cd ~
git clone <your-repository-url> wds-shop-store-fullstack
cd wds-shop-store-fullstack
```

### 2. Configure Environment Variables

#### API Environment (`apps/api/.env`)

```bash
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```

Update with production values:

```bash
PORT="4000"

# Database - Use Neon connection string
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Secrets (generate strong random strings)
SESSION_SECRET="your-session-secret-here"
CSRF_SECRET="your-csrf-secret-here"
JWT_SECRET="your-jwt-secret-here"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS (update with your domain)
CORS_ORIGIN="https://yourdomain.com"

# Swagger credentials
SWAGGER_USERNAME="admin@yourdomain.com"
SWAGGER_PASSWORD="secure_password_here"

# Mail service (optional)
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"

# Cloudflare R2 (optional)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="wds-shoe-store"
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
R2_PUBLIC_URL="cdn.yourdomain.com"
```

#### Web Environment (`apps/web/.env`)

```bash
cp apps/web/.env.example apps/web/.env
nano apps/web/.env
```

Update with production values:

```bash
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

### 3. Run Database Migrations

```bash
cd apps/api
npx prisma generate
npx prisma migrate deploy
cd ../..
```

Note: Prisma will automatically connect to your Neon database using the `DATABASE_URL`.

### 4. Build Application

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build both applications
pnpm build
```

### 5. Start with PM2

```bash
# Option 1: Use the deployment script
./scripts/vps-deploy.sh deploy

# Option 2: Start directly with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save
```

### 6. Verify Application Status

```bash
# Check status
pm2 status

# View logs
pm2 logs wds-api wds-web

# Monitor
pm2 monit
```

## Setup PM2 Startup on Boot

To ensure applications restart automatically after server reboot:

```bash
# Generate startup command
pm2 startup

# Copy and run the command output by the above command
# It will be something like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_username --hp /home/your_username
```

## Nginx Configuration (Recommended)

For production, it's recommended to use Nginx as a reverse proxy with SSL. The project includes an automated setup script that configures Nginx specifically for Turborepo applications.

### Automated Setup (Recommended)

The automated script handles:

- Nginx installation and configuration
- Reverse proxy for Next.js (port 3000) and NestJS API (port 4000)
- SSL certificates with Let's Encrypt
- Security headers and rate limiting
- Gzip compression
- Static file caching for Next.js assets
- Health check endpoints

```bash
# Run the automated setup script
sudo ./scripts/setup-nginx.sh yourdomain.com api.yourdomain.com
```

The script will:

1. Install Nginx if not present
2. Create optimized configurations for Turborepo
3. Set up SSL certificates automatically
4. Configure security headers and rate limiting
5. Enable and restart Nginx

**Note:** Make sure your DNS records point to the server before running the script.

### Manual Setup

If you prefer manual configuration or need custom settings:

#### Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Web Configuration (`/etc/nginx/sites-available/yourdomain.com`)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Next.js static files (cached)
    location /_next/static {
        alias /home/your-username/wds-shop-store-fullstack/apps/web/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # All other requests to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### API Configuration (`/etc/nginx/sites-available/api.yourdomain.com`)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # CORS
    add_header Access-Control-Allow-Origin "https://yourdomain.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;

    # Handle OPTIONS for CORS preflight
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    # API requests
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Sites

```bash
# Create symbolic links
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Setup SSL with Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Certbot will auto-renew certificates via systemd timer
```

## Deployment Commands

### Application Deployment Scripts

```bash
# Initial setup (installs dependencies, builds, configures PM2)
./scripts/vps-deploy.sh setup

# Deploy applications
./scripts/vps-deploy.sh deploy

# Restart applications
./scripts/vps-deploy.sh restart

# Stop applications
./scripts/vps-deploy.sh stop

# View logs
./scripts/vps-deploy.sh logs

# Check status
./scripts/vps-deploy.sh status
```

### Nginx Setup Script

```bash
# Automated Nginx setup with SSL (recommended)
sudo ./scripts/setup-nginx.sh yourdomain.com api.yourdomain.com

# Interactive mode (will prompt for domains)
sudo ./scripts/setup-nginx.sh
```

### Manual PM2 Commands

```bash
# Start applications
pm2 start ecosystem.config.js

# Stop all applications
pm2 stop all

# Restart all applications
pm2 restart all

# Reload (zero-downtime reload)
pm2 reload all

# Delete applications
pm2 delete all

# View logs
pm2 logs
pm2 logs wds-api
pm2 logs wds-web

# Clear logs
pm2 flush

# Monitor
pm2 monit

# Save process list
pm2 save

# Reset startup script
pm2 unstartup
pm2 startup
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Run database migrations if needed
cd apps/api
npx prisma migrate deploy
cd ../..

# Rebuild application
pnpm build

# Restart PM2 processes
pm2 restart wds-api wds-web
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs for errors
pm2 logs --err

# Check if ports are in use
sudo lsof -i :3000
sudo lsof -i :4000

# Verify environment variables
cat apps/api/.env
cat apps/web/.env
```

### Database Connection Issues

```bash
# Verify Neon DATABASE_URL is correct
cat apps/api/.env | grep DATABASE_URL

# Test Neon connection
cd apps/api
npx prisma db push

# Check if Prisma client is generated
npx prisma generate
```

### PM2 Processes Not Starting on Boot

```bash
# Check if PM2 startup is configured
pm2 list

# Regenerate startup script
pm2 unstartup
pm2 startup

# Save process list again
pm2 save
```

### Nginx Issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# View site-specific logs
sudo tail -f /var/log/nginx/yourdomain.com-error.log
sudo tail -f /var/log/nginx/api.yourdomain.com-error.log

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (graceful, no downtime)
sudo systemctl reload nginx

# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :443
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Renew with verbose output
sudo certbot renew --dry-run

# Check certbot timer
systemctl status certbot.timer
```

## Security Best Practices

1. **Firewall Configuration**

   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Change Default Passwords**
   - Update all secrets in `.env` files
   - Use strong, unique passwords
   - Generate secure strings with: `openssl rand -base64 32`

3. **Regular Updates**

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Monitor Logs**

   ```bash
   # Application logs
   pm2 logs

   # System logs
   sudo journalctl -f
   ```

5. **Neon Database Backups**
   - Neon handles automatic backups
   - Configure point-in-time recovery in Neon dashboard
   - Export data periodically: `npx prisma db pull`

## Neon Database Benefits

Using Neon instead of local PostgreSQL provides:

- **Serverless**: Auto-scaling based on load
- **Free tier**: Generous free plan for development
- **Connection pooling**: Built-in PgBouncer for high concurrency
- **Branching**: Create database branches for development/testing
- **Auto-backups**: Point-in-time recovery included
- **Global edge**: Low latency from anywhere
- **No maintenance**: Neon handles updates and patches

## File Structure After Deployment

```
/home/your-username/wds-shop-store-fullstack/
├── apps/
│   ├── api/
│   │   ├── dist/           # Compiled NestJS API
│   │   ├── .env            # Production environment
│   │   └── node_modules/
│   └── web/
│       ├── .next/          # Compiled Next.js app
│       ├── .env            # Production environment
│       └── node_modules/
├── ecosystem.config.js     # PM2 configuration
├── logs/                   # Application logs
└── scripts/
    └── vps-deploy.sh       # Deployment script
```

## PM2 Ecosystem File Reference

The `ecosystem.config.js` file configures:

- **wds-api**: NestJS API server (port 4000)
- **wds-web**: Next.js web application (port 3000)

Each app has:

- Auto-restart enabled
- Memory limit: 1GB
- Separate error and output logs
- Cluster mode for better performance

## Support

For issues or questions:

- Check application logs: `pm2 logs`
- Verify environment variables (especially Neon DATABASE_URL)
- Check Neon dashboard for database status
- Verify firewall settings
- Review Nginx configuration (if using)
