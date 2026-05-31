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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
let Account = class Account {
    id;
    name;
    code;
    currency = null;
    balance = 0;
    status = 'active';
    created_at;
    updated_at;
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Account.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Account.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Account.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Account.prototype, "updated_at", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)('chart_of_accounts')
], Account);
//# sourceMappingURL=account.entity.js.map