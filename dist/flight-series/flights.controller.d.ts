import { Repository } from 'typeorm';
import { Flight } from '../entities/flight.entity';
import { FlightException } from '../entities/flight-exception.entity';
import { ExceptionType } from '../entities/exception-type.entity';
import { PassengerDisruption } from '../entities/passenger-disruption.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { CrewAssignment } from '../entities/crew-assignment.entity';
import { Crew } from '../entities/crew.entity';
export declare class FlightsController {
    private readonly flightRepository;
    private readonly exceptionRepository;
    private readonly exceptionTypeRepository;
    private readonly disruptionRepository;
    private readonly bookingPassengerRepository;
    private readonly crewAssignmentRepository;
    private readonly crewRepository;
    constructor(flightRepository: Repository<Flight>, exceptionRepository: Repository<FlightException>, exceptionTypeRepository: Repository<ExceptionType>, disruptionRepository: Repository<PassengerDisruption>, bookingPassengerRepository: Repository<BookingPassenger>, crewAssignmentRepository: Repository<CrewAssignment>, crewRepository: Repository<Crew>);
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
    update(id: number, body: Partial<Pick<Flight, 'flight_no' | 'flight_date' | 'std' | 'sta' | 'status' | 'notes'>>): Promise<Flight>;
    addExtraFlight(flightId: number, body: {
        aircraft_id: number;
        notes?: string;
    }): Promise<Flight>;
    getPassengers(id: number): Promise<{
        id: number;
        booking_id: number;
        booking_reference: any;
        booking_date: string | null;
        payment_status: any;
        passenger_type: string;
        fare_amount: number;
        travel_date: string | null;
        leg: string;
        status: string | null;
        checked_in_at: Date | null;
        boarded_at: Date | null;
        checkin_by: number | null;
        ticket_status: "OPEN" | "USED" | "VOID" | "REFUNDED" | "RESCHEDULED" | null;
        ticket_number: string | null;
        refund_amount: number | null;
        reschedule_fee: number | null;
        cancellation_reason: string | null;
        cancelled_at: Date | null;
        rescheduled_to_id: number | null;
        flight: {
            id: number;
            flight_no: string;
            flight_date: string | null;
            std: string | null;
            sta: string | null;
            status: string;
            aircraft: import("../entities").Aircraft | null;
            series: {
                id: number;
                flt: string;
                std: string | null;
                sta: string | null;
                fromDestination: import("../entities").Destination | null;
                toDestination: import("../entities").Destination | null;
                viaDestination: import("../entities").Destination | null;
            } | null;
        } | null;
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
            booking_status: any;
            guardian_passenger_id: any;
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
    getCrewAssignments(id: number): Promise<CrewAssignment[]>;
    assignCrew(id: number, body: {
        crew_id: number;
        role?: string;
        notes?: string;
    }): Promise<CrewAssignment | null>;
    removeCrewAssignment(flightId: number, assignmentId: number): Promise<{
        message: string;
    }>;
    getAllCrew(): Promise<Crew[]>;
    getExceptionTypes(): Promise<ExceptionType[]>;
}
