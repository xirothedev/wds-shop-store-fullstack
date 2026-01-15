/**
 * PM2 Ecosystem Configuration
 *
 * This file configures PM2 to manage the NestJS API and Next.js web application.
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 stop wds-api wds-web
 *   pm2 restart wds-api wds-web
 *   pm2 logs wds-api wds-web
 *   pm2 monit
 *
 * Deployment on Ubuntu VPS:
 *   1. Clone repository
 *   2. Install dependencies: pnpm install
 *   3. Build applications: pnpm build
 *   4. Set up environment files (see .env.example in apps/api and apps/web)
 *   5. Start with PM2: pm2 start ecosystem.config.js
 *   6. Save PM2 process list: pm2 save
 *   7. Setup startup script: pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'wds-api',
      script: './node_modules/.bin/nest',
      args: 'start',
      cwd: './apps/api',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'wds-web',
      script: './node_modules/.bin/next',
      args: 'start',
      cwd: './apps/web',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
