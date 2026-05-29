export declare class CreateExpenseDto {
    expense_account_id: number;
    amount: number;
    expense_date: string;
    description: string;
    payment_method?: string;
    reference: string;
    is_paid?: boolean;
    supplier_id?: number;
}
