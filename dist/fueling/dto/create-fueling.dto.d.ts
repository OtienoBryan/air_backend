export declare class CreateFuelingDto {
    flight_series_id: number;
    supplier_id: number;
    fuel_quantity: number;
    fuel_slip_number: string;
    price_per_liter: number;
    location: string;
    additional_fees?: number;
    additional_fees_explanation?: string;
    tax?: number;
    fueling_date: string;
}
