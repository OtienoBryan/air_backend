import { Passenger } from './passenger.entity';
export declare class PassengerTravelDocument {
    id: number;
    passenger_id: number;
    passenger?: Passenger;
    document_type: string | null;
    document_number: string | null;
    nationality: string | null;
    issuing_country: string | null;
    issue_date: string | null;
    expiry_date: string | null;
    document_scan_url: string | null;
    document_scan_public_id: string | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Date;
    updated_at: Date;
}
