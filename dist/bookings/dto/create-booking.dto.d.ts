export declare class PassengerDto {
    name: string;
    email?: string;
    contact?: string;
    nationality?: string;
    id_type?: string;
    identification?: string;
    age?: number;
    date_of_birth?: string | null;
    title?: string;
    passenger_type: string;
    ticket_number?: string;
    fare_amount?: number;
}
export declare class CreateBookingDto {
    flight_series_id: number;
    passengers: PassengerDto[];
    seat_reservation_id?: number;
    is_return_trip?: boolean;
    travel_date?: string | null;
    return_date?: string | null;
    return_flight_series_id?: number | null;
    flight_id?: number | null;
    return_flight_id?: number | null;
    departure_id?: number | null;
    destination_id?: number | null;
    payment_method: string;
    payment_status?: string;
    override_total_amount?: number;
    booking_date: string;
    notes?: string;
    payment_reference?: string | null;
    payment_account?: string | null;
    agency_id?: number | null;
    account_id?: number | null;
    deduct_from_account?: boolean;
    payment_account_id?: number | null;
}
