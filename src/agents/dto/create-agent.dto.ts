import { IsString, IsOptional, IsInt, IsBoolean, MaxLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAgentDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @IsEmail()
  @MaxLength(255)
  email?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @IsString()
  @MaxLength(100)
  country?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @IsString()
  @MaxLength(50)
  contact?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? null : Number(value))
  @IsInt()
  agency_id?: number | null;

  @IsOptional()
  @Transform(({ value }) => value === '' ? false : value)
  @IsBoolean()
  use_deposit?: boolean;
}

