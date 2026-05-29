import { PayrollService } from './payroll.service';
import { Payroll } from '../entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    findAll(page?: number, limit?: number): Promise<{
        payroll: Payroll[];
        total: number;
    }>;
    create(createPayrollDto: CreatePayrollDto, req: any): Promise<Payroll>;
    findOne(id: number): Promise<Payroll>;
}
