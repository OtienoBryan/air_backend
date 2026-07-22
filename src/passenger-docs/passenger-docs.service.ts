import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
  attached_documents?: Array<{ url: string; name: string; public_id: string }>;
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

@Injectable()
export class PassengerDocsService {
  constructor(
    @InjectRepository(PassengerMedicalForm)
    private readonly medicalFormRepository: Repository<PassengerMedicalForm>,
    @InjectRepository(PassengerTravelDocument)
    private readonly travelDocumentRepository: Repository<PassengerTravelDocument>,
  ) {}

  async getMedicalForm(passengerId: number): Promise<PassengerMedicalForm | null> {
    return this.medicalFormRepository.findOne({ where: { passenger_id: passengerId } });
  }

  // For a table of passengers — one query instead of N — so pages like
  // FlightPassengers can show a per-row "has medical condition" indicator.
  async getMedicalFormsForPassengers(passengerIds: number[]): Promise<PassengerMedicalForm[]> {
    if (passengerIds.length === 0) return [];
    return this.medicalFormRepository.find({ where: { passenger_id: In(passengerIds) } });
  }

  async saveMedicalForm(passengerId: number, input: MedicalFormInput, staffId: number | null): Promise<PassengerMedicalForm> {
    let record = await this.medicalFormRepository.findOne({ where: { passenger_id: passengerId } });
    if (!record) {
      record = this.medicalFormRepository.create({ passenger_id: passengerId, created_by: staffId });
    }

    if (input.booking_id !== undefined) record.booking_id = input.booking_id ?? null;
    if (input.flight_id !== undefined) record.flight_id = input.flight_id ?? null;
    if (input.flight_series_id !== undefined) record.flight_series_id = input.flight_series_id ?? null;
    if (input.medical_condition !== undefined) record.medical_condition = input.medical_condition ?? null;
    if (input.doctor_name !== undefined) record.doctor_name = input.doctor_name ?? null;
    if (input.hospital_name !== undefined) record.hospital_name = input.hospital_name ?? null;
    if (input.date_submitted !== undefined) record.date_submitted = input.date_submitted ?? null;
    if (input.review_status !== undefined) record.review_status = input.review_status;
    if (input.medical_clearance_expiry_date !== undefined) record.medical_clearance_expiry_date = input.medical_clearance_expiry_date ?? null;
    if (input.ssr_codes !== undefined) record.ssr_codes = input.ssr_codes ?? null;
    if (input.oxygen_required !== undefined) record.oxygen_required = input.oxygen_required;
    if (input.wheelchair_required !== undefined) record.wheelchair_required = input.wheelchair_required;
    if (input.stretcher_required !== undefined) record.stretcher_required = input.stretcher_required;
    if (input.medical_escort_required !== undefined) record.medical_escort_required = input.medical_escort_required;
    if (input.medical_officer_comments !== undefined) record.medical_officer_comments = input.medical_officer_comments ?? null;
    if (input.approval_date !== undefined) record.approval_date = input.approval_date ?? null;
    if (input.attached_documents !== undefined) record.attached_documents = JSON.stringify(input.attached_documents ?? []);
    record.updated_by = staffId;

    return this.medicalFormRepository.save(record);
  }

  async getTravelDocument(passengerId: number): Promise<PassengerTravelDocument | null> {
    return this.travelDocumentRepository.findOne({ where: { passenger_id: passengerId } });
  }

  async saveTravelDocument(passengerId: number, input: TravelDocumentInput, staffId: number | null): Promise<PassengerTravelDocument> {
    let record = await this.travelDocumentRepository.findOne({ where: { passenger_id: passengerId } });
    if (!record) {
      record = this.travelDocumentRepository.create({ passenger_id: passengerId, created_by: staffId });
    }

    if (input.document_type !== undefined) record.document_type = input.document_type ?? null;
    if (input.document_number !== undefined) record.document_number = input.document_number ?? null;
    if (input.nationality !== undefined) record.nationality = input.nationality ?? null;
    if (input.issuing_country !== undefined) record.issuing_country = input.issuing_country ?? null;
    if (input.issue_date !== undefined) record.issue_date = input.issue_date ?? null;
    if (input.expiry_date !== undefined) record.expiry_date = input.expiry_date ?? null;
    if (input.document_scan_url !== undefined) record.document_scan_url = input.document_scan_url ?? null;
    if (input.document_scan_public_id !== undefined) record.document_scan_public_id = input.document_scan_public_id ?? null;
    record.updated_by = staffId;

    return this.travelDocumentRepository.save(record);
  }
}
