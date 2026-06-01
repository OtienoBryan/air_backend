export declare class CargoFreightRate {
    id: number;
    origin: string | null;
    destination: string | null;
    min_weight_kg: number;
    max_weight_kg: number | null;
    rate_per_kg: number;
    currency: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
