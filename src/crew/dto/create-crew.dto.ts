import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCrewDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  contact?: string | null;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  nationality?: string | null;

  @IsOptional()
  @IsString()
  id_number?: string | null;

  // License Information
  @IsOptional()
  @IsString()
  license_number?: string | null;

  @IsOptional()
  @IsDateString()
  license_issue_date?: string | null;

  // Medical Information
  @IsOptional()
  @IsString()
  medical_class?: string | null;

  @IsOptional()
  @IsDateString()
  medical_date?: string | null;

  // Training Information
  @IsOptional()
  @IsDateString()
  fixed_wing_training_date?: string | null;

  // Rotorcraft Training
  @IsOptional()
  @IsDateString()
  rotorcraft_asel?: string | null;

  @IsOptional()
  @IsDateString()
  rotorcraft_amel?: string | null;

  @IsOptional()
  @IsDateString()
  rotorcraft_ases?: string | null;

  @IsOptional()
  @IsDateString()
  rotorcraft_ames?: string | null;
}

