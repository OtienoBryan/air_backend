import { IsString, IsOptional, IsInt, IsEmail, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSeatReservationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  flight_series_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  number_of_seats?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  passenger_id?: number;

  @IsOptional()
  @IsString()
  passenger_name?: string;

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

  @IsOptional()
  @IsDateString()
  reservation_date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agent_id?: number | null;
}

