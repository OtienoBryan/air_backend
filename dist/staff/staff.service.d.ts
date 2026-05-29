import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { Department } from '../entities/department.entity';
export interface StaffStats {
    total: number;
    active: number;
    inactive: number;
    byDepartment: Record<string, number>;
    byRole: Record<string, number>;
    byGender: Record<string, number>;
    byEmploymentType: Record<string, number>;
}
export declare class StaffService {
    private staffRepository;
    private departmentRepository;
    constructor(staffRepository: Repository<Staff>, departmentRepository: Repository<Department>);
    findAll(): Promise<Staff[]>;
    findOne(id: number): Promise<Staff | null>;
    create(createStaffDto: Partial<Staff>): Promise<Staff>;
    update(id: number, updateStaffDto: Partial<Staff>): Promise<Staff>;
    remove(id: number): Promise<void>;
    getStaffStats(): Promise<StaffStats>;
    findByDepartment(department: string): Promise<Staff[]>;
    findByRole(role: string): Promise<Staff[]>;
    findByEmploymentType(employmentType: string): Promise<Staff[]>;
    searchStaff(searchTerm: string): Promise<Staff[]>;
    getDepartments(): Promise<Department[]>;
    getDepartmentById(id: number): Promise<Department | null>;
    createDepartment(createDepartmentDto: Partial<Department>): Promise<Department>;
    updateDepartment(id: number, updateDepartmentDto: Partial<Department>): Promise<Department>;
    deleteDepartment(id: number): Promise<void>;
}
