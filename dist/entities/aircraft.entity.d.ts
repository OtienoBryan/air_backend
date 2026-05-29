import { Category } from './category.entity';
import { Staff } from './staff.entity';
export declare class Aircraft {
    id: number;
    name: string;
    registration: string;
    capacity: number;
    max_cargo_weight: number;
    category_id: number;
    category?: Category;
    created_by: number;
    createdByStaff?: Staff;
    status: string;
    calendar_color: string;
    created_at: Date;
    updated_at: Date;
}
