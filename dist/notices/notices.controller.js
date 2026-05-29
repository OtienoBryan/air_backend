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
exports.NoticesController = void 0;
const common_1 = require("@nestjs/common");
const notices_service_1 = require("./notices.service");
const create_notice_dto_1 = require("./dto/create-notice.dto");
const update_notice_dto_1 = require("./dto/update-notice.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NoticesController = class NoticesController {
    noticesService;
    constructor(noticesService) {
        this.noticesService = noticesService;
    }
    async create(createNoticeDto) {
        console.log('🔍 [NoticesController] Creating notice:', createNoticeDto);
        return this.noticesService.create(createNoticeDto);
    }
    async findAll(countryId, status, limit, offset) {
        console.log('🔍 [NoticesController] Finding notices:', { countryId, status, limit, offset });
        const noticeLimit = limit ? Math.min(limit, 100) : 50;
        const noticeOffset = offset || 0;
        return this.noticesService.findAll(countryId, status, noticeLimit, noticeOffset);
    }
    async getActiveNotices(countryId, limit) {
        console.log('🔍 [NoticesController] Getting active notices:', { countryId, limit });
        const noticeLimit = limit ? Math.min(limit, 20) : 10;
        return this.noticesService.getActiveNotices(countryId, noticeLimit);
    }
    async getStats() {
        console.log('🔍 [NoticesController] Getting notice statistics');
        return this.noticesService.getNoticeStats();
    }
    async findOne(id) {
        console.log('🔍 [NoticesController] Finding notice by ID:', id);
        return this.noticesService.findOne(id);
    }
    async update(id, updateNoticeDto) {
        console.log('🔍 [NoticesController] Updating notice:', id, updateNoticeDto);
        return this.noticesService.update(id, updateNoticeDto);
    }
    async toggleStatus(id) {
        console.log('🔍 [NoticesController] Toggling notice status:', id);
        return this.noticesService.toggleStatus(id);
    }
    async remove(id) {
        console.log('🔍 [NoticesController] Deleting notice:', id);
        await this.noticesService.remove(id);
        return { success: true, message: 'Notice deleted successfully' };
    }
};
exports.NoticesController = NoticesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notice_dto_1.CreateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('countryId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Query)('countryId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "getActiveNotices", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_notice_dto_1.UpdateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "remove", null);
exports.NoticesController = NoticesController = __decorate([
    (0, common_1.Controller)('notices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notices_service_1.NoticesService])
], NoticesController);
//# sourceMappingURL=notices.controller.js.map