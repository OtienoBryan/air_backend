"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoBookingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cargo_booking_entity_1 = require("../entities/cargo-booking.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const cargo_bookings_service_1 = require("./cargo-bookings.service");
const cargo_bookings_controller_1 = require("./cargo-bookings.controller");
let CargoBookingsModule = class CargoBookingsModule {
};
exports.CargoBookingsModule = CargoBookingsModule;
exports.CargoBookingsModule = CargoBookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cargo_booking_entity_1.CargoBooking, flight_series_entity_1.FlightSeries])],
        providers: [cargo_bookings_service_1.CargoBookingsService],
        controllers: [cargo_bookings_controller_1.CargoBookingsController],
        exports: [cargo_bookings_service_1.CargoBookingsService],
    })
], CargoBookingsModule);
//# sourceMappingURL=cargo-bookings.module.js.map