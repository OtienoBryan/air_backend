export declare class JwtService {
    private readonly secretKey;
    private readonly expiresIn;
    generateToken(payload: any): string;
    verifyToken(token: string): any;
    decodeToken(token: string): any;
    isTokenExpired(token: string): boolean;
}
