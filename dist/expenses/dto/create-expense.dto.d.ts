export declare class CreateExpenseDto {
    expense_account_id: number;
    amount: number;
    expense_date: string;
    description: string;
    payment_method?: string;
    reference: string;
    is_paid?: boolean;
    supplier_id?: number;
    expense_type_id?: number | null;
    linked_to?: string | null;
    route_id?: number | null;
    aircraft_id?: number | null;
    flight_id?: number | null;
    cost_center?: string | null;
}
