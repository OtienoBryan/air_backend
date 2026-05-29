import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
export declare class GlobalAuthGuard implements CanActivate {
    private jwtAuthGuard;
    private reflector;
    constructor(jwtAuthGuard: JwtAuthGuard, reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
