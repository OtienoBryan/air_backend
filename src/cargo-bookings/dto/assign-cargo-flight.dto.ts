import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignCargoFlightDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  flight_series_id?: number | null;
}

