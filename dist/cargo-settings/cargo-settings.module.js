"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoSettingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cargo_shc_charge_entity_1 = require("../entities/cargo-shc-charge.entity");
const cargo_freight_rate_entity_1 = require("../entities/cargo-freight-rate.entity");
const cargo_handling_fee_entity_1 = require("../entities/cargo-handling-fee.entity");
const cargo_settings_controller_1 = require("./cargo-settings.controller");
const cargo_settings_service_1 = require("./cargo-settings.service");
let CargoSettingsModule = class CargoSettingsModule {
};
exports.CargoSettingsModule = CargoSettingsModule;
exports.CargoSettingsModule = CargoSettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cargo_shc_charge_entity_1.CargoShcCharge, cargo_freight_rate_entity_1.CargoFreightRate, cargo_handling_fee_entity_1.CargoHandlingFee])],
        controllers: [cargo_settings_controller_1.CargoSettingsController],
        providers: [cargo_settings_service_1.CargoSettingsService],
        exports: [cargo_settings_service_1.CargoSettingsService],
    })
], CargoSettingsModule);
//# sourceMappingURL=cargo-settings.module.js.map