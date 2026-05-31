export declare class CreateAgencyDto {
    name: string;
    contact?: string | null;
    city?: string | null;
    country?: string | null;
    booking_limit?: number | null;
    credit_limit?: number | null;
    max_pax_per_booking?: number | null;
    default_currency?: string | null;
    credit_days?: number | null;
    payment_limit?: number | null;
    balance?: number;
    commission_percentage?: number | null;
}
