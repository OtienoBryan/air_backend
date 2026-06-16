import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLuggageDto {
  @IsOptional()
  @IsString()
  tag_number?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1000)
  weight?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  excess_kg?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  excess_charge?: number;
}

