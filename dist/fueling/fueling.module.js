"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fueling_entity_1 = require("../entities/fueling.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const supplier_ledger_entity_1 = require("../entities/supplier-ledger.entity");
const account_ledger_entity_1 = require("../entities/account-ledger.entity");
const account_entity_1 = require("../entities/account.entity");
const fueling_controller_1 = require("./fueling.controller");
const fueling_service_1 = require("./fueling.service");
let FuelingModule = class FuelingModule {
};
exports.FuelingModule = FuelingModule;
exports.FuelingModule = FuelingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                fueling_entity_1.Fueling,
                flight_series_entity_1.FlightSeries,
                supplier_entity_1.Supplier,
                chart_of_account_entity_1.ChartOfAccount,
                journal_entry_entity_1.JournalEntry,
                journal_entry_line_entity_1.JournalEntryLine,
                supplier_ledger_entity_1.SupplierLedger,
                account_ledger_entity_1.AccountLedger,
                account_entity_1.Account,
            ]),
        ],
        controllers: [fueling_controller_1.FuelingController],
        providers: [fueling_service_1.FuelingService],
        exports: [fueling_service_1.FuelingService],
    })
], FuelingModule);
//# sourceMappingURL=fueling.module.js.map