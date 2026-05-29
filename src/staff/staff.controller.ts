import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StaffService, StaffStats } from './staff.service';
import { Staff } from '../entities/staff.entity';
import { Department } from '../entities/department.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get()
  async findAll(): Promise<Staff[]> {
    return this.staffService.findAll();
  }

  @Get('stats')
  async getStats(): Promise<StaffStats> {
    return this.staffService.getStaffStats();
  }

  @Get('search')
  async search(@Query('q') searchTerm: string): Promise<Staff[]> {
    if (!searchTerm) {
      return this.staffService.findAll();
    }
    return this.staffService.searchStaff(searchTerm);
  }

  @Get('departments')
  async getDepartments(): Promise<Department[]> {
    return this.staffService.getDepartments();
  }

  @Get('departments/:id')
  async getDepartmentById(@Param('id', ParseIntPipe) id: number): Promise<Department> {
    const department = await this.staffService.getDepartmentById(id);
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  }

  @Get('department/:department')
  async findByDepartment(@Param('department') department: string): Promise<Staff[]> {
    return this.staffService.findByDepartment(department);
  }

  @Get('role/:role')
  async findByRole(@Param('role') role: string): Promise<Staff[]> {
    return this.staffService.findByRole(role);
  }

  @Get('employment-type/:type')
  async findByEmploymentType(@Param('type') employmentType: string): Promise<Staff[]> {
    return this.staffService.findByEmploymentType(employmentType);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Staff> {
    const staff = await this.staffService.findOne(id);
    if (!staff) {
      throw new Error('Staff member not found');
    }
    return staff;
  }

  @Post()
  async create(@Body() createStaffDto: Partial<Staff>): Promise<Staff> {
    return this.staffService.create(createStaffDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStaffDto: Partial<Staff>
  ): Promise<Staff> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    if (!file) {
      throw new Error('No image file provided');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    return this.cloudinaryService.uploadImage(file, 'staff');
  }

  @Post('upload-image-base64')
  async uploadImageBase64(@Body() body: { image: string }): Promise<{ url: string; public_id: string }> {
    if (!body.image) {
      throw new Error('No image data provided');
    }

    return this.cloudinaryService.uploadFromBase64(body.image, 'staff');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.staffService.remove(id);
    return { message: 'Staff member deleted successfully' };
  }

  @Post('departments')
  async createDepartment(@Body() createDepartmentDto: Partial<Department>): Promise<Department> {
    return this.staffService.createDepartment(createDepartmentDto);
  }

  @Put('departments/:id')
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: Partial<Department>
  ): Promise<Department> {
    return this.staffService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete('departments/:id')
  async deleteDepartment(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.staffService.deleteDepartment(id);
    return { message: 'Department deleted successfully' };
  }
}
