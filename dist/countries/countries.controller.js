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
exports.AdminCountriesController = exports.CountriesController = void 0;
const common_1 = require("@nestjs/common");
const countries_service_1 = require("./countries.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CountriesController = class CountriesController {
    countriesService;
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    async findAll() {
        return this.countriesService.findAll();
    }
    async findOne(id) {
        return this.countriesService.findOne(id);
    }
    async findByName(name) {
        return this.countriesService.findByName(name);
    }
};
exports.CountriesController = CountriesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findByName", null);
exports.CountriesController = CountriesController = __decorate([
    (0, common_1.Controller)('countries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [countries_service_1.CountriesService])
], CountriesController);
let AdminCountriesController = class AdminCountriesController {
    countriesService;
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    async findAll() {
        return this.countriesService.findAllAdmin();
    }
    async create(body) {
        return this.countriesService.create(body);
    }
    async update(id, body) {
        return this.countriesService.update(id, body);
    }
    async remove(id) {
        await this.countriesService.remove(id);
        return { message: 'Country deleted successfully' };
    }
    async getTaxAccounts() {
        return this.countriesService.getTaxAccounts();
    }
    async getTaxes(id) {
        return this.countriesService.getTaxes(id);
    }
    async addTax(id, body) {
        return this.countriesService.addTax(id, body);
    }
    async updateTax(id, taxId, body) {
        return this.countriesService.updateTax(id, taxId, body);
    }
    async removeTax(id, taxId) {
        await this.countriesService.removeTax(id, taxId);
        return { message: 'Tax removed successfully' };
    }
};
exports.AdminCountriesController = AdminCountriesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('tax-accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "getTaxAccounts", null);
__decorate([
    (0, common_1.Get)(':id/taxes'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "getTaxes", null);
__decorate([
    (0, common_1.Post)(':id/taxes'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "addTax", null);
__decorate([
    (0, common_1.Put)(':id/taxes/:taxId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('taxId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "updateTax", null);
__decorate([
    (0, common_1.Delete)(':id/taxes/:taxId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('taxId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminCountriesController.prototype, "removeTax", null);
exports.AdminCountriesController = AdminCountriesController = __decorate([
    (0, common_1.Controller)('admin/countries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [countries_service_1.CountriesService])
], AdminCountriesController);
//# sourceMappingURL=countries.controller.js.map