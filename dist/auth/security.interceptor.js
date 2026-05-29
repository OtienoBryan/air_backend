"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let SecurityInterceptor = class SecurityInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('X-XSS-Protection', '1; mode=block');
        response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || 'Unknown';
        console.log(`🔒 [Security] ${method} ${url} from ${ip} - ${userAgent}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            console.log(`✅ [Security] ${method} ${url} completed successfully`);
        }));
    }
};
exports.SecurityInterceptor = SecurityInterceptor;
exports.SecurityInterceptor = SecurityInterceptor = __decorate([
    (0, common_1.Injectable)()
], SecurityInterceptor);
//# sourceMappingURL=security.interceptor.js.map