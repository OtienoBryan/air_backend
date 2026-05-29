import { FlightSeries } from './flight-series.entity';
import { Crew } from './crew.entity';
export declare class FlightCrew {
    id: number;
    flight_series_id: number;
    flightSeries?: FlightSeries;
    crew_id: number;
    crew?: Crew;
    created_at: Date;
}
