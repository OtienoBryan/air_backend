"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerDocsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const passenger_docs_service_1 = require("./passenger-docs.service");
let PassengerDocsController = class PassengerDocsController {
    passengerDocsService;
    cloudinaryService;
    constructor(passengerDocsService, cloudinaryService) {
        this.passengerDocsService = passengerDocsService;
        this.cloudinaryService = cloudinaryService;
    }
    async getMedicalFormsBulk(passengerIds) {
        const ids = (passengerIds ?? '')
            .split(',')
            .map(id => parseInt(id, 10))
            .filter(id => !isNaN(id));
        return this.passengerDocsService.getMedicalFormsForPassengers(ids);
    }
    async getMedicalForm(passengerId) {
        return this.passengerDocsService.getMedicalForm(passengerId);
    }
    async saveMedicalForm(passengerId, body, req) {
        const staffId = req.user?.sub ? Number(req.user.sub) : null;
        return this.passengerDocsService.saveMedicalForm(passengerId, body, staffId);
    }
    async getTravelDocument(passengerId) {
        return this.passengerDocsService.getTravelDocument(passengerId);
    }
    async saveTravelDocument(passengerId, body, req) {
        const staffId = req.user?.sub ? Number(req.user.sub) : null;
        return this.passengerDocsService.saveTravelDocument(passengerId, body, staffId);
    }
    async uploadDocument(file) {
        if (!file) {
            throw new Error('No file provided');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size must be less than 10MB');
        }
        return this.cloudinaryService.uploadDocument(file, 'passenger-documents');
    }
};
exports.PassengerDocsController = PassengerDocsController;
__decorate([
    (0, common_1.Get)('medical/bulk'),
    __param(0, (0, common_1.Query)('passengerIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassengerDocsController.prototype, "getMedicalFormsBulk", null);
__decorate([
    (0, common_1.Get)('medical/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerDocsController.prototype, "getMedicalForm", null);
__decorate([
    (0, common_1.Put)('medical/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerDocsController.prototype, "saveMedicalForm", null);
__decorate([
    (0, common_1.Get)('travel/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PassengerDocsController.prototype, "getTravelDocument", null);
__decorate([
    (0, common_1.Put)('travel/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PassengerDocsController.prototype, "saveTravelDocument", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PassengerDocsController.prototype, "uploadDocument", null);
exports.PassengerDocsController = PassengerDocsController = __decorate([
    (0, common_1.Controller)('admin/passenger-docs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [passenger_docs_service_1.PassengerDocsService,
        cloudinary_service_1.CloudinaryService])
], PassengerDocsController);
//# sourceMappingURL=passenger-docs.controller.js.map