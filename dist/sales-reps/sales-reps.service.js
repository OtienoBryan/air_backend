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
exports.SalesRepsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const country_entity_1 = require("../entities/country.entity");
const region_entity_1 = require("../entities/region.entity");
const route_entity_1 = require("../entities/route.entity");
let SalesRepsService = class SalesRepsService {
    salesRepRepository;
    countryRepository;
    regionRepository;
    routeRepository;
    constructor(salesRepRepository, countryRepository, regionRepository, routeRepository) {
        this.salesRepRepository = salesRepRepository;
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
        this.routeRepository = routeRepository;
    }
    async findAll() {
        return this.salesRepRepository.find({
            select: [
                'id',
                'name',
                'email',
                'phoneNumber',
                'countryId',
                'country',
                'region_id',
                'region',
                'route_id',
                'route',
                'route_id_update',
                'route_name_update',
                'visits_targets',
                'new_clients',
                'vapes_targets',
                'pouches_targets',
                'role',
                'manager_type',
                'status',
                'createdAt'
            ]
        });
    }
    async findOne(id) {
        return this.salesRepRepository.findOne({
            where: { id },
            select: [
                'id',
                'name',
                'email',
                'phoneNumber',
                'countryId',
                'country',
                'region_id',
                'region',
                'route_id',
                'route',
                'route_id_update',
                'route_name_update',
                'visits_targets',
                'new_clients',
                'vapes_targets',
                'pouches_targets',
                'role',
                'manager_type',
                'status',
                'createdAt'
            ]
        });
    }
    async create(salesRepData) {
        const salesRep = this.salesRepRepository.create(salesRepData);
        return this.salesRepRepository.save(salesRep);
    }
    async update(id, salesRepData) {
        await this.salesRepRepository.update(id, salesRepData);
        const updatedSalesRep = await this.findOne(id);
        if (!updatedSalesRep) {
            throw new Error('Sales representative not found');
        }
        return updatedSalesRep;
    }
    async remove(id) {
        await this.salesRepRepository.delete(id);
    }
    async getSalesRepStats() {
        const salesReps = await this.findAll();
        const total = salesReps.length;
        const active = salesReps.filter(rep => rep.status === 1).length;
        const inactive = total - active;
        const byCountry = salesReps.reduce((acc, rep) => {
            acc[rep.country] = (acc[rep.country] || 0) + 1;
            return acc;
        }, {});
        const byRegion = salesReps.reduce((acc, rep) => {
            acc[rep.region] = (acc[rep.region] || 0) + 1;
            return acc;
        }, {});
        return {
            total,
            active,
            inactive,
            byCountry,
            byRegion
        };
    }
    async getCountries() {
        try {
            console.log('🌍 [SalesRepsService] Fetching countries...');
            const allCountries = await this.countryRepository.find();
            console.log('🌍 [SalesRepsService] All countries found:', allCountries);
            const activeCountries = await this.countryRepository.find({
                where: { status: 1 },
                select: ['id', 'name', 'status']
            });
            if (activeCountries.length === 0) {
                console.log('⚠️ [SalesRepsService] No active countries found, fetching all countries');
                const allCountriesForSelect = await this.countryRepository.find({
                    select: ['id', 'name', 'status']
                });
                console.log('🌍 [SalesRepsService] All countries for selection:', allCountriesForSelect);
                return allCountriesForSelect;
            }
            console.log('🌍 [SalesRepsService] Active countries found:', activeCountries);
            return activeCountries;
        }
        catch (error) {
            console.error('❌ [SalesRepsService] Error fetching countries:', error);
            throw error;
        }
    }
    async getRegions(countryId) {
        try {
            console.log('🌍 [SalesRepsService] Fetching regions...', { countryId });
            const whereCondition = countryId ? { countryId, status: 1 } : { status: 1 };
            const regions = await this.regionRepository.find({
                where: whereCondition,
                select: ['id', 'name', 'countryId', 'status']
            });
            console.log('🌍 [SalesRepsService] Regions found:', regions);
            if (regions.length === 0) {
                console.log('⚠️ [SalesRepsService] No active regions found, fetching all regions');
                const allRegions = await this.regionRepository.find({
                    select: ['id', 'name', 'countryId', 'status']
                });
                console.log('🌍 [SalesRepsService] All regions:', allRegions);
                return allRegions;
            }
            return regions;
        }
        catch (error) {
            console.error('❌ [SalesRepsService] Error fetching regions:', error);
            throw error;
        }
    }
    async getRoutes(regionId) {
        try {
            console.log('🛣️ [SalesRepsService] Fetching routes...', { regionId });
            const whereCondition = regionId ? { region: regionId, status: 1 } : { status: 1 };
            const routes = await this.routeRepository.find({
                where: whereCondition,
                select: ['id', 'name', 'region', 'region_name', 'country_id', 'country_name', 'status']
            });
            console.log('🛣️ [SalesRepsService] Routes found:', routes);
            if (routes.length === 0) {
                console.log('⚠️ [SalesRepsService] No active routes found, fetching all routes');
                const allRoutes = await this.routeRepository.find({
                    select: ['id', 'name', 'region', 'region_name', 'country_id', 'country_name', 'status']
                });
                console.log('🛣️ [SalesRepsService] All routes:', allRoutes);
                return allRoutes;
            }
            return routes;
        }
        catch (error) {
            console.error('❌ [SalesRepsService] Error fetching routes:', error);
            throw error;
        }
    }
};
exports.SalesRepsService = SalesRepsService;
exports.SalesRepsService = SalesRepsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_rep_entity_1.SalesRep)),
    __param(1, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(2, (0, typeorm_1.InjectRepository)(region_entity_1.Region)),
    __param(3, (0, typeorm_1.InjectRepository)(route_entity_1.Route)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SalesRepsService);
//# sourceMappingURL=sales-reps.service.js.map