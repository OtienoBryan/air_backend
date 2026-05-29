import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsIn, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PassengerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  identification?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['adult', 'child', 'infant'])
  passenger_type: string;
}

export class CreateBookingDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  flight_series_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seat_reservation_id?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['cash', 'card', 'bank_transfer', 'online', 'mobile_payment', 'other'])
  payment_method: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'paid', 'failed', 'refunded'])
  payment_status?: string;

  @IsDateString()
  @IsNotEmpty()
  booking_date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agency_id?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  account_id?: number | null;

  @IsOptional()
  @Type(() => Boolean)
  deduct_from_account?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  payment_account_id?: number | null;
}

