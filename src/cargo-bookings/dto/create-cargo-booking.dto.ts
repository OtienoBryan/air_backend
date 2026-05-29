import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  IsIn,
  IsDateString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCargoBookingDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  awb_number: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  flight_series_id?: number | null;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  origin: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  destination: string;

  @IsString()
  @IsNotEmpty()
  shipper_name: string;

  @IsOptional()
  @IsString()
  shipper_phone?: string;

  @IsOptional()
  @IsString()
  shipper_address?: string;

  @IsString()
  @IsNotEmpty()
  consignee_name: string;

  @IsOptional()
  @IsString()
  consignee_phone?: string;

  @IsOptional()
  @IsString()
  consignee_address?: string;

  @IsString()
  @IsNotEmpty()
  commodity: string;

  @IsOptional()
  @IsString()
  special_handling_codes?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  pieces: number;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  gross_weight_kg: number;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  chargeable_weight_kg: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  volume_cbm?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsString()
  @IsIn(['PREPAID', 'COLLECT'])
  payment_term?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rate_per_kg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  total_charges?: number;

  @IsDateString()
  @IsNotEmpty()
  booking_date: string;

  @IsOptional()
  @IsString()
  @IsIn(['booked', 'accepted', 'manifested', 'flown', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

