import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { CsrfService } from '../services/csrf.service';

/**
 * CSRF Protection Middleware
 * Validates CSRF tokens for state-changing requests
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly csrfProtection: ReturnType<
    typeof CsrfService.prototype.getProtection
  >;

  constructor(readonly csrfService: CsrfService) {
    this.csrfProtection = csrfService.getProtection();
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip CSRF for public auth endpoints (login, register, etc.)
    // These endpoints are for unauthenticated users who may not have sessions yet
    if (
      req.path === '/auth/refresh' ||
      req.path === '/auth/login' ||
      req.path === '/auth/register' ||
      req.path === '/auth/forgot-password' ||
      req.path === '/auth/reset-password' ||
      req.path === '/auth/verify-email' ||
      req.path === '/auth/request-verification' ||
      req.path.startsWith('/api/products')
    ) {
      return next();
    }

    // Skip CSRF for webhook routes (external services)
    if (req.path.startsWith('/payments/webhook')) {
      return next();
    }

    // Skip CSRF for Swagger docs
    if (req.path.startsWith('/docs')) {
      return next();
    }

    // Skip CSRF for CSRF token endpoint
    if (req.path === '/csrf-token') {
      return next();
    }

    // Validate CSRF token using csrf-csrf middleware
    this.csrfProtection(req, res, (err) => {
      if (err) return next(err);

      next();
    });
  }
}
