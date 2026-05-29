export declare class CreatePayrollDto {
    staff_id: number;
    payroll_account_id: number;
    amount: number;
    payroll_date: string;
    description: string;
    reference: string;
    payment_method?: string;
    is_paid?: boolean;
}
