export declare class CreateCargoBookingDto {
    awb_number: string;
    flight_series_id?: number | null;
    origin: string;
    destination: string;
    shipper_name: string;
    shipper_phone?: string;
    shipper_address?: string;
    consignee_name: string;
    consignee_phone?: string;
    consignee_address?: string;
    commodity: string;
    special_handling_codes?: string;
    pieces: number;
    gross_weight_kg: number;
    chargeable_weight_kg: number;
    volume_cbm?: number;
    currency?: string;
    payment_term?: string;
    rate_per_kg?: number;
    total_charges?: number;
    booking_date: string;
    status?: string;
    remarks?: string;
}
