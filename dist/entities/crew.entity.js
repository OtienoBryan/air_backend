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
exports.Crew = void 0;
const typeorm_1 = require("typeorm");
let Crew = class Crew {
    id;
    name;
    contact;
    role;
    nationality;
    id_number;
    license_number;
    license_issue_date;
    medical_class;
    medical_date;
    fixed_wing_training_date;
    rotorcraft_asel;
    rotorcraft_amel;
    rotorcraft_ases;
    rotorcraft_ames;
    created_at;
    updated_at;
};
exports.Crew = Crew;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Crew.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Crew.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Crew.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "id_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'license_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "license_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'license_issue_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "license_issue_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_class', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "medical_class", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "medical_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fixed_wing_training_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "fixed_wing_training_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rotorcraft_asel', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "rotorcraft_asel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rotorcraft_amel', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "rotorcraft_amel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rotorcraft_ases', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "rotorcraft_ases", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rotorcraft_ames', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Crew.prototype, "rotorcraft_ames", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Crew.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Crew.prototype, "updated_at", void 0);
exports.Crew = Crew = __decorate([
    (0, typeorm_1.Entity)('crew')
], Crew);
//# sourceMappingURL=crew.entity.js.map