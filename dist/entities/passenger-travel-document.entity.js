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
exports.PassengerTravelDocument = void 0;
const typeorm_1 = require("typeorm");
const passenger_entity_1 = require("./passenger.entity");
let PassengerTravelDocument = class PassengerTravelDocument {
    id;
    passenger_id;
    passenger;
    document_type;
    document_number;
    nationality;
    issuing_country;
    issue_date;
    expiry_date;
    document_scan_url;
    document_scan_public_id;
    created_by;
    updated_by;
    created_at;
    updated_at;
};
exports.PassengerTravelDocument = PassengerTravelDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PassengerTravelDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passenger_id', type: 'int' }),
    __metadata("design:type", Number)
], PassengerTravelDocument.prototype, "passenger_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passenger_entity_1.Passenger),
    (0, typeorm_1.JoinColumn)({ name: 'passenger_id' }),
    __metadata("design:type", passenger_entity_1.Passenger)
], PassengerTravelDocument.prototype, "passenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_type', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "document_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "document_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issuing_country', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "issuing_country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "issue_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_scan_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "document_scan_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'document_scan_public_id', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "document_scan_public_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], PassengerTravelDocument.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PassengerTravelDocument.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PassengerTravelDocument.prototype, "updated_at", void 0);
exports.PassengerTravelDocument = PassengerTravelDocument = __decorate([
    (0, typeorm_1.Entity)('passenger_travel_documents')
], PassengerTravelDocument);
//# sourceMappingURL=passenger-travel-document.entity.js.map