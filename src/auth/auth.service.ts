import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { Agent } from '../entities/agent.entity';
import { Agency } from '../entities/agency.entity';
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
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
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

  async loginAgent(loginDto: LoginDto): Promise<any> {
    try {
      // Use raw query to avoid issues with columns that may not exist yet
      const agentRaw = await this.agentRepository
        .createQueryBuilder('agent')
        .leftJoinAndSelect('agent.agency', 'agency')
        .where('agent.email = :email', { email: loginDto.email })
        .getOne();

      if (!agentRaw) {
        console.log(`❌ [AgentLogin] No agent found with email: ${loginDto.email}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log(`✅ [AgentLogin] Agent found: ${agentRaw.name} (id=${agentRaw.id})`);

      const storedHash  = (agentRaw as any).password_hash || null;
      const storedPlain = (agentRaw as any).password || null;

      console.log(`🔑 [AgentLogin] password_hash=${storedHash ? 'SET' : 'NULL'}, password=${storedPlain ? 'SET' : 'NULL'}`);

      if (!storedHash && !storedPlain) {
        console.log('❌ [AgentLogin] No password set for this agent');
        throw new UnauthorizedException('No password set for this agent. Run: UPDATE agents SET password = \'yourpassword\' WHERE email = \'' + loginDto.email + '\';');
      }

      let valid = false;

      // 1. Try bcrypt hash first
      if (storedHash) {
        try { valid = await bcrypt.compare(loginDto.password, storedHash) } catch { valid = false }
      }

      // 2. Try plaintext password (legacy)
      if (!valid && storedPlain) {
        valid = storedPlain === loginDto.password;
        // Also try bcrypt on the plain field (some setups store hash in 'password')
        if (!valid) {
          try { valid = await bcrypt.compare(loginDto.password, storedPlain) } catch { valid = false }
        }
      }

      if (!valid) throw new UnauthorizedException('Invalid email or password');

      const token = this.jwtService.generateToken({ sub: agentRaw.id, email: agentRaw.email, type: 'agent' });

      return {
        access_token: token,
        agent: {
          id: agentRaw.id,
          name: agentRaw.name,
          email: agentRaw.email,
          contact: agentRaw.contact,
          agency_id: agentRaw.agency_id,
          agency: agentRaw.agency
            ? { id: agentRaw.agency.id, name: agentRaw.agency.name, balance: Number(agentRaw.agency.balance || 0) }
            : null,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('❌ [AuthService] Agent login error:', error?.message || error);
      throw new UnauthorizedException('Login failed. Please try again.');
    }
  }
}
