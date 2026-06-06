import { IsInt, IsNumber, IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  expense_account_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  expense_date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateIf((o) => o.is_paid === true)
  @IsString()
  @IsNotEmpty()
  payment_method?: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_paid?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  supplier_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  expense_type_id?: number | null;

  // Expense linkage
  @IsOptional()
  @IsString()
  linked_to?: string | null;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  route_id?: number | null;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  aircraft_id?: number | null;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  flight_id?: number | null;

  @IsOptional()
  @IsString()
  cost_center?: string | null;
}
