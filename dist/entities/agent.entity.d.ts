import { Agency } from './agency.entity';
export declare class Agent {
    id: number;
    name: string;
    email: string | null;
    country: string | null;
    contact: string | null;
    agency_id: number | null;
    agency?: Agency | null;
    password: string | null;
    password_hash: string | null;
    use_deposit: boolean;
    created_at: Date;
    updated_at: Date;
}
