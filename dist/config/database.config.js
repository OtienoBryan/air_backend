"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const entities_1 = require("../entities");
const client_entity_1 = require("../entities/client.entity");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const aircraft_entity_1 = require("../entities/aircraft.entity");
const destination_entity_1 = require("../entities/destination.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const seat_reservation_entity_1 = require("../entities/seat-reservation.entity");
const passenger_entity_1 = require("../entities/passenger.entity");
const booking_entity_1 = require("../entities/booking.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const client_ledger_entity_1 = require("../entities/client-ledger.entity");
const sales_order_entity_1 = require("../entities/sales-order.entity");
const sales_order_item_entity_1 = require("../entities/sales-order-item.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const supplier_ledger_entity_1 = require("../entities/supplier-ledger.entity");
const fueling_entity_1 = require("../entities/fueling.entity");
const purchase_order_entity_1 = require("../entities/purchase-order.entity");
const purchase_order_item_entity_1 = require("../entities/purchase-order-item.entity");
const task_entity_1 = require("../entities/task.entity");
const crew_entity_1 = require("../entities/crew.entity");
const flight_crew_entity_1 = require("../entities/flight-crew.entity");
const agency_entity_1 = require("../entities/agency.entity");
const agency_ledger_entity_1 = require("../entities/agency-ledger.entity");
const agency_deposit_entity_1 = require("../entities/agency-deposit.entity");
const agent_entity_1 = require("../entities/agent.entity");
const account_entity_1 = require("../entities/account.entity");
const account_ledger_entity_1 = require("../entities/account-ledger.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const expense_entity_1 = require("../entities/expense.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const luggage_entity_1 = require("../entities/luggage.entity");
const iata_code_entity_1 = require("../entities/iata-code.entity");
const account_type_entity_1 = require("../entities/account-type.entity");
const cargo_booking_entity_1 = require("../entities/cargo-booking.entity");
const currency_entity_1 = require("../entities/currency.entity");
const flight_route_entity_1 = require("../entities/flight-route.entity");
const fare_history_entity_1 = require("../entities/fare-history.entity");
const cargo_shc_charge_entity_1 = require("../entities/cargo-shc-charge.entity");
const cargo_freight_rate_entity_1 = require("../entities/cargo-freight-rate.entity");
const cargo_handling_fee_entity_1 = require("../entities/cargo-handling-fee.entity");
const flight_entity_1 = require("../entities/flight.entity");
const exception_type_entity_1 = require("../entities/exception-type.entity");
const flight_exception_entity_1 = require("../entities/flight-exception.entity");
const passenger_disruption_entity_1 = require("../entities/passenger-disruption.entity");
const crew_assignment_entity_1 = require("../entities/crew-assignment.entity");
const expense_category_entity_1 = require("../entities/expense-category.entity");
const expense_type_entity_1 = require("../entities/expense-type.entity");
const country_tax_entity_1 = require("../entities/country-tax.entity");
const route_fare_charge_entity_1 = require("../entities/route-fare-charge.entity");
const route_luggage_setting_entity_1 = require("../entities/route-luggage-setting.entity");
const luggage_excess_charge_entity_1 = require("../entities/luggage-excess-charge.entity");
const getDatabaseConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [entities_1.Staff, entities_1.Department, entities_1.ChatRoom, entities_1.ChatMessage, entities_1.Notice, entities_1.Country, entities_1.SalesRep, entities_1.Region, entities_1.Route, entities_1.LoginHistory, client_entity_1.Client, product_entity_1.Product, category_entity_1.Category, aircraft_entity_1.Aircraft, destination_entity_1.Destination, flight_series_entity_1.FlightSeries, flight_entity_1.Flight, exception_type_entity_1.ExceptionType, flight_exception_entity_1.FlightException, passenger_disruption_entity_1.PassengerDisruption, crew_assignment_entity_1.CrewAssignment, seat_reservation_entity_1.SeatReservation, passenger_entity_1.Passenger, booking_entity_1.Booking, booking_passenger_entity_1.BookingPassenger, client_ledger_entity_1.ClientLedger, sales_order_entity_1.SalesOrder, sales_order_item_entity_1.SalesOrderItem, supplier_entity_1.Supplier, supplier_ledger_entity_1.SupplierLedger, purchase_order_entity_1.PurchaseOrder, purchase_order_item_entity_1.PurchaseOrderItem, task_entity_1.Task, crew_entity_1.Crew, flight_crew_entity_1.FlightCrew, agency_entity_1.Agency, agency_ledger_entity_1.AgencyLedger, agency_deposit_entity_1.AgencyDeposit, agent_entity_1.Agent, account_entity_1.Account, account_ledger_entity_1.AccountLedger, chart_of_account_entity_1.ChartOfAccount, expense_entity_1.Expense, journal_entry_entity_1.JournalEntry, journal_entry_line_entity_1.JournalEntryLine, luggage_entity_1.Luggage, iata_code_entity_1.IataCode, account_type_entity_1.AccountType, fueling_entity_1.Fueling, cargo_booking_entity_1.CargoBooking, currency_entity_1.Currency, flight_route_entity_1.FlightRoute, fare_history_entity_1.FareHistory, cargo_shc_charge_entity_1.CargoShcCharge, cargo_freight_rate_entity_1.CargoFreightRate, cargo_handling_fee_entity_1.CargoHandlingFee, expense_category_entity_1.ExpenseCategory, expense_type_entity_1.ExpenseType, country_tax_entity_1.CountryTax, route_fare_charge_entity_1.RouteFareCharge, route_luggage_setting_entity_1.RouteLuggageSetting, luggage_excess_charge_entity_1.LuggageExcessCharge],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map