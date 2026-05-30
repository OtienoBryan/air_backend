import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsIn, IsDateString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

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
}

