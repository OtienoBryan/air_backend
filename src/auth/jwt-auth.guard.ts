import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = this.jwtService.verifyToken(token);
      
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      
      if (this.jwtService.isTokenExpired(token)) {
        throw new UnauthorizedException('Token expired');
      }
      
      request.user = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name
      };
      
      return true;
    } catch (error) {
      console.error('❌ [JwtAuthGuard] Token validation failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
