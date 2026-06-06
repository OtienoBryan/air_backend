"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./auth/auth.module");
const chat_module_1 = require("./chat/chat.module");
const notices_module_1 = require("./notices/notices.module");
const countries_module_1 = require("./countries/countries.module");
const sales_orders_module_1 = require("./sales-orders/sales-orders.module");
const sales_reps_module_1 = require("./sales-reps/sales-reps.module");
const staff_module_1 = require("./staff/staff.module");
const receivable_aging_module_1 = require("./receivable-aging/receivable-aging.module");
const invoices_module_1 = require("./invoices/invoices.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const purchase_orders_module_1 = require("./purchase-orders/purchase-orders.module");
const products_module_1 = require("./products/products.module");
const tasks_module_1 = require("./tasks/tasks.module");
const inventory_module_1 = require("./inventory/inventory.module");
const categories_module_1 = require("./categories/categories.module");
const aircrafts_module_1 = require("./aircrafts/aircrafts.module");
const destinations_module_1 = require("./destinations/destinations.module");
const flight_series_module_1 = require("./flight-series/flight-series.module");
const seat_reservations_module_1 = require("./seat-reservations/seat-reservations.module");
const passengers_module_1 = require("./passengers/passengers.module");
const bookings_module_1 = require("./bookings/bookings.module");
const crew_module_1 = require("./crew/crew.module");
const agencies_module_1 = require("./agencies/agencies.module");
const luggage_module_1 = require("./luggage/luggage.module");
const agents_module_1 = require("./agents/agents.module");
const accounts_module_1 = require("./accounts/accounts.module");
const iata_codes_module_1 = require("./iata-codes/iata-codes.module");
const expenses_module_1 = require("./expenses/expenses.module");
const chart_of_accounts_module_1 = require("./chart-of-accounts/chart-of-accounts.module");
const fueling_module_1 = require("./fueling/fueling.module");
const journal_entries_module_1 = require("./journal-entries/journal-entries.module");
const payroll_module_1 = require("./payroll/payroll.module");
const cargo_bookings_module_1 = require("./cargo-bookings/cargo-bookings.module");
const cargo_settings_module_1 = require("./cargo-settings/cargo-settings.module");
const currencies_module_1 = require("./currencies/currencies.module");
const flight_routes_module_1 = require("./flight-routes/flight-routes.module");
const reports_module_1 = require("./reports/reports.module");
const global_auth_guard_1 = require("./auth/global-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            chat_module_1.ChatModule,
            notices_module_1.NoticesModule,
            countries_module_1.CountriesModule,
            sales_orders_module_1.SalesOrdersModule,
            sales_reps_module_1.SalesRepsModule,
            staff_module_1.StaffModule,
            receivable_aging_module_1.ReceivableAgingModule,
            invoices_module_1.InvoicesModule,
            suppliers_module_1.SuppliersModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            products_module_1.ProductsModule,
            tasks_module_1.TasksModule,
            inventory_module_1.InventoryModule,
            categories_module_1.CategoriesModule,
            aircrafts_module_1.AircraftsModule,
            destinations_module_1.DestinationsModule,
            flight_series_module_1.FlightSeriesModule,
            seat_reservations_module_1.SeatReservationsModule,
            passengers_module_1.PassengersModule,
            bookings_module_1.BookingsModule,
            crew_module_1.CrewModule,
            agencies_module_1.AgenciesModule,
            luggage_module_1.LuggageModule,
            agents_module_1.AgentsModule,
            accounts_module_1.AccountsModule,
            iata_codes_module_1.IataCodesModule,
            expenses_module_1.ExpensesModule,
            chart_of_accounts_module_1.ChartOfAccountsModule,
            fueling_module_1.FuelingModule,
            journal_entries_module_1.JournalEntriesModule,
            payroll_module_1.PayrollModule,
            cargo_bookings_module_1.CargoBookingsModule,
            cargo_settings_module_1.CargoSettingsModule,
            currencies_module_1.CurrenciesModule,
            flight_routes_module_1.FlightRoutesModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: global_auth_guard_1.GlobalAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map