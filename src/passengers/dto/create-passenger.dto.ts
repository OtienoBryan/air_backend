import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsDateString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Date inputs left blank send '' rather than omitting the field — @IsOptional()
// only skips validation for null/undefined, so '' still fails @IsDateString().
const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : value);

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  contact?: string | null;

  @IsOptional()
  @IsString()
  nationality?: string | null;

  @IsOptional()
  @IsString()
  id_type?: string | null;

  @IsOptional()
  @IsString()
  identification?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number | null;

  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString()
  date_of_birth?: string | null;

  @IsOptional()
  @IsString()
  title?: string | null;

  @IsOptional()
  @IsString()
  booking_status?: string | null;

  // For child/infant passengers — the adult passenger's id they're attached to
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  guardian_passenger_id?: number | null;

  // pnr is auto-generated, not provided by client
}

