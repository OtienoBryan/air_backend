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
exports.FlightException = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("./flight.entity");
const exception_type_entity_1 = require("./exception-type.entity");
let FlightException = class FlightException {
    id;
    flight_id;
    flight;
    exception_type;
    exceptionType;
    reason;
    old_value;
    new_value;
    created_by;
    created_at;
};
exports.FlightException = FlightException;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlightException.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int' }),
    __metadata("design:type", Number)
], FlightException.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_id' }),
    __metadata("design:type", flight_entity_1.Flight)
], FlightException.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exception_type', type: 'int' }),
    __metadata("design:type", Number)
], FlightException.prototype, "exception_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exception_type_entity_1.ExceptionType, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'exception_type' }),
    __metadata("design:type", exception_type_entity_1.ExceptionType)
], FlightException.prototype, "exceptionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], FlightException.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'old_value', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FlightException.prototype, "old_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_value', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FlightException.prototype, "new_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FlightException.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FlightException.prototype, "created_at", void 0);
exports.FlightException = FlightException = __decorate([
    (0, typeorm_1.Entity)('flight_exceptions')
], FlightException);
//# sourceMappingURL=flight-exception.entity.js.map