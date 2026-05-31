import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, IsIn, IsDateString, ValidateIf, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateFlightSeriesDto {
  @IsString()
  @IsNotEmpty()
  flt: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  aircraft_id?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['From-To', 'From-Via_To', 'MultiLeg'])
  flight_type: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

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

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_recurring?: boolean;

  @IsOptional()
  @IsString()
  days_of_week?: string | null;

  @IsOptional()
  @IsString()
  recurring_schedule?: string | null;

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

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'adult_return_fare must be a number' })
  adult_return_fare?: number | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'child_return_fare must be a number' })
  child_return_fare?: number | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null)
  @IsNumber({}, { message: 'infant_return_fare must be a number' })
  infant_return_fare?: number | null;
}

