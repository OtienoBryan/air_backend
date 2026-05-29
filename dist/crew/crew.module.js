"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crew_entity_1 = require("../entities/crew.entity");
const crew_service_1 = require("./crew.service");
const crew_controller_1 = require("./crew.controller");
let CrewModule = class CrewModule {
};
exports.CrewModule = CrewModule;
exports.CrewModule = CrewModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([crew_entity_1.Crew])],
        controllers: [crew_controller_1.CrewController],
        providers: [crew_service_1.CrewService],
        exports: [crew_service_1.CrewService],
    })
], CrewModule);
//# sourceMappingURL=crew.module.js.map