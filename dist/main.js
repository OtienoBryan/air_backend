"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const security_interceptor_1 = require("./auth/security.interceptor");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: false,
    }));
    app.useGlobalInterceptors(new security_interceptor_1.SecurityInterceptor());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:3002',
                'http://localhost:3003',
                'http://localhost:3004',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:8080',
                'https://mc-aviation.vercel.app',
                'https://mcaviation.citlogisticssystems.com',
            ];
            console.log('🌍 CORS check - Origin received:', origin);
            if (!origin) {
                console.log('✅ CORS: Allowing request with no origin (proxy/mobile)');
                return callback(null, true);
            }
            const normalizedOrigin = (origin.endsWith('/') ? origin.slice(0, -1) : origin).toLowerCase();
            if (normalizedOrigin && normalizedOrigin.includes('vercel.app')) {
                console.log('✅ CORS: Allowing Vercel domain:', normalizedOrigin);
                return callback(null, true);
            }
            if (normalizedOrigin && normalizedOrigin.includes('mc-aviation')) {
                console.log('✅ CORS: Allowing mc-aviation domain:', normalizedOrigin);
                return callback(null, true);
            }
            if (normalizedOrigin && normalizedOrigin.includes('citlogisticssystems.com')) {
                console.log('✅ CORS: Allowing citlogisticssystems.com domain:', normalizedOrigin);
                return callback(null, true);
            }
            const normalizedAllowedOrigins = allowedOrigins.map(o => o.toLowerCase());
            if (normalizedAllowedOrigins.indexOf(normalizedOrigin) !== -1 ||
                allowedOrigins.indexOf(origin) !== -1) {
                console.log('✅ CORS: Allowing origin:', normalizedOrigin);
                callback(null, true);
            }
            else {
                console.log('❌ CORS: Blocking origin:', normalizedOrigin);
                console.log('❌ CORS: Allowed origins:', allowedOrigins);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With'],
        credentials: true,
        maxAge: 86400,
    });
    await app.listen(process.env.PORT ?? 3001);
    console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3001}`);
    console.log(`🔒 Security features enabled: Helmet, CORS, Validation`);
}
bootstrap();
//# sourceMappingURL=main.js.map