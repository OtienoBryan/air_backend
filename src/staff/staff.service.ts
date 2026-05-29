import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find({
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { id } });
  }

  async create(createStaffDto: Partial<Staff>): Promise<Staff> {
    const staff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(staff);
  }

  async update(id: number, updateStaffDto: Partial<Staff>): Promise<Staff> {
    await this.staffRepository.update(id, updateStaffDto);
    const updatedStaff = await this.findOne(id);
    if (!updatedStaff) {
      throw new Error('Staff member not found');
    }
    return updatedStaff;
  }

  async remove(id: number): Promise<void> {
    const result = await this.staffRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Staff member not found');
    }
  }

  async getStaffStats(): Promise<StaffStats> {
    const allStaff = await this.staffRepository.find();
    
    const stats: StaffStats = {
      total: allStaff.length,
      active: allStaff.filter(staff => staff.is_active === 1).length,
      inactive: allStaff.filter(staff => staff.is_active === 0).length,
      byDepartment: {},
      byRole: {},
      byGender: {},
      byEmploymentType: {}
    };

    // Count by department
    allStaff.forEach(staff => {
      const dept = staff.department || 'Unknown';
      stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
    });

    // Count by role
    allStaff.forEach(staff => {
      const role = staff.role || 'Unknown';
      stats.byRole[role] = (stats.byRole[role] || 0) + 1;
    });

    // Count by gender
    allStaff.forEach(staff => {
      const gender = staff.gender || 'Unknown';
      stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
    });

    // Count by employment type
    allStaff.forEach(staff => {
      const empType = staff.employment_type || 'Unknown';
      stats.byEmploymentType[empType] = (stats.byEmploymentType[empType] || 0) + 1;
    });

    return stats;
  }

  async findByDepartment(department: string): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { department },
      order: { name: 'ASC' }
    });
  }

  async findByRole(role: string): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { role },
      order: { name: 'ASC' }
    });
  }

  async findByEmploymentType(employmentType: string): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { employment_type: employmentType },
      order: { name: 'ASC' }
    });
  }

  async searchStaff(searchTerm: string): Promise<Staff[]> {
    return this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('staff.empl_no LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('staff.role LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('staff.department LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('staff.name', 'ASC')
      .getMany();
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({
      order: { name: 'ASC' }
    });
  }

  async getDepartmentById(id: number): Promise<Department | null> {
    return this.departmentRepository.findOne({ where: { id } });
  }

  async createDepartment(createDepartmentDto: Partial<Department>): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  async updateDepartment(id: number, updateDepartmentDto: Partial<Department>): Promise<Department> {
    await this.departmentRepository.update(id, updateDepartmentDto);
    const updatedDepartment = await this.getDepartmentById(id);
    if (!updatedDepartment) {
      throw new Error('Department not found');
    }
    return updatedDepartment;
  }

  async deleteDepartment(id: number): Promise<void> {
    const result = await this.departmentRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Department not found');
    }
  }
}
