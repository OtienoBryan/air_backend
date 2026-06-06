import { ExpenseCategory } from './expense-category.entity';
export declare class ExpenseType {
    id: number;
    name: string;
    category_id: number | null;
    category?: ExpenseCategory | null;
    description: string | null;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}
