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
exports.SalesRep = void 0;
const typeorm_1 = require("typeorm");
let SalesRep = class SalesRep {
    id;
    name;
    email;
    phoneNumber;
    password;
    countryId;
    country;
    region_id;
    region;
    route_id;
    route;
    route_id_update;
    route_name_update;
    visits_targets;
    new_clients;
    vapes_targets;
    pouches_targets;
    role;
    manager_type;
    status;
    createdAt;
};
exports.SalesRep = SalesRep;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesRep.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], SalesRep.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], SalesRep.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], SalesRep.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], SalesRep.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "countryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], SalesRep.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "region_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], SalesRep.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "route_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SalesRep.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "route_id_update", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SalesRep.prototype, "route_name_update", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', width: 3 }),
    __metadata("design:type", Number)
], SalesRep.prototype, "visits_targets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', width: 3 }),
    __metadata("design:type", Number)
], SalesRep.prototype, "new_clients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "vapes_targets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "pouches_targets", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191, nullable: true, default: 'USER' }),
    __metadata("design:type", String)
], SalesRep.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalesRep.prototype, "manager_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], SalesRep.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', precision: 3 }),
    __metadata("design:type", Date)
], SalesRep.prototype, "createdAt", void 0);
exports.SalesRep = SalesRep = __decorate([
    (0, typeorm_1.Entity)('SalesRep')
], SalesRep);
//# sourceMappingURL=sales-rep.entity.js.map