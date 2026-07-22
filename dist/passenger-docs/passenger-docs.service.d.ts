import { Repository } from 'typeorm';
import { PassengerMedicalForm } from '../entities/passenger-medical-form.entity';
import { PassengerTravelDocument } from '../entities/passenger-travel-document.entity';
export interface MedicalFormInput {
    booking_id?: number | null;
    flight_id?: number | null;
    flight_series_id?: number | null;
    medical_condition?: string | null;
    doctor_name?: string | null;
    hospital_name?: string | null;
    date_submitted?: string | null;
    review_status?: 'pending' | 'approved' | 'rejected';
    medical_clearance_expiry_date?: string | null;
    ssr_codes?: string | null;
    oxygen_required?: boolean;
    wheelchair_required?: 'none' | 'WCHR' | 'WCHS' | 'WCHC';
    stretcher_required?: boolean;
    medical_escort_required?: boolean;
    medical_officer_comments?: string | null;
    approval_date?: string | null;
    attached_documents?: Array<{
        url: string;
        name: string;
        public_id: string;
    }>;
}
export interface TravelDocumentInput {
    document_type?: string | null;
    document_number?: string | null;
    nationality?: string | null;
    issuing_country?: string | null;
    issue_date?: string | null;
    expiry_date?: string | null;
    document_scan_url?: string | null;
    document_scan_public_id?: string | null;
}
export declare class PassengerDocsService {
    private readonly medicalFormRepository;
    private readonly travelDocumentRepository;
    constructor(medicalFormRepository: Repository<PassengerMedicalForm>, travelDocumentRepository: Repository<PassengerTravelDocument>);
    getMedicalForm(passengerId: number): Promise<PassengerMedicalForm | null>;
    getMedicalFormsForPassengers(passengerIds: number[]): Promise<PassengerMedicalForm[]>;
    saveMedicalForm(passengerId: number, input: MedicalFormInput, staffId: number | null): Promise<PassengerMedicalForm>;
    getTravelDocument(passengerId: number): Promise<PassengerTravelDocument | null>;
    saveTravelDocument(passengerId: number, input: TravelDocumentInput, staffId: number | null): Promise<PassengerTravelDocument>;
}
