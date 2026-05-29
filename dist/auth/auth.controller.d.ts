import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
}
