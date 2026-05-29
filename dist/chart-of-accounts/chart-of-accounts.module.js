"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartOfAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chart_of_accounts_service_1 = require("./chart-of-accounts.service");
const chart_of_accounts_controller_1 = require("./chart-of-accounts.controller");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const account_type_entity_1 = require("../entities/account-type.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
let ChartOfAccountsModule = class ChartOfAccountsModule {
};
exports.ChartOfAccountsModule = ChartOfAccountsModule;
exports.ChartOfAccountsModule = ChartOfAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chart_of_account_entity_1.ChartOfAccount, account_type_entity_1.AccountType, journal_entry_line_entity_1.JournalEntryLine, journal_entry_entity_1.JournalEntry])],
        controllers: [chart_of_accounts_controller_1.ChartOfAccountsController],
        providers: [chart_of_accounts_service_1.ChartOfAccountsService],
        exports: [chart_of_accounts_service_1.ChartOfAccountsService],
    })
], ChartOfAccountsModule);
//# sourceMappingURL=chart-of-accounts.module.js.map