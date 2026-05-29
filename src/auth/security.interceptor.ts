import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Add security headers
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Log security events
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || 'Unknown';
    
    console.log(`🔒 [Security] ${method} ${url} from ${ip} - ${userAgent}`);
    
    return next.handle().pipe(
      tap(() => {
        // Log successful requests
        console.log(`✅ [Security] ${method} ${url} completed successfully`);
      })
    );
  }
}
