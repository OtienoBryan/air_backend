import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsIn, IsDateString, ValidateIf, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateSeatReservationDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  flight_series_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  number_of_seats: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  passenger_id?: number;

  @IsString()
  @IsNotEmpty()
  passenger_name: string;

  @IsOptional()
  @IsString()
  passenger_title?: string | null;

  @IsOptional()
  @IsEmail()
  passenger_email?: string;

  @IsOptional()
  @IsString()
  passenger_phone?: string;

  @IsOptional()
  @IsString()
  @IsIn(['reserved', 'confirmed', 'cancelled', 'checked_in', 'booked'])
  status?: string;

  @IsDateString()
  @IsNotEmpty()
  reservation_date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agent_id?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  country_id?: number | null;

  @IsOptional()
  @IsString()
  @IsIn(['national_id', 'passport', 'travel_document'])
  id_type?: string | null;

  @IsOptional()
  @IsString()
  id_number?: string | null;

  @IsOptional()
  @IsDateString()
  id_expiry?: string | null;

  @IsOptional()
  @IsString()
  id_issued_by?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(['one_way', 'return'])
  trip_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  return_flight_series_id?: number | null;

  @IsOptional()
  @IsDateString()
  return_date?: string | null;

  @IsOptional()
  @Transform(({ value }) => { if (value === null || value === '' || value === undefined) return null; const n = Number(value); return isNaN(n) ? null : n; })
  @ValidateIf((o, v) => v !== null)
  @IsNumber()
  fare_amount?: number | null;

  @IsOptional()
  @IsString()
  @IsIn(['unpaid', 'partial', 'paid'])
  payment_status?: string;

  @IsOptional()
  @Transform(({ value }) => { if (value === null || value === '' || value === undefined) return 0; const n = Number(value); return isNaN(n) ? 0 : n; })
  @IsNumber()
  amount_paid?: number;
}

