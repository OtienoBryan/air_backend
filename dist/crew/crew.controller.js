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
exports.CrewController = void 0;
const common_1 = require("@nestjs/common");
const crew_service_1 = require("./crew.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_crew_dto_1 = require("./dto/create-crew.dto");
const update_crew_dto_1 = require("./dto/update-crew.dto");
let CrewController = class CrewController {
    crewService;
    constructor(crewService) {
        this.crewService = crewService;
    }
    async findAll(page = 1, limit = 50) {
        console.log('👨‍✈️ [CrewController] GET /admin/crew', { page, limit });
        return this.crewService.findAll(page, limit);
    }
    async findOne(id) {
        console.log(`👨‍✈️ [CrewController] GET /admin/crew/${id}`);
        return this.crewService.findOne(id);
    }
    async create(createCrewDto) {
        console.log('👨‍✈️ [CrewController] POST /admin/crew');
        console.log('👨‍✈️ [CrewController] Create crew data:', JSON.stringify(createCrewDto, null, 2));
        try {
            const result = await this.crewService.create(createCrewDto);
            console.log('✅ [CrewController] Crew member created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [CrewController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateCrewDto) {
        console.log(`👨‍✈️ [CrewController] PUT /admin/crew/${id}`);
        console.log('👨‍✈️ [CrewController] Update crew data:', updateCrewDto);
        return this.crewService.update(id, updateCrewDto);
    }
    async remove(id) {
        console.log(`👨‍✈️ [CrewController] DELETE /admin/crew/${id}`);
        await this.crewService.remove(id);
        return { message: 'Crew member deleted successfully' };
    }
};
exports.CrewController = CrewController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CrewController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CrewController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_crew_dto_1.CreateCrewDto]),
    __metadata("design:returntype", Promise)
], CrewController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_crew_dto_1.UpdateCrewDto]),
    __metadata("design:returntype", Promise)
], CrewController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CrewController.prototype, "remove", null);
exports.CrewController = CrewController = __decorate([
    (0, common_1.Controller)('admin/crew'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [crew_service_1.CrewService])
], CrewController);
//# sourceMappingURL=crew.controller.js.map