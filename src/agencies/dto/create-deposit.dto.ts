import { IsNumber, IsInt, IsString, Min, MaxLength, IsDateString } from 'class-validator';

export class CreateDepositDto {
  @IsInt()
  account_id: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  date_paid: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsString()
  @MaxLength(50)
  payment_method: string;

  @IsString()
  @MaxLength(100)
  reference: string;
}

