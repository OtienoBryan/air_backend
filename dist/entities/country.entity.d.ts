import { Notice } from './notice.entity';
export declare class Country {
    id: number;
    name: string;
    status: number;
    notices?: Notice[];
}
