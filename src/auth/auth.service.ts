import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcryptjs';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private jwtService: JwtService,
  ) {}

  async validateStaff(email: string, password: string): Promise<Staff | null> {
    console.log('🔍 [AuthService] Validating staff with email:', email);
    
    try {
      // Input validation
      if (!email || !password) {
        console.log('❌ [AuthService] Missing email or password');
        return null;
      }

      if (!email.includes('@')) {
        console.log('❌ [AuthService] Invalid email format:', email);
        return null;
      }
      
      const staff = await this.staffRepository.findOne({ where: { business_email: email } });
      
      if (!staff) {
        console.log('❌ [AuthService] No staff found with email:', email);
        return null;
      }
      
      console.log('✅ [AuthService] Staff found:', {
        id: staff.id,
        name: staff.name,
        email: staff.business_email,
        is_active: staff.is_active
      });
      
      if (!staff.is_active) {
        console.log('❌ [AuthService] Staff is not active');
        return null;
      }

      // Secure password comparison using bcrypt
      const isPasswordValid = await bcrypt.compare(password, staff.password);
      console.log('🔐 [AuthService] Password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ [AuthService] Invalid password');
        return null;
      }

      console.log('✅ [AuthService] Staff validation successful');
      return staff;
    } catch (error) {
      console.error('❌ [AuthService] Database error during validation:', error);
      
      // Handle specific database errors
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Database connection failed. Please try again later.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Database request timeout. Please try again.');
      } else {
        throw new Error('Authentication service temporarily unavailable');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    console.log('🔐 [AuthService] Starting login process');
    
    try {
      const { email, password } = loginDto;
      
      // Basic input validation
      if (!email || !password) {
        console.log('❌ [AuthService] Missing email or password in login request');
        throw new UnauthorizedException('Email and password are required');
      }
      
      const staff = await this.validateStaff(email, password);
      if (!staff) {
        console.log('❌ [AuthService] Staff validation failed');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const tokenPayload = {
        sub: staff.id,
        email: staff.business_email,
        role: staff.role,
        name: staff.name,
        iat: Math.floor(Date.now() / 1000)
      };
      
      const token = this.jwtService.generateToken(tokenPayload);

      console.log('✅ [AuthService] Login successful for:', email);
      
      return {
        token,
        user: {
          id: staff.id,
          email: staff.business_email,
          firstName: staff.name.split(' ')[0] || staff.name,
          lastName: staff.name.split(' ').slice(1).join(' ') || '',
          role: staff.role,
        },
      };
    } catch (error) {
      console.error('❌ [AuthService] Login error:', error);
      
      // Re-throw UnauthorizedException as-is
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Handle other errors
      if (error.message.includes('Database')) {
        throw new Error('Authentication service temporarily unavailable');
      }
      
      throw new UnauthorizedException('Login failed. Please try again.');
    }
  }

  async getStaffById(id: number): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { id } });
  }

  async validateToken(token: string): Promise<Staff | null> {
    try {
      const payload = this.jwtService.verifyToken(token);
      if (!payload || !payload.sub) {
        console.log('❌ [AuthService] Invalid token payload');
        return null;
      }
      
      if (this.jwtService.isTokenExpired(token)) {
        console.log('❌ [AuthService] Token expired');
        return null;
      }
      
      return this.getStaffById(payload.sub);
    } catch (error) {
      console.error('❌ [AuthService] Token validation error:', error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
