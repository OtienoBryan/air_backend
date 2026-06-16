"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightRoutesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flight_routes_service_1 = require("./flight-routes.service");
const flight_routes_controller_1 = require("./flight-routes.controller");
const flight_route_entity_1 = require("../entities/flight-route.entity");
const fare_history_entity_1 = require("../entities/fare-history.entity");
const route_fare_charge_entity_1 = require("../entities/route-fare-charge.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const route_luggage_setting_entity_1 = require("../entities/route-luggage-setting.entity");
let FlightRoutesModule = class FlightRoutesModule {
};
exports.FlightRoutesModule = FlightRoutesModule;
exports.FlightRoutesModule = FlightRoutesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flight_route_entity_1.FlightRoute, fare_history_entity_1.FareHistory, route_fare_charge_entity_1.RouteFareCharge, chart_of_account_entity_1.ChartOfAccount, route_luggage_setting_entity_1.RouteLuggageSetting])],
        controllers: [flight_routes_controller_1.FlightRoutesController],
        providers: [flight_routes_service_1.FlightRoutesService],
        exports: [flight_routes_service_1.FlightRoutesService],
    })
], FlightRoutesModule);
//# sourceMappingURL=flight-routes.module.js.map