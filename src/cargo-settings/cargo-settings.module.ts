import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoShcCharge } from '../entities/cargo-shc-charge.entity';
import { CargoFreightRate } from '../entities/cargo-freight-rate.entity';
import { CargoHandlingFee } from '../entities/cargo-handling-fee.entity';
import { CargoSettingsController } from './cargo-settings.controller';
import { CargoSettingsService } from './cargo-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([CargoShcCharge, CargoFreightRate, CargoHandlingFee])],
  controllers: [CargoSettingsController],
  providers: [CargoSettingsService],
  exports: [CargoSettingsService],
})
export class CargoSettingsModule {}
