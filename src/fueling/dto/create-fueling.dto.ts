import { IsInt, IsNumber, IsString, IsNotEmpty, IsOptional, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFuelingDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  flight_series_id: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  supplier_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  fuel_quantity: number;

  @IsString()
  @IsNotEmpty()
  fuel_slip_number: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  price_per_liter: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  additional_fees?: number;

  @IsOptional()
  @IsString()
  additional_fees_explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  tax?: number;

  @IsDateString()
  @IsNotEmpty()
  fueling_date: string;
}
