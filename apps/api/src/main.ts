import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import basicAuth from 'express-basic-auth';
import session from 'express-session';

import { AppModule } from './app.module';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { CsrfService } from './common/services/csrf.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  // Enable CORS first - Must be before any other middleware
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-CSRF-Token',
      'x-csrf-token',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Enable cookie parser for JWT tokens
  app.use(cookieParser());
  app.set('trust proxy', true);

  const isProduction = process.env.NODE_ENV === 'production';
  app.use(
    session({
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: isProduction,
        sameSite: 'lax', // Always lax for multiple ports/subdomains
      },
    })
  );

  // Setup CSRF protection
  const csrfService = app.get(CsrfService);
  const csrfMiddleware = new CsrfMiddleware(csrfService);
  app.use(csrfMiddleware.use.bind(csrfMiddleware));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger configuration
  // Protect Swagger with Basic Auth in production
  if (isProduction) {
    const swaggerUsername =
      configService.getOrThrow<string>('SWAGGER_USERNAME');
    const swaggerPassword =
      configService.getOrThrow<string>('SWAGGER_PASSWORD');

    app.use(
      '/docs',
      basicAuth({
        users: { [swaggerUsername]: swaggerPassword },
        challenge: true,
        realm: 'Swagger API Docs',
      })
    );
  }

  const config = new DocumentBuilder()
    .setTitle('WebDev Studios API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Bearer'
    )
    .addSecurityRequirements('Bearer')
    .addCookieAuth('access_token')
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger UI available under the API global prefix: /docs
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'WebDev Studios API Documentation',
  });

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);
  logger.log(`🚀 API server running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
}

void bootstrap();
