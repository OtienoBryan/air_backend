import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAircraftDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  registration: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max_cargo_weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  created_by?: number;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'maintenance', 'retired'])
  status?: string;

  @IsOptional()
  @IsString()
  calendar_color?: string;
}

