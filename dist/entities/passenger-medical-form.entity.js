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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerMedicalForm = void 0;
const typeorm_1 = require("typeorm");
const passenger_entity_1 = require("./passenger.entity");
let PassengerMedicalForm = class PassengerMedicalForm {
    id;
    passenger_id;
    passenger;
    booking_id;
    flight_id;
    flight_series_id;
    medical_condition;
    doctor_name;
    hospital_name;
    date_submitted;
    review_status;
    medical_clearance_expiry_date;
    ssr_codes;
    oxygen_required;
    wheelchair_required;
    stretcher_required;
    medical_escort_required;
    medical_officer_comments;
    approval_date;
    attached_documents;
    created_by;
    updated_by;
    created_at;
    updated_at;
};
exports.PassengerMedicalForm = PassengerMedicalForm;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PassengerMedicalForm.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int' }),
    __metadata("design:type", Number)
], PassengerMedicalForm.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], PassengerMedicalForm.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "booking_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_series_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "flight_series_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_condition', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "medical_condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_name', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "doctor_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hospital_name', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "hospital_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_submitted', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "date_submitted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review_status', type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' }),
    __metadata("design:type", String)
], PassengerMedicalForm.prototype, "review_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_clearance_expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "medical_clearance_expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ssr_codes', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "ssr_codes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oxygen_required', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], PassengerMedicalForm.prototype, "oxygen_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wheelchair_required', type: 'enum', enum: ['none', 'WCHR', 'WCHS', 'WCHC'], default: 'none' }),
    __metadata("design:type", String)
], PassengerMedicalForm.prototype, "wheelchair_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stretcher_required', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], PassengerMedicalForm.prototype, "stretcher_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_escort_required', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], PassengerMedicalForm.prototype, "medical_escort_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_officer_comments', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "medical_officer_comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approval_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "approval_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attached_documents', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "attached_documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerMedicalForm.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PassengerMedicalForm.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PassengerMedicalForm.prototype, "updated_at", void 0);
exports.PassengerMedicalForm = PassengerMedicalForm = __decorate([
    (0, typeorm_1.Entity)('passenger_medical_forms')
], PassengerMedicalForm);
//# sourceMappingURL=passenger-medical-form.entity.js.map