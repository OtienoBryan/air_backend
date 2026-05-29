export declare class PassengerDto {
    name: string;
    email?: string;
    contact?: string;
    nationality?: string;
    identification?: string;
    age?: number;
    title?: string;
    passenger_type: string;
}
export declare class CreateBookingDto {
    flight_series_id: number;
    passengers: PassengerDto[];
    seat_reservation_id?: number;
    payment_method: string;
    payment_status?: string;
    booking_date: string;
    notes?: string;
    agency_id?: number | null;
    account_id?: number | null;
    deduct_from_account?: boolean;
    payment_account_id?: number | null;
}
