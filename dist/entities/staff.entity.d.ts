import { Department } from './department.entity';
export declare class Staff {
    id: number;
    name: string;
    photo_url: string;
    empl_no: string;
    id_no: string;
    role: string;
    designation: string;
    phone_number: string;
    password: string;
    department: string;
    department_id: number;
    department_relation?: Department;
    business_email: string;
    department_email: string;
    salary: number;
    employment_type: string;
    gender: 'Male' | 'Female' | 'Other';
    created_at: Date;
    updated_at: Date;
    is_active: number;
    avatar_url: string;
    status: number;
}
