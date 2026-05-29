import { IsInt, IsNumber, IsString, IsNotEmpty, IsOptional, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePayrollDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  staff_id: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  payroll_account_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  payroll_date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @Type(() => Boolean)
  is_paid?: boolean;
}
