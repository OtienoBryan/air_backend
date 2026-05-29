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
exports.AccountType = void 0;
const typeorm_1 = require("typeorm");
const chart_of_account_entity_1 = require("./chart-of-account.entity");
let AccountType = class AccountType {
    id;
    name;
    created_at;
    chartOfAccounts;
};
exports.AccountType = AccountType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AccountType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_type', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AccountType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AccountType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chart_of_account_entity_1.ChartOfAccount, chartOfAccount => chartOfAccount.accountType),
    __metadata("design:type", Array)
], AccountType.prototype, "chartOfAccounts", void 0);
exports.AccountType = AccountType = __decorate([
    (0, typeorm_1.Entity)('account_types')
], AccountType);
//# sourceMappingURL=account-type.entity.js.map