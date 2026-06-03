import { Repository } from 'typeorm';
import { Flight } from '../entities/flight.entity';
import { FlightException } from '../entities/flight-exception.entity';
import { ExceptionType } from '../entities/exception-type.entity';
import { PassengerDisruption } from '../entities/passenger-disruption.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
export declare class FlightsController {
    private readonly flightRepository;
    private readonly exceptionRepository;
    private readonly exceptionTypeRepository;
    private readonly disruptionRepository;
    private readonly bookingPassengerRepository;
    constructor(flightRepository: Repository<Flight>, exceptionRepository: Repository<FlightException>, exceptionTypeRepository: Repository<ExceptionType>, disruptionRepository: Repository<PassengerDisruption>, bookingPassengerRepository: Repository<BookingPassenger>);
    findAll(page?: number, limit?: number, from?: string, to?: string, search?: string, status?: string, seriesId?: number): Promise<{
        flights: {
            booked_count: number;
            available_seats: number | null;
            id: number;
            series_id: number;
            series?: import("../entities").FlightSeries;
            aircraft_id: number | null;
            aircraft?: import("../entities").Aircraft | null;
            aircraft_capacity: number | null;
            flight_no: string;
            flight_date: string;
            std: string | null;
            sta: string | null;
            status: string;
            is_extra: boolean;
            notes: string | null;
            created_at: Date;
            updated_at: Date;
        }[];
        total: number;
    }>;
    update(id: number, body: Partial<Pick<Flight, 'std' | 'sta' | 'status' | 'notes'>>): Promise<Flight>;
    addExtraFlight(flightId: number, body: {
        aircraft_id: number;
        notes?: string;
    }): Promise<Flight>;
    getPassengers(id: number): Promise<{
        id: number;
        booking_id: number;
        booking_reference: any;
        payment_status: any;
        passenger_type: string;
        fare_amount: number;
        travel_date: string | null;
        leg: string;
        ticket_status: "OPEN" | "USED" | "VOID" | "REFUNDED" | null;
        ticket_number: string | null;
        passenger: {
            id: number;
            pnr: string;
            name: string;
            title: any;
            email: string | null;
            contact: string | null;
            nationality: string | null;
            id_type: string | null;
            identification: string | null;
        } | null;
    }[]>;
    getExceptions(id: number): Promise<FlightException[]>;
    addException(flightId: number, body: {
        exception_type: number;
        reason?: string;
        old_value?: string;
        new_value?: string;
        created_by?: string;
        action_taken?: string;
    }): Promise<FlightException | null>;
    getExceptionTypes(): Promise<ExceptionType[]>;
}
