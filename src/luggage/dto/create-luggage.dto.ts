import { IsString, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLuggageDto {
  @Type(() => Number)
  @IsInt()
  passenger_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  flight_series_id?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  booking_id?: number | null;

  @IsOptional()
  @IsString()
  tag_number?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1000)
  weight?: number | null;
}

