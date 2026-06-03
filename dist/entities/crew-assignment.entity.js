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
exports.CrewAssignment = void 0;
const typeorm_1 = require("typeorm");
const flight_entity_1 = require("./flight.entity");
const crew_entity_1 = require("./crew.entity");
let CrewAssignment = class CrewAssignment {
    id;
    flight_id;
    flight;
    crew_id;
    crew;
    role;
    notes;
    created_at;
};
exports.CrewAssignment = CrewAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CrewAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flight_id', type: 'int' }),
    __metadata("design:type", Number)
], CrewAssignment.prototype, "flight_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'flight_id' }),
    __metadata("design:type", flight_entity_1.Flight)
], CrewAssignment.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crew_id', type: 'int' }),
    __metadata("design:type", Number)
], CrewAssignment.prototype, "crew_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crew_entity_1.Crew, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'crew_id' }),
    __metadata("design:type", crew_entity_1.Crew)
], CrewAssignment.prototype, "crew", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], CrewAssignment.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CrewAssignment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CrewAssignment.prototype, "created_at", void 0);
exports.CrewAssignment = CrewAssignment = __decorate([
    (0, typeorm_1.Entity)('crew_assignments'),
    (0, typeorm_1.Unique)(['flight_id', 'crew_id'])
], CrewAssignment);
//# sourceMappingURL=crew-assignment.entity.js.map