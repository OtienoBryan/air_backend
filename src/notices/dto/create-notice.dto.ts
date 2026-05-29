import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Min(1)
  countryId: number;

  @IsInt()
  @Min(0)
  @Max(1)
  status?: number = 1; // Default to active
}
