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
exports.FlightRoutesController = void 0;
const common_1 = require("@nestjs/common");
const flight_routes_service_1 = require("./flight-routes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FlightRoutesController = class FlightRoutesController {
    flightRoutesService;
    constructor(flightRoutesService) {
        this.flightRoutesService = flightRoutesService;
    }
    findAll() {
        return this.flightRoutesService.findAll();
    }
    findOne(id) {
        return this.flightRoutesService.findOne(id);
    }
    create(body) {
        return this.flightRoutesService.create(body);
    }
    update(id, body) {
        return this.flightRoutesService.update(id, body);
    }
    getFareHistory(id) {
        return this.flightRoutesService.getFareHistory(id);
    }
    remove(id) {
        return this.flightRoutesService.remove(id);
    }
};
exports.FlightRoutesController = FlightRoutesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FlightRoutesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FlightRoutesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FlightRoutesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FlightRoutesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/fare-history'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FlightRoutesController.prototype, "getFareHistory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FlightRoutesController.prototype, "remove", null);
exports.FlightRoutesController = FlightRoutesController = __decorate([
    (0, common_1.Controller)('admin/flight-routes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [flight_routes_service_1.FlightRoutesService])
], FlightRoutesController);
//# sourceMappingURL=flight-routes.controller.js.map