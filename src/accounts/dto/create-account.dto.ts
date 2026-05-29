import { IsString, IsOptional, IsNumber, MaxLength, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAccountDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(50)
  code: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @IsString()
  @MaxLength(3)
  currency?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' ? 0 : Number(value))
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended'])
  @MaxLength(50)
  status?: string;
}

