import { IsString, IsOptional, IsNumber, IsIn, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateAircraftDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max_cargo_weight?: number;

  @IsOptional()
  @Transform(({ value }) => (value === null || value === '' || value === undefined ? null : Number(value)))
  @IsInt({ each: false })
  category_id?: number | null;

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
