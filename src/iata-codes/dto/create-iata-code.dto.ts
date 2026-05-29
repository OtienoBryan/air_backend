import { IsString, IsOptional, IsNumber, Length, MaxLength } from 'class-validator';

export class CreateIataCodeDto {
    @IsString()
    @Length(3, 3)
    code: string;

    @IsOptional()
    @IsString()
    @Length(4, 4)
    icao?: string;

    @IsString()
    @MaxLength(255)
    airport: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @IsString()
    @Length(2, 2)
    country_code: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    region_name?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    status?: string;
}
