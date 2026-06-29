import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Date inputs left blank on the frontend send '' rather than omitting the field —
// @IsOptional() only skips validation for null/undefined, so '' still fails
// @IsDateString(). Normalize '' to null before validation runs.
const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : value);

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
  @Transform(emptyToNull)
  @IsDateString()
  license_issue_date?: string | null;

  // Medical Information
  @IsOptional()
  @IsString()
  medical_class?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  medical_date?: string | null;

  // Training Information
  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  fixed_wing_training_date?: string | null;

  // Rotorcraft Training
  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  rotorcraft_asel?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  rotorcraft_amel?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  rotorcraft_ases?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  rotorcraft_ames?: string | null;
}

