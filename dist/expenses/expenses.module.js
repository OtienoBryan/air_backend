"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expenses_service_1 = require("./expenses.service");
const expenses_controller_1 = require("./expenses.controller");
const expense_entity_1 = require("../entities/expense.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const account_entity_1 = require("../entities/account.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const supplier_ledger_entity_1 = require("../entities/supplier-ledger.entity");
const expense_category_entity_1 = require("../entities/expense-category.entity");
const expense_type_entity_1 = require("../entities/expense-type.entity");
const flight_route_entity_1 = require("../entities/flight-route.entity");
const aircraft_entity_1 = require("../entities/aircraft.entity");
const flight_entity_1 = require("../entities/flight.entity");
let ExpensesModule = class ExpensesModule {
};
exports.ExpensesModule = ExpensesModule;
exports.ExpensesModule = ExpensesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([expense_entity_1.Expense, chart_of_account_entity_1.ChartOfAccount, account_entity_1.Account, journal_entry_entity_1.JournalEntry, journal_entry_line_entity_1.JournalEntryLine, supplier_entity_1.Supplier, supplier_ledger_entity_1.SupplierLedger, expense_category_entity_1.ExpenseCategory, expense_type_entity_1.ExpenseType, flight_route_entity_1.FlightRoute, aircraft_entity_1.Aircraft, flight_entity_1.Flight])],
        controllers: [expenses_controller_1.ExpensesController, expenses_controller_1.ChartOfAccountsController, expenses_controller_1.ExpenseCategoriesController, expenses_controller_1.ExpenseTypesController],
        providers: [expenses_service_1.ExpensesService],
        exports: [expenses_service_1.ExpensesService],
    })
], ExpensesModule);
//# sourceMappingURL=expenses.module.js.map