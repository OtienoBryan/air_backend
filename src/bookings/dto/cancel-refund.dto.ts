import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CancelRefundDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  refund_amount: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
