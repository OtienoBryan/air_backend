"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightSeriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const aircraft_entity_1 = require("../entities/aircraft.entity");
const destination_entity_1 = require("../entities/destination.entity");
const flight_crew_entity_1 = require("../entities/flight-crew.entity");
const crew_entity_1 = require("../entities/crew.entity");
const flight_series_service_1 = require("./flight-series.service");
const flight_series_controller_1 = require("./flight-series.controller");
let FlightSeriesModule = class FlightSeriesModule {
};
exports.FlightSeriesModule = FlightSeriesModule;
exports.FlightSeriesModule = FlightSeriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flight_series_entity_1.FlightSeries, aircraft_entity_1.Aircraft, destination_entity_1.Destination, flight_crew_entity_1.FlightCrew, crew_entity_1.Crew])],
        providers: [flight_series_service_1.FlightSeriesService],
        controllers: [flight_series_controller_1.FlightSeriesController],
        exports: [flight_series_service_1.FlightSeriesService]
    })
], FlightSeriesModule);
//# sourceMappingURL=flight-series.module.js.map