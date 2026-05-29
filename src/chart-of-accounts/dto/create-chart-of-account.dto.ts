import { IsString, IsNotEmpty, IsInt, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChartOfAccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  account_type: number;
}
