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
exports.CreateSeatReservationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateSeatReservationDto {
    flight_series_id;
    number_of_seats;
    passenger_id;
    passenger_name;
    passenger_email;
    passenger_phone;
    status;
    reservation_date;
    notes;
    agent_id;
    country_id;
    id_type;
    id_number;
    id_expiry;
    id_issued_by;
    trip_type;
    return_flight_series_id;
    return_date;
    fare_amount;
    payment_status;
    amount_paid;
}
exports.CreateSeatReservationDto = CreateSeatReservationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSeatReservationDto.prototype, "flight_series_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSeatReservationDto.prototype, "number_of_seats", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSeatReservationDto.prototype, "passenger_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "passenger_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "passenger_email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "passenger_phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['reserved', 'confirmed', 'cancelled', 'checked_in', 'booked']),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "reservation_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "agent_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "country_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['national_id', 'passport', 'travel_document']),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "id_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "id_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "id_expiry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "id_issued_by", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['one_way', 'return']),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "trip_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "return_flight_series_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "return_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => { if (value === null || value === '' || value === undefined)
        return null; const n = Number(value); return isNaN(n) ? null : n; }),
    (0, class_validator_1.ValidateIf)((o, v) => v !== null),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateSeatReservationDto.prototype, "fare_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['unpaid', 'partial', 'paid']),
    __metadata("design:type", String)
], CreateSeatReservationDto.prototype, "payment_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => { if (value === null || value === '' || value === undefined)
        return 0; const n = Number(value); return isNaN(n) ? 0 : n; }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSeatReservationDto.prototype, "amount_paid", void 0);
//# sourceMappingURL=create-seat-reservation.dto.js.map