import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SecurityInterceptor } from './auth/security.interceptor';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Gzip/deflate every response — the admin/agent apps regularly pull large
  // JSON payloads (paginated lists with deep relations), so this is a large,
  // free win on transfer time with no behavior change.
  app.use(compression());

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: false,
  }));

  // Global security interceptor
  app.useGlobalInterceptors(new SecurityInterceptor());
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  // Enhanced CORS configuration with proxy support
  const isProd = process.env.NODE_ENV === 'production';
  // Verbose CORS tracing is genuinely useful in dev but runs on every single
  // request in prod for a decision that's normally identical — keep the
  // allow/deny logic untouched, just stop paying for the logging in prod.
  const corsLog = (...args: unknown[]) => { if (!isProd) console.log(...args); };
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:5173',
        'http://localhost:3023',
        'http://127.0.0.1:5173',
        'http://localhost:8080',
        'http://admin.royalairsarl.com',
        'http://agents.royalairsarl.com',
        'https://mc-aviation.vercel.app', // Vercel production domain
        'https://mcaviation.citlogisticssystems.com',
      ];

      corsLog('🌍 CORS check - Origin received:', origin);

      // Allow requests with no origin (mobile apps, Postman, proxy requests, etc.)
      // Proxy requests often don't include origin header
      if (!origin) {
        corsLog('✅ CORS: Allowing request with no origin (proxy/mobile)');
        return callback(null, true);
      }

      // Normalize origin (remove trailing slash if present, convert to lowercase)
      const normalizedOrigin = (origin.endsWith('/') ? origin.slice(0, -1) : origin).toLowerCase();

      // Allow Vercel domains (production and preview deployments)
      if (normalizedOrigin && normalizedOrigin.includes('vercel.app')) {
        corsLog('✅ CORS: Allowing Vercel domain:', normalizedOrigin);
        return callback(null, true);
      }

      // Allow mc-aviation domains
      if (normalizedOrigin && normalizedOrigin.includes('mc-aviation')) {
        corsLog('✅ CORS: Allowing mc-aviation domain:', normalizedOrigin);
        return callback(null, true);
      }

      // Allow citlogisticssystems.com subdomains (e.g. mcaviation.citlogisticssystems.com)
      if (normalizedOrigin && normalizedOrigin.includes('citlogisticssystems.com')) {
        corsLog('✅ CORS: Allowing citlogisticssystems.com domain:', normalizedOrigin);
        return callback(null, true);
      }

      // Allow royalairsarl.com subdomains over either http or https
      // (admin.royalairsarl.com, agents.royalairsarl.com, etc.)
      if (normalizedOrigin && normalizedOrigin.includes('royalairsarl.com')) {
        corsLog('✅ CORS: Allowing royalairsarl.com domain:', normalizedOrigin);
        return callback(null, true);
      }

      // Check exact match (case-insensitive)
      const normalizedAllowedOrigins = allowedOrigins.map(o => o.toLowerCase());
      if (normalizedAllowedOrigins.indexOf(normalizedOrigin) !== -1 ||
          allowedOrigins.indexOf(origin) !== -1) {
        corsLog('✅ CORS: Allowing origin:', normalizedOrigin);
        callback(null, true);
      } else {
        // Always log denials — they're rare and worth knowing about even in prod.
        console.log('❌ CORS: Blocking origin:', normalizedOrigin);
        console.log('❌ CORS: Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`🔒 Security features enabled: Helmet, CORS, Validation`);
}
bootstrap();
