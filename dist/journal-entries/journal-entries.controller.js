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
exports.JournalEntriesController = void 0;
const common_1 = require("@nestjs/common");
const journal_entries_service_1 = require("./journal-entries.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let JournalEntriesController = class JournalEntriesController {
    journalEntriesService;
    constructor(journalEntriesService) {
        this.journalEntriesService = journalEntriesService;
    }
    async findAll(page = 1, limit = 15, startDate, endDate, accountId, reference, description) {
        console.log('📝 [JournalEntriesController] GET /admin/journal-entries');
        console.log('📝 [JournalEntriesController] Query params:', { page, limit, startDate, endDate, accountId, reference, description });
        const accountIdNum = accountId ? parseInt(accountId, 10) : undefined;
        try {
            return await this.journalEntriesService.findAll(page, limit, startDate, endDate, accountIdNum, reference, description);
        }
        catch (error) {
            console.error('❌ [JournalEntriesController] Error:', error);
            throw error;
        }
    }
};
exports.JournalEntriesController = JournalEntriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(15), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('start_date')),
    __param(3, (0, common_1.Query)('end_date')),
    __param(4, (0, common_1.Query)('account_id')),
    __param(5, (0, common_1.Query)('reference')),
    __param(6, (0, common_1.Query)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], JournalEntriesController.prototype, "findAll", null);
exports.JournalEntriesController = JournalEntriesController = __decorate([
    (0, common_1.Controller)('admin/journal-entries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [journal_entries_service_1.JournalEntriesService])
], JournalEntriesController);
//# sourceMappingURL=journal-entries.controller.js.map