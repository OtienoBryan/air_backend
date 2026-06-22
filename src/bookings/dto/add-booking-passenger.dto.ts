import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class AddBookingPassengerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  id_type?: string;

  @IsOptional()
  @IsString()
  identification?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['child', 'infant'])
  passenger_type: 'child' | 'infant';

  // The adult passenger this child/infant is attached to
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  guardian_passenger_id?: number;
}
