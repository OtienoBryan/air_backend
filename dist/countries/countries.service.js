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
exports.CountriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("../entities/country.entity");
let CountriesService = class CountriesService {
    countryRepository;
    cache = new Map();
    CACHE_TTL = 10 * 60 * 1000;
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        if (cached) {
            this.cache.delete(key);
        }
        return null;
    }
    setCache(key, data, ttl = this.CACHE_TTL) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl
        });
    }
    async findAll() {
        console.log('🌍 [CountriesService] Finding all countries');
        const cacheKey = 'all_countries';
        const cachedCountries = this.getFromCache(cacheKey);
        if (cachedCountries) {
            console.log('🌍 [CountriesService] Returning cached countries:', cachedCountries.length);
            return cachedCountries;
        }
        const countries = await this.countryRepository
            .createQueryBuilder('country')
            .where('country.status = :status', { status: 1 })
            .orderBy('country.name', 'ASC')
            .getMany();
        this.setCache(cacheKey, countries, 600000);
        console.log('🌍 [CountriesService] Countries found:', countries.length);
        return countries;
    }
    async findOne(id) {
        console.log('🌍 [CountriesService] Finding country by ID:', id);
        const cacheKey = `country_${id}`;
        const cachedCountry = this.getFromCache(cacheKey);
        if (cachedCountry) {
            console.log('🌍 [CountriesService] Returning cached country');
            return cachedCountry;
        }
        const country = await this.countryRepository.findOne({
            where: { id, status: 1 }
        });
        if (country) {
            this.setCache(cacheKey, country, 600000);
        }
        console.log('🌍 [CountriesService] Country found:', country ? 'Yes' : 'No');
        return country;
    }
    async findByName(name) {
        console.log('🌍 [CountriesService] Finding country by name:', name);
        const country = await this.countryRepository.findOne({
            where: { name: name, status: 1 }
        });
        console.log('🌍 [CountriesService] Country found by name:', country ? 'Yes' : 'No');
        return country;
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CountriesService);
//# sourceMappingURL=countries.service.js.map