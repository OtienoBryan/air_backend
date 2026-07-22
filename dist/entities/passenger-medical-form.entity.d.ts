import { Passenger } from './passenger.entity';
export declare class PassengerMedicalForm {
    id: number;
    passenger_id: number;
    passenger?: Passenger;
    booking_id: number | null;
    flight_id: number | null;
    flight_series_id: number | null;
    medical_condition: string | null;
    doctor_name: string | null;
    hospital_name: string | null;
    date_submitted: string | null;
    review_status: 'pending' | 'approved' | 'rejected';
    medical_clearance_expiry_date: string | null;
    ssr_codes: string | null;
    oxygen_required: boolean;
    wheelchair_required: 'none' | 'WCHR' | 'WCHS' | 'WCHC';
    stretcher_required: boolean;
    medical_escort_required: boolean;
    medical_officer_comments: string | null;
    approval_date: string | null;
    attached_documents: string | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Date;
    updated_at: Date;
}
