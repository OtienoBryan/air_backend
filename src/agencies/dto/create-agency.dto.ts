import { IsString, IsOptional, IsInt, IsNumber, MaxLength } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contact?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string | null;

  @IsOptional()
  @IsInt()
  booking_limit?: number | null;

  @IsOptional()
  @IsNumber()
  credit_limit?: number | null;

  @IsOptional()
  @IsInt()
  max_pax_per_booking?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  default_currency?: string | null;

  @IsOptional()
  @IsInt()
  credit_days?: number | null;

  @IsOptional()
  @IsNumber()
  payment_limit?: number | null;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsNumber()
  commission_percentage?: number | null;
}

