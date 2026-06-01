import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SecurityInterceptor } from './auth/security.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8080',
        'https://mc-aviation.vercel.app', // Vercel production domain
        'https://mcaviation.citlogisticssystems.com',
      ];
      
      // Log the origin for debugging
      console.log('🌍 CORS check - Origin received:', origin);
      
      // Allow requests with no origin (mobile apps, Postman, proxy requests, etc.)
      // Proxy requests often don't include origin header
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin (proxy/mobile)');
        return callback(null, true);
      }
      
      // Normalize origin (remove trailing slash if present, convert to lowercase)
      const normalizedOrigin = (origin.endsWith('/') ? origin.slice(0, -1) : origin).toLowerCase();
      
      // Allow Vercel domains (production and preview deployments)
      if (normalizedOrigin && normalizedOrigin.includes('vercel.app')) {
        console.log('✅ CORS: Allowing Vercel domain:', normalizedOrigin);
        return callback(null, true);
      }
      
      // Allow mc-aviation domains
      if (normalizedOrigin && normalizedOrigin.includes('mc-aviation')) {
        console.log('✅ CORS: Allowing mc-aviation domain:', normalizedOrigin);
        return callback(null, true);
      }

      // Allow citlogisticssystems.com subdomains (e.g. mcaviation.citlogisticssystems.com)
      if (normalizedOrigin && normalizedOrigin.includes('citlogisticssystems.com')) {
        console.log('✅ CORS: Allowing citlogisticssystems.com domain:', normalizedOrigin);
        return callback(null, true);
      }
      
      // Check exact match (case-insensitive)
      const normalizedAllowedOrigins = allowedOrigins.map(o => o.toLowerCase());
      if (normalizedAllowedOrigins.indexOf(normalizedOrigin) !== -1 || 
          allowedOrigins.indexOf(origin) !== -1) {
        console.log('✅ CORS: Allowing origin:', normalizedOrigin);
        callback(null, true);
      } else {
        console.log('❌ CORS: Blocking origin:', normalizedOrigin);
        console.log('❌ CORS: Allowed origins:', allowedOrigins);
        // For proxy requests, allow if no origin or if it's a known proxy pattern
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
