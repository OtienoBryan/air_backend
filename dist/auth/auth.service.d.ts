import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { Agent } from '../entities/agent.entity';
import { Agency } from '../entities/agency.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from './jwt.service';
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
export declare class AuthService {
    private staffRepository;
    private agentRepository;
    private agencyRepository;
    private jwtService;
    constructor(staffRepository: Repository<Staff>, agentRepository: Repository<Agent>, agencyRepository: Repository<Agency>, jwtService: JwtService);
    validateStaff(email: string, password: string): Promise<Staff | null>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getStaffById(id: number): Promise<Staff | null>;
    validateToken(token: string): Promise<Staff | null>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    loginAgent(loginDto: LoginDto): Promise<any>;
}
