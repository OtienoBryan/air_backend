import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from './jwt.service';
import { Staff } from '../entities/staff.entity';
import { Agent } from '../entities/agent.entity';
import { Agency } from '../entities/agency.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Agent, Agency]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtService],
  exports: [AuthService, JwtAuthGuard, JwtService],
})
export class AuthModule {}
