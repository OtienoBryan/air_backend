import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsIn, IsDateString, IsNumber, IsArray, ValidateNested, IsBoolean, ValidateIf } from 'class-validator';
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
  id_type?: string;

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

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_return_trip?: boolean;

  @IsOptional()
  @IsDateString()
  travel_date?: string | null;

  @IsOptional()
  @IsDateString()
  return_date?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  return_flight_series_id?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  flight_id?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  return_flight_id?: number | null;

  @IsString()
  @IsNotEmpty()
  @IsIn(['cash', 'card', 'bank_transfer', 'online', 'mobile_payment', 'agency_balance', 'other'])
  payment_method: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'paid', 'failed', 'refunded'])
  payment_status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  override_total_amount?: number;

  @IsDateString()
  @IsNotEmpty()
  booking_date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== null && v !== undefined)
  @IsString()
  payment_reference?: string | null;

  @IsOptional()
  @ValidateIf((o, v) => v !== null && v !== undefined)
  @IsString()
  payment_account?: string | null;

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

