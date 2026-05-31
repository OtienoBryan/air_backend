import { Notice } from './notice.entity';
export declare class Country {
    id: number;
    name: string;
    status: number;
    tax_percentage: number | null;
    notices?: Notice[];
}
