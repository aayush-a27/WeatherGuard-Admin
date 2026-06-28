import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ─── Global Prefix ─────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── CORS ──────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ─── Global Validation Pipe ────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── Global Exception Filter ──────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ─── Global Response Interceptor ──────────────────
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── Swagger Documentation ────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WeatherGuard API')
    .setDescription(
      'Production-ready NestJS backend with OAuth, JWT, Telegram Bot, and Weather Alerts',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Google & GitHub OAuth endpoints')
    .addTag('Users', 'User profile and settings')
    .addTag('Admin', 'Admin panel — user management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Start Server ─────────────────────────────────
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 WeatherGuard API running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
