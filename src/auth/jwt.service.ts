import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey = process.env.JWT_SECRET || 'moonsun-admin-secret-key-2024';
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  generateToken(payload: any): string {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn } as jwt.SignOptions);
    } catch (error) {
      console.error('❌ [JwtService] Error generating token:', error);
      throw new Error('Token generation failed');
    }
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      console.error('❌ [JwtService] Error verifying token:', error);
      return null;
    }
  }

  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('❌ [JwtService] Error decoding token:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('❌ [JwtService] Error checking token expiration:', error);
      return true;
    }
  }
}
