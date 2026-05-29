"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IataCodesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const iata_code_entity_1 = require("../entities/iata-code.entity");
const iata_codes_service_1 = require("./iata-codes.service");
const iata_codes_controller_1 = require("./iata-codes.controller");
let IataCodesModule = class IataCodesModule {
};
exports.IataCodesModule = IataCodesModule;
exports.IataCodesModule = IataCodesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([iata_code_entity_1.IataCode])],
        providers: [iata_codes_service_1.IataCodesService],
        controllers: [iata_codes_controller_1.IataCodesController],
        exports: [iata_codes_service_1.IataCodesService]
    })
], IataCodesModule);
//# sourceMappingURL=iata-codes.module.js.map