import { IsString, IsOptional, IsInt, IsEmail, IsDateString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : value);

export class UpdatePassengerDto {
  @IsOptional()
  @IsString()
  name?: string;

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

  // pnr is never updated - always auto-generated
}

