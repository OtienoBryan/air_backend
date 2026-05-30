import { Country } from './country.entity';
export declare class Destination {
    id: number;
    code: string;
    icao_code: string | null;
    name: string;
    country_id: number | null;
    country?: Country;
    longitude: number;
    latitude: number;
    timezone: string;
    status: string;
    father_code: string;
    destination: string;
    destination_type: string;
    created_at: Date;
    updated_at: Date;
}
