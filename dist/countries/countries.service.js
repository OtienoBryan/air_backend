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
const country_tax_entity_1 = require("../entities/country-tax.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
let CountriesService = class CountriesService {
    countryRepository;
    countryTaxRepository;
    chartOfAccountRepository;
    cache = new Map();
    CACHE_TTL = 10 * 60 * 1000;
    constructor(countryRepository, countryTaxRepository, chartOfAccountRepository) {
        this.countryRepository = countryRepository;
        this.countryTaxRepository = countryTaxRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
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
        const country = await this.countryRepository.findOne({ where: { name, status: 1 } });
        return country;
    }
    async findAllAdmin() {
        return this.countryRepository.find({ order: { name: 'ASC' } });
    }
    async create(data) {
        const country = this.countryRepository.create(data);
        const saved = await this.countryRepository.save(country);
        this.cache.delete('all_countries');
        return saved;
    }
    async update(id, data) {
        await this.countryRepository.update(id, data);
        this.cache.delete('all_countries');
        this.cache.delete(`country_${id}`);
        return this.countryRepository.findOne({ where: { id } });
    }
    async remove(id) {
        await this.countryRepository.delete(id);
        this.cache.delete('all_countries');
        this.cache.delete(`country_${id}`);
    }
    async getTaxes(countryId) {
        return this.countryTaxRepository.find({
            where: { country_id: countryId },
            relations: ['account'],
            order: { id: 'ASC' },
        });
    }
    async addTax(countryId, data) {
        const country = await this.countryRepository.findOne({ where: { id: countryId } });
        if (!country)
            throw new common_1.NotFoundException('Country not found');
        const account = await this.chartOfAccountRepository.findOne({ where: { id: data.account_id } });
        if (!account)
            throw new common_1.NotFoundException('Account not found');
        const tax = this.countryTaxRepository.create({ country_id: countryId, account_id: data.account_id, amount: data.amount, currency: data.currency });
        const saved = await this.countryTaxRepository.save(tax);
        return this.countryTaxRepository.findOne({ where: { id: saved.id }, relations: ['account'] });
    }
    async updateTax(countryId, taxId, data) {
        const tax = await this.countryTaxRepository.findOne({ where: { id: taxId, country_id: countryId } });
        if (!tax)
            throw new common_1.NotFoundException('Tax not found');
        await this.countryTaxRepository.update(taxId, data);
        return this.countryTaxRepository.findOne({ where: { id: taxId }, relations: ['account'] });
    }
    async removeTax(countryId, taxId) {
        const tax = await this.countryTaxRepository.findOne({ where: { id: taxId, country_id: countryId } });
        if (!tax)
            throw new common_1.NotFoundException('Tax not found');
        await this.countryTaxRepository.delete(taxId);
    }
    async getTaxAccounts() {
        return this.chartOfAccountRepository.find({ where: { account_type: 16 }, order: { name: 'ASC' } });
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(country_tax_entity_1.CountryTax)),
    __param(2, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CountriesService);
//# sourceMappingURL=countries.service.js.map