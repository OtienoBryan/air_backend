import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IataCode } from '../entities/iata-code.entity';
import { IataCodesService } from './iata-codes.service';
import { IataCodesController } from './iata-codes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([IataCode])],
    providers: [IataCodesService],
    controllers: [IataCodesController],
    exports: [IataCodesService]
})
export class IataCodesModule { }
