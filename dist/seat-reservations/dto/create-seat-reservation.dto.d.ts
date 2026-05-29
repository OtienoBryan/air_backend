export declare class CreateSeatReservationDto {
    flight_series_id: number;
    number_of_seats: number;
    passenger_id?: number;
    passenger_name: string;
    passenger_email?: string;
    passenger_phone?: string;
    status?: string;
    reservation_date: string;
    notes?: string;
    agent_id?: number | null;
}
