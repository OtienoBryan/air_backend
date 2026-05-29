import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity';
import { Agency } from '../entities/agency.entity';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Agency])],
  providers: [AgentsService],
  controllers: [AgentsController],
  exports: [AgentsService]
})
export class AgentsModule {}

