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
exports.ClientLedger = void 0;
const typeorm_1 = require("typeorm");
const client_entity_1 = require("./client.entity");
let ClientLedger = class ClientLedger {
    id;
    clientId;
    transactionDate;
    description;
    debit;
    credit;
    balance;
    reference;
    createdAt;
    updatedAt;
    client;
};
exports.ClientLedger = ClientLedger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ClientLedger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_id' }),
    __metadata("design:type", Number)
], ClientLedger.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'date' }),
    __metadata("design:type", Date)
], ClientLedger.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ClientLedger.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'debit', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ClientLedger.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ClientLedger.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ClientLedger.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ClientLedger.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClientLedger.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClientLedger.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, client => client.id),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.Client)
], ClientLedger.prototype, "client", void 0);
exports.ClientLedger = ClientLedger = __decorate([
    (0, typeorm_1.Entity)('client_ledger')
], ClientLedger);
//# sourceMappingURL=client-ledger.entity.js.map