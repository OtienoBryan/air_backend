import { Flight } from './flight.entity';
import { ExceptionType } from './exception-type.entity';
export declare class FlightException {
    id: number;
    flight_id: number;
    flight?: Flight;
    exception_type: number;
    exceptionType?: ExceptionType;
    reason: string | null;
    old_value: string | null;
    new_value: string | null;
    created_by: string | null;
    created_at: Date;
}
