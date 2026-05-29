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
exports.SalesRepsController = void 0;
const common_1 = require("@nestjs/common");
const sales_reps_service_1 = require("./sales-reps.service");
let SalesRepsController = class SalesRepsController {
    salesRepsService;
    constructor(salesRepsService) {
        this.salesRepsService = salesRepsService;
    }
    async findAll() {
        return this.salesRepsService.findAll();
    }
    async getStats() {
        return this.salesRepsService.getSalesRepStats();
    }
    async getCountries() {
        return this.salesRepsService.getCountries();
    }
    async getRegions(countryId) {
        const countryIdNum = countryId ? parseInt(countryId) : undefined;
        return this.salesRepsService.getRegions(countryIdNum);
    }
    async getRoutes(regionId) {
        const regionIdNum = regionId ? parseInt(regionId) : undefined;
        return this.salesRepsService.getRoutes(regionIdNum);
    }
    async findOne(id) {
        const salesRep = await this.salesRepsService.findOne(id);
        if (!salesRep) {
            throw new Error('Sales representative not found');
        }
        return salesRep;
    }
    async create(salesRepData) {
        return this.salesRepsService.create(salesRepData);
    }
    async update(id, salesRepData) {
        return this.salesRepsService.update(id, salesRepData);
    }
    async remove(id) {
        await this.salesRepsService.remove(id);
        return { message: 'Sales representative deleted successfully' };
    }
};
exports.SalesRepsController = SalesRepsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('countries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "getCountries", null);
__decorate([
    (0, common_1.Get)('regions'),
    __param(0, (0, common_1.Query)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "getRegions", null);
__decorate([
    (0, common_1.Get)('routes'),
    __param(0, (0, common_1.Query)('regionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "getRoutes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesRepsController.prototype, "remove", null);
exports.SalesRepsController = SalesRepsController = __decorate([
    (0, common_1.Controller)('sales-reps'),
    __metadata("design:paramtypes", [sales_reps_service_1.SalesRepsService])
], SalesRepsController);
//# sourceMappingURL=sales-reps.controller.js.map