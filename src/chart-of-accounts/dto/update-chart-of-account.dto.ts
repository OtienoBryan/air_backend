import { PartialType } from '@nestjs/mapped-types';
import { CreateChartOfAccountDto } from './create-chart-of-account.dto';
import { IsOptional } from 'class-validator';

export class UpdateChartOfAccountDto extends PartialType(CreateChartOfAccountDto) {
  @IsOptional()
  name?: string;

  @IsOptional()
  code?: string;

  @IsOptional()
  account_type?: number;
}
