# Cloudflare DNS Setup Guide

This guide covers setting up Cloudflare DNS for shoe.naberious.dev and api.shoe.naberious.dev with your Nginx server.

## Prerequisites

- Cloudflare account with your domain (naberious.dev) added
- Your VPS public IP address
- Nginx installed on your VPS

## Step 1: Get Your VPS IP Address

```bash
# On your VPS, get the public IP
curl -4 ifconfig.me
# or
curl -4 icanhazip.com
```

Save this IP address for the next steps.

## Step 2: Add DNS Records in Cloudflare

1. Go to **Cloudflare Dashboard** > **Your Domain** > **DNS** > **Records**

2. Add the following records:

| Type | Name | Content       | Proxy Status               | TTL  |
| ---- | ---- | ------------- | -------------------------- | ---- |
| A    | shoe | `YOUR_VPS_IP` | **Proxied (Orange cloud)** | Auto |
| A    | api  | `YOUR_VPS_IP` | **DNS Only (Grey cloud)**  | Auto |

**Important:**

- **shoe.naberious.dev**: Enable proxy (orange cloud) - Cloudflare will cache static assets and provide DDoS protection
- **api.shoe.naberious.dev**: Disable proxy (grey cloud/DNS only) - Direct connection to your server for API calls

### Why Different Proxy Settings?

- **Web (Orange Cloud)**: Benefits from Cloudflare's CDN, caching, and DDoS protection
- **API (Grey Cloud)**: Direct connection ensures proper SSL, no Cloudflare interference with API requests

## Step 3: Configure Cloudflare SSL/TLS

Go to **SSL/TLS** > **Overview** and select:

### For API (api.shoe.naberious.dev)

Since it's DNS-only (grey cloud), use **Full (strict)** mode:

```
Full (strict) - Origin Certificate
```

### For Web (shoe.naberious.dev)

If proxied (orange cloud), you have two options:

**Option 1: Flexible SSL (Easier)**

```
Flexible (SSL) - Traffic between browser and Cloudflare only
```

- No SSL needed on your server
- Cloudflare handles HTTPS, connects to your server over HTTP

**Option 2: Full Strict (Recommended for production)**

```
Full (strict) - Full SSL with valid origin certificate
```

- Requires valid SSL certificate on your server (Let's Encrypt)
- End-to-end encryption
- Must obtain SSL cert with Certbot first

## Step 4: Deploy Your Application

```bash
# On your VPS

# 1. Deploy application with PM2
./scripts/vps-deploy.sh deploy

# 2. Setup Nginx
sudo ./scripts/nginx-setup-shoe.sh
# When prompted for SSL, select 'y' to get Let's Encrypt certificates
```

## Step 5: Update Environment Variables

Update your `.env` files to use the new domains:

**apps/web/.env:**

```bash
NEXT_PUBLIC_API_URL="https://api.shoe.naberious.dev"
```

**apps/api/.env:**

```bash
CORS_ORIGIN="https://shoe.naberious.dev"
```

## Step 6: Verify DNS Propagation

```bash
# Check if DNS is pointing to your server
dig shoe.naberious.dev
dig api.shoe.naberious.dev

# Or use:
nslookup shoe.naberious.dev
nslookup api.shoe.naberious.dev
```

## Step 7: Test Your Sites

```bash
# Test web
curl https://shoe.naberious.dev
curl https://shoe.naberious.dev/health

# Test API
curl https://api.shoe.naberious.dev/health
curl https://api.shoe.naberious.dev/api/docs
```

## Cloudflare Configuration Tips

### Page Rules (Optional but Recommended)

Create page rules for better performance:

1. Go to **Rules** > **Page Rules**

2. Add cache rules for static assets:

**Rule 1: Cache static files**

```
*shoe.naberious.dev/_next/static/*
*shoe.naberious.dev/static/*
*shoe.naberious.dev/_next/image/*
```

Settings:

- Cache Level: Cache Everything
- Edge Cache TTL: 1 month

**Rule 2: Don't cache API calls**

```
*api.shoe.naberious.dev/*
```

Settings:

- Cache Level: Bypass
- Disable Performance

### Security Settings

Go to **Security** > **Settings**:

1. **Security Level**: Medium or High
2. **Bot Fight Mode**: ON (recommended)
3. **Challenge Passage**: 30 minutes

### Caching Configuration

Go to **Caching** > **Configuration**:

- **Caching Level**: Standard
- **Browser Cache TTL**: Respect Existing Headers

### SSL/TLS Recommendation for Production

```
┌─────────────────┐     HTTPS      ┌──────────────┐     HTTPS     ┌─────────────┐
│                 │ ──────────────> │              │ ─────────────> │             │
│   Browser       │                 │  Cloudflare  │                 │   Your VPS  │
│                 │ <────────────── │   (Orange)   │ <───────────── │             │
└─────────────────┘                 └──────────────┘                 └─────────────┘
                                            |
                                            | DNS Only
                                            v
                                    ┌──────────────┐     HTTPS     ┌─────────────┐
                                    │              │ ─────────────> │             │
                                    │  Cloudflare  │                 │   Your VPS  │
                                    │   (Grey)     │ <───────────── │  (Port 4000)│
                                    └──────────────┘                 └─────────────┘
```

## Troubleshooting

### DNS Not Propagating

```bash
# Check DNS status
dig shoe.naberious.dev

# Clear local DNS cache
sudo systemd-resolve --flush-caches  # Linux
# or restart your browser
```

### SSL Certificate Errors

```bash
# Check if Certbot certificate exists
sudo certbot certificates

# Renew manually if needed
sudo certbot renew

# Check Nginx SSL config
sudo nginx -t
```

### Cloudflare Proxy Issues

If using Orange Cloud proxy:

1. Check SSL/TLS mode in Cloudflare (try "Flexible" first)
2. Ensure origin certificate is valid (for "Full" mode)
3. Check Cloudflare SSL/TLS logs for errors

### 5xx Errors

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/shoe.naberious.dev-error.log
sudo tail -f /var/log/nginx/api.shoe.naberious.dev-error.log

# Check if apps are running
pm2 status

# Check if ports are accessible
sudo lsof -i :3000
sudo lsof -i :4000
```

## Quick Reference

| Setting  | shoe.naberious.dev        | api.shoe.naberious.dev |
| -------- | ------------------------- | ---------------------- |
| Proxy    | Orange (Proxied)          | Grey (DNS Only)        |
| SSL Mode | Flexible or Full (strict) | Full (strict)          |
| Cache    | Enabled                   | Disabled               |
| Port     | 3000                      | 4000                   |

## Firewall Configuration

Ensure these ports are open on your VPS:

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## Next Steps After Setup

1. **Monitor Cloudflare Analytics**: Check traffic and performance
2. **Set up Cloudflare Analytics**: Enable Web Analytics for insights
3. **Configure Auto-Renewal**: Certbot auto-renews, verify with:
   ```bash
   systemctl status certbot.timer
   ```
4. **Test End-to-End**: Ensure web → API communication works
5. **Set up Error Pages**: Configure Cloudflare custom error pages if needed

## Support

If issues occur:

- Check Cloudflare DNS settings match your VPS IP
- Verify Nginx is running: `sudo systemctl status nginx`
- Check PM2 apps: `pm2 status`
- Review logs: `pm2 logs` and Nginx error logs
