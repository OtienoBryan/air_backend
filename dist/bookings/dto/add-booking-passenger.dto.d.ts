export declare class AddBookingPassengerDto {
    name: string;
    email?: string;
    contact?: string;
    nationality?: string;
    id_type?: string;
    identification?: string;
    age?: number;
    title?: string;
    passenger_type: 'child' | 'infant';
    guardian_passenger_id?: number;
}
