import { IsString, IsOptional, MaxLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

// Deliberately excludes agency_id/use_deposit — those are administrative fields
// an agent must not be able to change on themselves via the self-service
// "update my profile" endpoint (as opposed to the admin-only PUT /admin/agents/:id).
export class UpdateAgentProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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
}
