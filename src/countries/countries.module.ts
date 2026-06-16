import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesController, AdminCountriesController } from './countries.controller';
import { Country } from '../entities/country.entity';
import { CountryTax } from '../entities/country-tax.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, CountryTax, ChartOfAccount])],
  controllers: [CountriesController, AdminCountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
