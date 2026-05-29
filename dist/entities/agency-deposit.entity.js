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
exports.AgencyDeposit = void 0;
const typeorm_1 = require("typeorm");
const agency_entity_1 = require("./agency.entity");
const account_entity_1 = require("./account.entity");
let AgencyDeposit = class AgencyDeposit {
    id;
    agencyId;
    accountId;
    amount;
    datePaid;
    description;
    paymentMethod;
    reference;
    createdAt;
    updatedAt;
    agency;
    account;
};
exports.AgencyDeposit = AgencyDeposit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AgencyDeposit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agency_id', type: 'int' }),
    __metadata("design:type", Number)
], AgencyDeposit.prototype, "agencyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_id', type: 'int' }),
    __metadata("design:type", Number)
], AgencyDeposit.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], AgencyDeposit.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_paid', type: 'date' }),
    __metadata("design:type", Date)
], AgencyDeposit.prototype, "datePaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AgencyDeposit.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AgencyDeposit.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AgencyDeposit.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AgencyDeposit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AgencyDeposit.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agency_entity_1.Agency),
    (0, typeorm_1.JoinColumn)({ name: 'agency_id' }),
    __metadata("design:type", agency_entity_1.Agency)
], AgencyDeposit.prototype, "agency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.Account),
    (0, typeorm_1.JoinColumn)({ name: 'account_id' }),
    __metadata("design:type", account_entity_1.Account)
], AgencyDeposit.prototype, "account", void 0);
exports.AgencyDeposit = AgencyDeposit = __decorate([
    (0, typeorm_1.Entity)('agency_deposits')
], AgencyDeposit);
//# sourceMappingURL=agency-deposit.entity.js.map