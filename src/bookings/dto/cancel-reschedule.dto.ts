import { IsNumber, Min, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CancelRescheduleDto {
  @Type(() => Number)
  @IsInt()
  new_flight_id: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  reschedule_fee: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
