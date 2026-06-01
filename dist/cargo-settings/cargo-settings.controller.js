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
exports.CargoSettingsController = void 0;
const common_1 = require("@nestjs/common");
const cargo_settings_service_1 = require("./cargo-settings.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CargoSettingsController = class CargoSettingsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getShcCharges() { return this.svc.getShcCharges(); }
    createShcCharge(b) { return this.svc.createShcCharge(b); }
    updateShcCharge(id, b) { return this.svc.updateShcCharge(id, b); }
    deleteShcCharge(id) { return this.svc.deleteShcCharge(id); }
    getFreightRates() { return this.svc.getFreightRates(); }
    createFreightRate(b) { return this.svc.createFreightRate(b); }
    updateFreightRate(id, b) { return this.svc.updateFreightRate(id, b); }
    deleteFreightRate(id) { return this.svc.deleteFreightRate(id); }
    getHandlingFees() { return this.svc.getHandlingFees(); }
    createHandlingFee(b) { return this.svc.createHandlingFee(b); }
    updateHandlingFee(id, b) { return this.svc.updateHandlingFee(id, b); }
    deleteHandlingFee(id) { return this.svc.deleteHandlingFee(id); }
};
exports.CargoSettingsController = CargoSettingsController;
__decorate([
    (0, common_1.Get)('shc-charges'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "getShcCharges", null);
__decorate([
    (0, common_1.Post)('shc-charges'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "createShcCharge", null);
__decorate([
    (0, common_1.Put)('shc-charges/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "updateShcCharge", null);
__decorate([
    (0, common_1.Delete)('shc-charges/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "deleteShcCharge", null);
__decorate([
    (0, common_1.Get)('freight-rates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "getFreightRates", null);
__decorate([
    (0, common_1.Post)('freight-rates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "createFreightRate", null);
__decorate([
    (0, common_1.Put)('freight-rates/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "updateFreightRate", null);
__decorate([
    (0, common_1.Delete)('freight-rates/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "deleteFreightRate", null);
__decorate([
    (0, common_1.Get)('handling-fees'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "getHandlingFees", null);
__decorate([
    (0, common_1.Post)('handling-fees'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "createHandlingFee", null);
__decorate([
    (0, common_1.Put)('handling-fees/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "updateHandlingFee", null);
__decorate([
    (0, common_1.Delete)('handling-fees/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CargoSettingsController.prototype, "deleteHandlingFee", null);
exports.CargoSettingsController = CargoSettingsController = __decorate([
    (0, common_1.Controller)('admin/cargo-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cargo_settings_service_1.CargoSettingsService])
], CargoSettingsController);
//# sourceMappingURL=cargo-settings.controller.js.map