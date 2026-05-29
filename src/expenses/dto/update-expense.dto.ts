import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateExpenseDto {
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount must be a number conforming to the specified constraints' })
  @Min(0.01, { message: 'amount must not be less than 0.01' })
  amount: number;
}
