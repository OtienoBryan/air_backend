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
exports.CargoSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cargo_shc_charge_entity_1 = require("../entities/cargo-shc-charge.entity");
const cargo_freight_rate_entity_1 = require("../entities/cargo-freight-rate.entity");
const cargo_handling_fee_entity_1 = require("../entities/cargo-handling-fee.entity");
let CargoSettingsService = class CargoSettingsService {
    shcRepo;
    rateRepo;
    feeRepo;
    constructor(shcRepo, rateRepo, feeRepo) {
        this.shcRepo = shcRepo;
        this.rateRepo = rateRepo;
        this.feeRepo = feeRepo;
    }
    getShcCharges() { return this.shcRepo.find({ order: { code: 'ASC' } }); }
    createShcCharge(data) { return this.shcRepo.save(this.shcRepo.create(data)); }
    async updateShcCharge(id, data) { await this.shcRepo.update(id, data); return this.shcRepo.findOne({ where: { id } }); }
    deleteShcCharge(id) { return this.shcRepo.delete(id); }
    getFreightRates() { return this.rateRepo.find({ order: { origin: 'ASC', min_weight_kg: 'ASC' } }); }
    createFreightRate(data) { return this.rateRepo.save(this.rateRepo.create(data)); }
    async updateFreightRate(id, data) { await this.rateRepo.update(id, data); return this.rateRepo.findOne({ where: { id } }); }
    deleteFreightRate(id) { return this.rateRepo.delete(id); }
    getHandlingFees() { return this.feeRepo.find({ order: { name: 'ASC' } }); }
    createHandlingFee(data) { return this.feeRepo.save(this.feeRepo.create(data)); }
    async updateHandlingFee(id, data) { await this.feeRepo.update(id, data); return this.feeRepo.findOne({ where: { id } }); }
    deleteHandlingFee(id) { return this.feeRepo.delete(id); }
};
exports.CargoSettingsService = CargoSettingsService;
exports.CargoSettingsService = CargoSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cargo_shc_charge_entity_1.CargoShcCharge)),
    __param(1, (0, typeorm_1.InjectRepository)(cargo_freight_rate_entity_1.CargoFreightRate)),
    __param(2, (0, typeorm_1.InjectRepository)(cargo_handling_fee_entity_1.CargoHandlingFee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CargoSettingsService);
//# sourceMappingURL=cargo-settings.service.js.map