import { Flight } from './flight.entity';
import { Crew } from './crew.entity';
export declare class CrewAssignment {
    id: number;
    flight_id: number;
    flight?: Flight;
    crew_id: number;
    crew?: Crew;
    role: string | null;
    notes: string | null;
    created_at: Date;
}
