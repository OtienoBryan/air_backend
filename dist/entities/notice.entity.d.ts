import { Country } from './country.entity';
export declare class Notice {
    id: number;
    title: string;
    content: string;
    countryId: number;
    country?: Country;
    createdAt: Date;
    status: number;
}
