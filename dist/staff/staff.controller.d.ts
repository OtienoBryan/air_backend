import { StaffService, StaffStats } from './staff.service';
import { Staff } from '../entities/staff.entity';
import { Department } from '../entities/department.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class StaffController {
    private readonly staffService;
    private readonly cloudinaryService;
    constructor(staffService: StaffService, cloudinaryService: CloudinaryService);
    findAll(): Promise<Staff[]>;
    getStats(): Promise<StaffStats>;
    search(searchTerm: string): Promise<Staff[]>;
    getDepartments(): Promise<Department[]>;
    getDepartmentById(id: number): Promise<Department>;
    findByDepartment(department: string): Promise<Staff[]>;
    findByRole(role: string): Promise<Staff[]>;
    findByEmploymentType(employmentType: string): Promise<Staff[]>;
    findOne(id: number): Promise<Staff>;
    create(createStaffDto: Partial<Staff>): Promise<Staff>;
    update(id: number, updateStaffDto: Partial<Staff>): Promise<Staff>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        public_id: string;
    }>;
    uploadImageBase64(body: {
        image: string;
    }): Promise<{
        url: string;
        public_id: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    createDepartment(createDepartmentDto: Partial<Department>): Promise<Department>;
    updateDepartment(id: number, updateDepartmentDto: Partial<Department>): Promise<Department>;
    deleteDepartment(id: number): Promise<{
        message: string;
    }>;
}
