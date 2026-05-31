export declare class CreateFlightSeriesDto {
    flt: string;
    aircraft_id?: number;
    flight_type: string;
    start_date: string;
    end_date: string;
    std?: string;
    sta?: string;
    number_of_seats?: number;
    is_recurring?: boolean;
    days_of_week?: string | null;
    recurring_schedule?: string | null;
    from_destination_id?: number;
    from_terminal?: string;
    to_terminal?: string;
    via_destination_id?: number;
    via_std?: string;
    via_sta?: string;
    to_destination_id?: number;
    adult_fare?: number | null;
    child_fare?: number | null;
    infant_fare?: number | null;
    adult_return_fare?: number | null;
    child_return_fare?: number | null;
    infant_return_fare?: number | null;
}
