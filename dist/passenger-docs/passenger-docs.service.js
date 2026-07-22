"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerDocsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passenger_medical_form_entity_1 = require("../entities/passenger-medical-form.entity");
const passenger_travel_document_entity_1 = require("../entities/passenger-travel-document.entity");
let PassengerDocsService = class PassengerDocsService {
    medicalFormRepository;
    travelDocumentRepository;
    constructor(medicalFormRepository, travelDocumentRepository) {
        this.medicalFormRepository = medicalFormRepository;
        this.travelDocumentRepository = travelDocumentRepository;
    }
    async getMedicalForm(passengerId) {
        return this.medicalFormRepository.findOne({ where: { passenger_id: passengerId } });
    }
    async getMedicalFormsForPassengers(passengerIds) {
        if (passengerIds.length === 0)
            return [];
        return this.medicalFormRepository.find({ where: { passenger_id: (0, typeorm_2.In)(passengerIds) } });
    }
    async saveMedicalForm(passengerId, input, staffId) {
        let record = await this.medicalFormRepository.findOne({ where: { passenger_id: passengerId } });
        if (!record) {
            record = this.medicalFormRepository.create({ passenger_id: passengerId, created_by: staffId });
        }
        if (input.booking_id !== undefined)
            record.booking_id = input.booking_id ?? null;
        if (input.flight_id !== undefined)
            record.flight_id = input.flight_id ?? null;
        if (input.flight_series_id !== undefined)
            record.flight_series_id = input.flight_series_id ?? null;
        if (input.medical_condition !== undefined)
            record.medical_condition = input.medical_condition ?? null;
        if (input.doctor_name !== undefined)
            record.doctor_name = input.doctor_name ?? null;
        if (input.hospital_name !== undefined)
            record.hospital_name = input.hospital_name ?? null;
        if (input.date_submitted !== undefined)
            record.date_submitted = input.date_submitted ?? null;
        if (input.review_status !== undefined)
            record.review_status = input.review_status;
        if (input.medical_clearance_expiry_date !== undefined)
            record.medical_clearance_expiry_date = input.medical_clearance_expiry_date ?? null;
        if (input.ssr_codes !== undefined)
            record.ssr_codes = input.ssr_codes ?? null;
        if (input.oxygen_required !== undefined)
            record.oxygen_required = input.oxygen_required;
        if (input.wheelchair_required !== undefined)
            record.wheelchair_required = input.wheelchair_required;
        if (input.stretcher_required !== undefined)
            record.stretcher_required = input.stretcher_required;
        if (input.medical_escort_required !== undefined)
            record.medical_escort_required = input.medical_escort_required;
        if (input.medical_officer_comments !== undefined)
            record.medical_officer_comments = input.medical_officer_comments ?? null;
        if (input.approval_date !== undefined)
            record.approval_date = input.approval_date ?? null;
        if (input.attached_documents !== undefined)
            record.attached_documents = JSON.stringify(input.attached_documents ?? []);
        record.updated_by = staffId;
        return this.medicalFormRepository.save(record);
    }
    async getTravelDocument(passengerId) {
        return this.travelDocumentRepository.findOne({ where: { passenger_id: passengerId } });
    }
    async saveTravelDocument(passengerId, input, staffId) {
        let record = await this.travelDocumentRepository.findOne({ where: { passenger_id: passengerId } });
        if (!record) {
            record = this.travelDocumentRepository.create({ passenger_id: passengerId, created_by: staffId });
        }
        if (input.document_type !== undefined)
            record.document_type = input.document_type ?? null;
        if (input.document_number !== undefined)
            record.document_number = input.document_number ?? null;
        if (input.nationality !== undefined)
            record.nationality = input.nationality ?? null;
        if (input.issuing_country !== undefined)
            record.issuing_country = input.issuing_country ?? null;
        if (input.issue_date !== undefined)
            record.issue_date = input.issue_date ?? null;
        if (input.expiry_date !== undefined)
            record.expiry_date = input.expiry_date ?? null;
        if (input.document_scan_url !== undefined)
            record.document_scan_url = input.document_scan_url ?? null;
        if (input.document_scan_public_id !== undefined)
            record.document_scan_public_id = input.document_scan_public_id ?? null;
        record.updated_by = staffId;
        return this.travelDocumentRepository.save(record);
    }
};
exports.PassengerDocsService = PassengerDocsService;
exports.PassengerDocsService = PassengerDocsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(passenger_medical_form_entity_1.PassengerMedicalForm)),
    __param(1, (0, typeorm_1.InjectRepository)(passenger_travel_document_entity_1.PassengerTravelDocument)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PassengerDocsService);
//# sourceMappingURL=passenger-docs.service.js.map