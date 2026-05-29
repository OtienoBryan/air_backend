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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const staff_service_1 = require("./staff.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let StaffController = class StaffController {
    staffService;
    cloudinaryService;
    constructor(staffService, cloudinaryService) {
        this.staffService = staffService;
        this.cloudinaryService = cloudinaryService;
    }
    async findAll() {
        return this.staffService.findAll();
    }
    async getStats() {
        return this.staffService.getStaffStats();
    }
    async search(searchTerm) {
        if (!searchTerm) {
            return this.staffService.findAll();
        }
        return this.staffService.searchStaff(searchTerm);
    }
    async getDepartments() {
        return this.staffService.getDepartments();
    }
    async getDepartmentById(id) {
        const department = await this.staffService.getDepartmentById(id);
        if (!department) {
            throw new Error('Department not found');
        }
        return department;
    }
    async findByDepartment(department) {
        return this.staffService.findByDepartment(department);
    }
    async findByRole(role) {
        return this.staffService.findByRole(role);
    }
    async findByEmploymentType(employmentType) {
        return this.staffService.findByEmploymentType(employmentType);
    }
    async findOne(id) {
        const staff = await this.staffService.findOne(id);
        if (!staff) {
            throw new Error('Staff member not found');
        }
        return staff;
    }
    async create(createStaffDto) {
        return this.staffService.create(createStaffDto);
    }
    async update(id, updateStaffDto) {
        return this.staffService.update(id, updateStaffDto);
    }
    async uploadImage(file) {
        if (!file) {
            throw new Error('No image file provided');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new Error('File must be an image');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image size must be less than 5MB');
        }
        return this.cloudinaryService.uploadImage(file, 'staff');
    }
    async uploadImageBase64(body) {
        if (!body.image) {
            throw new Error('No image data provided');
        }
        return this.cloudinaryService.uploadFromBase64(body.image, 'staff');
    }
    async remove(id) {
        await this.staffService.remove(id);
        return { message: 'Staff member deleted successfully' };
    }
    async createDepartment(createDepartmentDto) {
        return this.staffService.createDepartment(createDepartmentDto);
    }
    async updateDepartment(id, updateDepartmentDto) {
        return this.staffService.updateDepartment(id, updateDepartmentDto);
    }
    async deleteDepartment(id) {
        await this.staffService.deleteDepartment(id);
        return { message: 'Department deleted successfully' };
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('departments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('departments/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getDepartmentById", null);
__decorate([
    (0, common_1.Get)('department/:department'),
    __param(0, (0, common_1.Param)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findByDepartment", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)('employment-type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findByEmploymentType", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('upload-image-base64'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "uploadImageBase64", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('departments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Put)('departments/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)('departments/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "deleteDepartment", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService,
        cloudinary_service_1.CloudinaryService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map