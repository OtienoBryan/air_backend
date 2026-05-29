export declare class UpdateFlightSeriesDto {
    flt?: string;
    aircraft_id?: number;
    flight_type?: string;
    start_date?: string;
    end_date?: string;
    std?: string;
    sta?: string;
    number_of_seats?: number;
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
}
