"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuggageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const luggage_entity_1 = require("../entities/luggage.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const booking_entity_1 = require("../entities/booking.entity");
const luggage_service_1 = require("./luggage.service");
const luggage_controller_1 = require("./luggage.controller");
let LuggageModule = class LuggageModule {
};
exports.LuggageModule = LuggageModule;
exports.LuggageModule = LuggageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([luggage_entity_1.Luggage, booking_passenger_entity_1.BookingPassenger, booking_entity_1.Booking])],
        providers: [luggage_service_1.LuggageService],
        controllers: [luggage_controller_1.LuggageController],
        exports: [luggage_service_1.LuggageService],
    })
], LuggageModule);
//# sourceMappingURL=luggage.module.js.map