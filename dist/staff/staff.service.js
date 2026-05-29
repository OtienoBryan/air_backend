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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("../entities/staff.entity");
const department_entity_1 = require("../entities/department.entity");
let StaffService = class StaffService {
    staffRepository;
    departmentRepository;
    constructor(staffRepository, departmentRepository) {
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
    }
    async findAll() {
        return this.staffRepository.find({
            order: {
                created_at: 'DESC'
            }
        });
    }
    async findOne(id) {
        return this.staffRepository.findOne({ where: { id } });
    }
    async create(createStaffDto) {
        const staff = this.staffRepository.create(createStaffDto);
        return this.staffRepository.save(staff);
    }
    async update(id, updateStaffDto) {
        await this.staffRepository.update(id, updateStaffDto);
        const updatedStaff = await this.findOne(id);
        if (!updatedStaff) {
            throw new Error('Staff member not found');
        }
        return updatedStaff;
    }
    async remove(id) {
        const result = await this.staffRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Staff member not found');
        }
    }
    async getStaffStats() {
        const allStaff = await this.staffRepository.find();
        const stats = {
            total: allStaff.length,
            active: allStaff.filter(staff => staff.is_active === 1).length,
            inactive: allStaff.filter(staff => staff.is_active === 0).length,
            byDepartment: {},
            byRole: {},
            byGender: {},
            byEmploymentType: {}
        };
        allStaff.forEach(staff => {
            const dept = staff.department || 'Unknown';
            stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
        });
        allStaff.forEach(staff => {
            const role = staff.role || 'Unknown';
            stats.byRole[role] = (stats.byRole[role] || 0) + 1;
        });
        allStaff.forEach(staff => {
            const gender = staff.gender || 'Unknown';
            stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
        });
        allStaff.forEach(staff => {
            const empType = staff.employment_type || 'Unknown';
            stats.byEmploymentType[empType] = (stats.byEmploymentType[empType] || 0) + 1;
        });
        return stats;
    }
    async findByDepartment(department) {
        return this.staffRepository.find({
            where: { department },
            order: { name: 'ASC' }
        });
    }
    async findByRole(role) {
        return this.staffRepository.find({
            where: { role },
            order: { name: 'ASC' }
        });
    }
    async findByEmploymentType(employmentType) {
        return this.staffRepository.find({
            where: { employment_type: employmentType },
            order: { name: 'ASC' }
        });
    }
    async searchStaff(searchTerm) {
        return this.staffRepository
            .createQueryBuilder('staff')
            .where('staff.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
            .orWhere('staff.empl_no LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
            .orWhere('staff.role LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
            .orWhere('staff.department LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
            .orderBy('staff.name', 'ASC')
            .getMany();
    }
    async getDepartments() {
        return this.departmentRepository.find({
            order: { name: 'ASC' }
        });
    }
    async getDepartmentById(id) {
        return this.departmentRepository.findOne({ where: { id } });
    }
    async createDepartment(createDepartmentDto) {
        const department = this.departmentRepository.create(createDepartmentDto);
        return this.departmentRepository.save(department);
    }
    async updateDepartment(id, updateDepartmentDto) {
        await this.departmentRepository.update(id, updateDepartmentDto);
        const updatedDepartment = await this.getDepartmentById(id);
        if (!updatedDepartment) {
            throw new Error('Department not found');
        }
        return updatedDepartment;
    }
    async deleteDepartment(id) {
        const result = await this.departmentRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Department not found');
        }
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StaffService);
//# sourceMappingURL=staff.service.js.map