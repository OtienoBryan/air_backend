import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { Payroll } from '../entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<{ payroll: Payroll[], total: number }> {
    return this.payrollService.findAll(page, limit);
  }

  @Post()
  async create(@Body() createPayrollDto: CreatePayrollDto, @Request() req): Promise<Payroll> {
    console.log('💼 [PayrollController] POST /admin/payroll');
    console.log('💼 [PayrollController] Create payroll data:', JSON.stringify(createPayrollDto, null, 2));
    console.log('💼 [PayrollController] User ID:', req.user?.sub);
    try {
      const createdBy = req.user?.sub ? Number(req.user.sub) : null;
      const result = await this.payrollService.create(createPayrollDto, createdBy);
      console.log('✅ [PayrollController] Payroll created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [PayrollController] Error in create:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payroll> {
    return this.payrollService.findOne(id);
  }
}
