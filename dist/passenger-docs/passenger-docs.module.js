"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerDocsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passenger_medical_form_entity_1 = require("../entities/passenger-medical-form.entity");
const passenger_travel_document_entity_1 = require("../entities/passenger-travel-document.entity");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const passenger_docs_service_1 = require("./passenger-docs.service");
const passenger_docs_controller_1 = require("./passenger-docs.controller");
let PassengerDocsModule = class PassengerDocsModule {
};
exports.PassengerDocsModule = PassengerDocsModule;
exports.PassengerDocsModule = PassengerDocsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([passenger_medical_form_entity_1.PassengerMedicalForm, passenger_travel_document_entity_1.PassengerTravelDocument]),
            cloudinary_module_1.CloudinaryModule,
        ],
        providers: [passenger_docs_service_1.PassengerDocsService],
        controllers: [passenger_docs_controller_1.PassengerDocsController],
        exports: [passenger_docs_service_1.PassengerDocsService],
    })
], PassengerDocsModule);
//# sourceMappingURL=passenger-docs.module.js.map