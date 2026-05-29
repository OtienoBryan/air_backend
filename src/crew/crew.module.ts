import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from '../entities/crew.entity';
import { CrewService } from './crew.service';
import { CrewController } from './crew.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crew])],
  controllers: [CrewController],
  providers: [CrewService],
  exports: [CrewService],
})
export class CrewModule {}

