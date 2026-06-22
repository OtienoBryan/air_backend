import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  contact?: string | null;

  @IsOptional()
  @IsString()
  nationality?: string | null;

  @IsOptional()
  @IsString()
  id_type?: string | null;

  @IsOptional()
  @IsString()
  identification?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number | null;

  @IsOptional()
  @IsString()
  title?: string | null;

  @IsOptional()
  @IsString()
  booking_status?: string | null;

  // For child/infant passengers — the adult passenger's id they're attached to
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  guardian_passenger_id?: number | null;

  // pnr is auto-generated, not provided by client
}

