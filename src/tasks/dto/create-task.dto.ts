import { IsString, IsNotEmpty, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority: string;

  @IsString()
  @IsIn(['pending', 'in-progress', 'completed', 'cancelled'])
  status: string;

  @IsString()
  @IsOptional()
  salesRepId?: string; // JSON string of sales rep IDs

  @IsOptional()
  assignedById?: number;

  @IsString()
  @IsNotEmpty()
  date: string;
}
