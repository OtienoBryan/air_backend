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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_routes_service_1 = require("./flight-routes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const flight_route_entity_1 = require("../entities/flight-route.entity");
const route_fare_charge_entity_1 = require("../entities/route-fare-charge.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const route_luggage_setting_entity_1 = require("../entities/route-luggage-setting.entity");
let FlightRoutesController = class FlightRoutesController {
    flightRoutesService;
    fareChargeRepository;
    chartOfAccountRepository;
    luggageRepository;
    flightRouteRepository;
    constructor(flightRoutesService, fareChargeRepository, chartOfAccountRepository, luggageRepository, flightRouteRepository) {
        this.flightRoutesService = flightRoutesService;
        this.fareChargeRepository = fareChargeRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.luggageRepository = luggageRepository;
        this.flightRouteRepository = flightRouteRepository;
    }
    findAll() {
        return this.flightRoutesService.findAll();
    }
    async getLuggageByDestinations(from, to) {
        const fromId = parseInt(from, 10);
        const toId = parseInt(to, 10);
        const route = await this.flightRouteRepository.findOne({
            where: { from_destination_id: fromId, to_destination_id: toId },
        });
        if (!route)
            return [];
        return this.luggageRepository.find({
            where: { route_id: route.id },
            order: { id: 'ASC' },
        });
    }
    async getFareAccounts() {
        return this.chartOfAccountRepository.find({
            where: { fare: 1 },
            order: { code: 'ASC' },
        });
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
    async getFareCharges(routeId) {
        return this.fareChargeRepository.find({
            where: { route_id: routeId },
            relations: ['account'],
            order: { id: 'ASC' },
        });
    }
    async addFareCharge(routeId, body) {
        const charge = this.fareChargeRepository.create({
            route_id: routeId,
            account_id: body.account_id,
            amount: body.amount,
            currency: body.currency ?? 'USD',
            label: body.label ?? null,
        });
        const saved = await this.fareChargeRepository.save(charge);
        return this.fareChargeRepository.findOne({ where: { id: saved.id }, relations: ['account'] });
    }
    async updateFareCharge(routeId, chargeId, body) {
        await this.fareChargeRepository.update({ id: chargeId, route_id: routeId }, {
            ...(body.account_id !== undefined && { account_id: body.account_id }),
            ...(body.amount !== undefined && { amount: body.amount }),
            ...(body.currency !== undefined && { currency: body.currency }),
            ...(body.label !== undefined && { label: body.label }),
        });
        return this.fareChargeRepository.findOne({ where: { id: chargeId }, relations: ['account'] });
    }
    async deleteFareCharge(routeId, chargeId) {
        await this.fareChargeRepository.delete({ id: chargeId, route_id: routeId });
        return { message: 'Deleted' };
    }
    async getLuggageSettings(routeId) {
        return this.luggageRepository.find({
            where: { route_id: routeId },
            order: { id: 'ASC' },
        });
    }
    async addLuggageSetting(routeId, body) {
        const setting = this.luggageRepository.create({
            route_id: routeId,
            type: body.type ?? 'Checked Baggage',
            weight_limit: body.weight_limit,
            extra_charge_per_kg: body.extra_charge_per_kg,
            currency: body.currency ?? 'USD',
        });
        return this.luggageRepository.save(setting);
    }
    async updateLuggageSetting(routeId, settingId, body) {
        await this.luggageRepository.update({ id: settingId, route_id: routeId }, {
            ...(body.type !== undefined && { type: body.type }),
            ...(body.weight_limit !== undefined && { weight_limit: body.weight_limit }),
            ...(body.extra_charge_per_kg !== undefined && { extra_charge_per_kg: body.extra_charge_per_kg }),
            ...(body.currency !== undefined && { currency: body.currency }),
        });
        return this.luggageRepository.findOne({ where: { id: settingId } });
    }
    async deleteLuggageSetting(routeId, settingId) {
        await this.luggageRepository.delete({ id: settingId, route_id: routeId });
        return { message: 'Deleted' };
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
    (0, common_1.Get)('luggage-by-destinations'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "getLuggageByDestinations", null);
__decorate([
    (0, common_1.Get)('fare-accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "getFareAccounts", null);
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
__decorate([
    (0, common_1.Get)(':id/fare-charges'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "getFareCharges", null);
__decorate([
    (0, common_1.Post)(':id/fare-charges'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "addFareCharge", null);
__decorate([
    (0, common_1.Put)(':id/fare-charges/:chargeId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('chargeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "updateFareCharge", null);
__decorate([
    (0, common_1.Delete)(':id/fare-charges/:chargeId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('chargeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "deleteFareCharge", null);
__decorate([
    (0, common_1.Get)(':id/luggage'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "getLuggageSettings", null);
__decorate([
    (0, common_1.Post)(':id/luggage'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "addLuggageSetting", null);
__decorate([
    (0, common_1.Put)(':id/luggage/:settingId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('settingId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "updateLuggageSetting", null);
__decorate([
    (0, common_1.Delete)(':id/luggage/:settingId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('settingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FlightRoutesController.prototype, "deleteLuggageSetting", null);
exports.FlightRoutesController = FlightRoutesController = __decorate([
    (0, common_1.Controller)('admin/flight-routes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(route_fare_charge_entity_1.RouteFareCharge)),
    __param(2, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __param(3, (0, typeorm_1.InjectRepository)(route_luggage_setting_entity_1.RouteLuggageSetting)),
    __param(4, (0, typeorm_1.InjectRepository)(flight_route_entity_1.FlightRoute)),
    __metadata("design:paramtypes", [flight_routes_service_1.FlightRoutesService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FlightRoutesController);
//# sourceMappingURL=flight-routes.controller.js.map