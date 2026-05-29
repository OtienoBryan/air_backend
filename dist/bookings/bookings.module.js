"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const passenger_entity_1 = require("../entities/passenger.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const seat_reservation_entity_1 = require("../entities/seat-reservation.entity");
const agency_entity_1 = require("../entities/agency.entity");
const agency_ledger_entity_1 = require("../entities/agency-ledger.entity");
const account_entity_1 = require("../entities/account.entity");
const account_ledger_entity_1 = require("../entities/account-ledger.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const bookings_service_1 = require("./bookings.service");
const bookings_controller_1 = require("./bookings.controller");
const passengers_module_1 = require("../passengers/passengers.module");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, flight_series_entity_1.FlightSeries, passenger_entity_1.Passenger, booking_passenger_entity_1.BookingPassenger, seat_reservation_entity_1.SeatReservation, agency_entity_1.Agency, agency_ledger_entity_1.AgencyLedger, account_entity_1.Account, account_ledger_entity_1.AccountLedger, journal_entry_entity_1.JournalEntry, journal_entry_line_entity_1.JournalEntryLine, chart_of_account_entity_1.ChartOfAccount]),
            passengers_module_1.PassengersModule
        ],
        providers: [bookings_service_1.BookingsService],
        controllers: [bookings_controller_1.BookingsController],
        exports: [bookings_service_1.BookingsService]
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map