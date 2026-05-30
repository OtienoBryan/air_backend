import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn, IsDecimal, ValidateIf } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'country_id must be a number' })
  country_id?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'maintenance'])
  status?: string;

  @IsOptional()
  @IsString()
  father_code?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  icao_code?: string;

  @IsOptional()
  @IsString()
  @IsIn(['domestic', 'international'])
  destination_type?: string;
}

