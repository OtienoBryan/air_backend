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
exports.FlightRoutesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_route_entity_1 = require("../entities/flight-route.entity");
const fare_history_entity_1 = require("../entities/fare-history.entity");
let FlightRoutesService = class FlightRoutesService {
    routeRepository;
    fareHistoryRepository;
    constructor(routeRepository, fareHistoryRepository) {
        this.routeRepository = routeRepository;
        this.fareHistoryRepository = fareHistoryRepository;
    }
    async findAll() {
        return this.routeRepository.find({
            relations: ['fromDestination', 'toDestination', 'viaDestination'],
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const route = await this.routeRepository.findOne({
            where: { id },
            relations: ['fromDestination', 'toDestination', 'viaDestination'],
        });
        if (!route)
            throw new common_1.NotFoundException(`Route #${id} not found`);
        return route;
    }
    async create(data) {
        const route = this.routeRepository.create(data);
        const saved = await this.routeRepository.save(route);
        return this.findOne(saved.id);
    }
    async update(id, data) {
        const existing = await this.findOne(id);
        const fareKeys = ['adult_fare', 'child_fare', 'infant_fare', 'adult_return_fare', 'child_return_fare', 'infant_return_fare', 'fare_valid_from', 'fare_valid_to'];
        const fareChanging = fareKeys.some(k => k in data && data[k] !== existing[k]);
        if (fareChanging) {
            await this.fareHistoryRepository.save(this.fareHistoryRepository.create({
                route_id: id,
                adult_fare: existing.adult_fare,
                child_fare: existing.child_fare,
                infant_fare: existing.infant_fare,
                adult_return_fare: existing.adult_return_fare,
                child_return_fare: existing.child_return_fare,
                infant_return_fare: existing.infant_return_fare,
                fare_valid_from: existing.fare_valid_from,
                fare_valid_to: existing.fare_valid_to,
            }));
        }
        await this.routeRepository.update(id, {
            ...data,
            fromDestination: undefined,
            toDestination: undefined,
            viaDestination: undefined,
        });
        return this.findOne(id);
    }
    async getFareHistory(routeId) {
        return this.fareHistoryRepository.find({
            where: { route_id: routeId },
            order: { changed_at: 'DESC' },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.routeRepository.delete(id);
        return { message: 'Route deleted successfully' };
    }
};
exports.FlightRoutesService = FlightRoutesService;
exports.FlightRoutesService = FlightRoutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flight_route_entity_1.FlightRoute)),
    __param(1, (0, typeorm_1.InjectRepository)(fare_history_entity_1.FareHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FlightRoutesService);
//# sourceMappingURL=flight-routes.service.js.map