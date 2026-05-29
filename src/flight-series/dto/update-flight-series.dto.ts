import { IsString, IsOptional, IsNumber, IsInt, IsIn, IsDateString, ValidateIf } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateFlightSeriesDto {
  @IsOptional()
  @IsString()
  flt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  aircraft_id?: number;

  @IsOptional()
  @IsString()
  @IsIn(['From-To', 'From-Via_To', 'MultiLeg'])
  flight_type?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  std?: string;

  @IsOptional()
  @IsString()
  sta?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  number_of_seats?: number;

  // From-To fields
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  from_destination_id?: number;

  @IsOptional()
  @IsString()
  from_terminal?: string;

  @IsOptional()
  @IsString()
  to_terminal?: string;

  // From-Via_To fields
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  via_destination_id?: number;

  @IsOptional()
  @IsString()
  via_std?: string;

  @IsOptional()
  @IsString()
  via_sta?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  to_destination_id?: number;

  // Fare prices
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'adult_fare must be a number' })
  adult_fare?: number | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'child_fare must be a number' })
  child_fare?: number | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'infant_fare must be a number' })
  infant_fare?: number | null;
}

