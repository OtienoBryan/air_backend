"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("../entities/staff.entity");
const agent_entity_1 = require("../entities/agent.entity");
const agency_entity_1 = require("../entities/agency.entity");
const jwt_service_1 = require("./jwt.service");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    staffRepository;
    agentRepository;
    agencyRepository;
    jwtService;
    constructor(staffRepository, agentRepository, agencyRepository, jwtService) {
        this.staffRepository = staffRepository;
        this.agentRepository = agentRepository;
        this.agencyRepository = agencyRepository;
        this.jwtService = jwtService;
    }
    async validateStaff(email, password) {
        console.log('🔍 [AuthService] Validating staff with email:', email);
        try {
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
            const isPasswordValid = await bcrypt.compare(password, staff.password);
            console.log('🔐 [AuthService] Password validation result:', isPasswordValid);
            if (!isPasswordValid) {
                console.log('❌ [AuthService] Invalid password');
                return null;
            }
            console.log('✅ [AuthService] Staff validation successful');
            return staff;
        }
        catch (error) {
            console.error('❌ [AuthService] Database error during validation:', error);
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Database connection failed. Please try again later.');
            }
            else if (error.code === 'ETIMEDOUT') {
                throw new Error('Database request timeout. Please try again.');
            }
            else {
                throw new Error('Authentication service temporarily unavailable');
            }
        }
    }
    async login(loginDto) {
        console.log('🔐 [AuthService] Starting login process');
        try {
            const { email, password } = loginDto;
            if (!email || !password) {
                console.log('❌ [AuthService] Missing email or password in login request');
                throw new common_1.UnauthorizedException('Email and password are required');
            }
            const staff = await this.validateStaff(email, password);
            if (!staff) {
                console.log('❌ [AuthService] Staff validation failed');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
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
        }
        catch (error) {
            console.error('❌ [AuthService] Login error:', error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            if (error.message.includes('Database')) {
                throw new Error('Authentication service temporarily unavailable');
            }
            throw new common_1.UnauthorizedException('Login failed. Please try again.');
        }
    }
    async getStaffById(id) {
        return this.staffRepository.findOne({ where: { id } });
    }
    async validateToken(token) {
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
        }
        catch (error) {
            console.error('❌ [AuthService] Token validation error:', error);
            return null;
        }
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    async loginAgent(loginDto) {
        try {
            const agentRaw = await this.agentRepository
                .createQueryBuilder('agent')
                .leftJoinAndSelect('agent.agency', 'agency')
                .where('agent.email = :email', { email: loginDto.email })
                .getOne();
            if (!agentRaw) {
                console.log(`❌ [AgentLogin] No agent found with email: ${loginDto.email}`);
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            console.log(`✅ [AgentLogin] Agent found: ${agentRaw.name} (id=${agentRaw.id})`);
            const storedHash = agentRaw.password_hash || null;
            const storedPlain = agentRaw.password || null;
            console.log(`🔑 [AgentLogin] password_hash=${storedHash ? 'SET' : 'NULL'}, password=${storedPlain ? 'SET' : 'NULL'}`);
            if (!storedHash && !storedPlain) {
                console.log('❌ [AgentLogin] No password set for this agent');
                throw new common_1.UnauthorizedException('No password set for this agent. Run: UPDATE agents SET password = \'yourpassword\' WHERE email = \'' + loginDto.email + '\';');
            }
            let valid = false;
            if (storedHash) {
                try {
                    valid = await bcrypt.compare(loginDto.password, storedHash);
                }
                catch {
                    valid = false;
                }
            }
            if (!valid && storedPlain) {
                valid = storedPlain === loginDto.password;
                if (!valid) {
                    try {
                        valid = await bcrypt.compare(loginDto.password, storedPlain);
                    }
                    catch {
                        valid = false;
                    }
                }
            }
            if (!valid)
                throw new common_1.UnauthorizedException('Invalid email or password');
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
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('❌ [AuthService] Agent login error:', error?.message || error);
            throw new common_1.UnauthorizedException('Login failed. Please try again.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(1, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __param(2, (0, typeorm_1.InjectRepository)(agency_entity_1.Agency)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map