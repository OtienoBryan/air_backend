import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Destination } from '../entities/destination.entity';
import { FlightCrew } from '../entities/flight-crew.entity';
import { Crew } from '../entities/crew.entity';
import { CreateFlightSeriesDto } from './dto/create-flight-series.dto';
import { UpdateFlightSeriesDto } from './dto/update-flight-series.dto';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

@Injectable()
export class FlightSeriesService {
  constructor(
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(Aircraft)
    private aircraftRepository: Repository<Aircraft>,
    @InjectRepository(FlightCrew)
    private flightCrewRepository: Repository<FlightCrew>,
    @InjectRepository(Crew)
    private crewRepository: Repository<Crew>,
  ) {}

  // Convert a Date object or date string safely to "YYYY-MM-DD"
  private toDateStr(d: Date | string): string {
    if (d instanceof Date) return d.toISOString().slice(0, 10)
    // Handle MySQL "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss.sssZ"
    return String(d).slice(0, 10)
  }

  // Generate individual flight instances for a series
  async generateFlightInstances(series: FlightSeries): Promise<number> {
    const start = new Date(this.toDateStr(series.start_date) + 'T12:00:00Z')
    const end   = new Date(this.toDateStr(series.end_date)   + 'T12:00:00Z')
    console.log(`✈️ [generateFlightInstances] series=${series.id} flt=${series.flt} start=${this.toDateStr(series.start_date)} end=${this.toDateStr(series.end_date)} recurring=${series.is_recurring} days=${series.days_of_week}`)

    const allowedDays: Set<string> = series.is_recurring && series.days_of_week
      ? new Set(series.days_of_week.split(',').map(d => d.trim()))
      : new Set(DAY_NAMES) // non-recurring: every day

    const instances: Partial<Flight>[] = []
    const cur = new Date(start)
    while (cur <= end) {
      const dayName = DAY_NAMES[cur.getUTCDay()]
      if (allowedDays.has(dayName)) {
        const dateStr = cur.toISOString().slice(0, 10)
        instances.push({
          series_id:        series.id,
          aircraft_id:      series.aircraft_id ?? null,
          aircraft_capacity: (series as any).aircraft?.capacity ?? null,
          flight_no:        series.flt,
          flight_date:      dateStr,
          std:              series.std ?? null,
          sta:              series.sta ?? null,
          status:           'scheduled',
        })
      }
      cur.setUTCDate(cur.getUTCDate() + 1)
    }

    if (instances.length > 0) {
      // Save in batches of 200 — TypeORM save() handles null values cleanly
      const batchSize = 200
      for (let i = 0; i < instances.length; i += batchSize) {
        const entities = instances.slice(i, i + batchSize).map(d => this.flightRepository.create(d))
        await this.flightRepository.save(entities)
      }
      console.log(`✅ [FlightSeriesService] Generated ${instances.length} flight instances for series ${series.id} (${series.flt})`)
    }
    return instances.length
  }

  async findAll(page: number = 1, limit: number = 50): Promise<{ flightSeries: FlightSeries[], total: number }> {
    console.log('✈️ [FlightSeriesService] Finding all flight series');
    
    const [flightSeries, total] = await this.flightSeriesRepository.findAndCount({
      relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew'],
      order: { start_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [FlightSeriesService] Found ${flightSeries.length} flight series`);
    return { flightSeries, total };
  }

  async findOne(id: number): Promise<FlightSeries> {
    console.log(`✈️ [FlightSeriesService] Finding flight series by ID: ${id}`);
    
    const flightSeries = await this.flightSeriesRepository.findOne({
      where: { id },
      relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew']
    });
    
    if (!flightSeries) {
      console.log(`❌ [FlightSeriesService] Flight series with ID ${id} not found`);
      throw new NotFoundException(`Flight series with ID ${id} not found`);
    }
    
    console.log(`✅ [FlightSeriesService] Flight series found: ${flightSeries.flt}`);
    return flightSeries;
  }

  async create(createFlightSeriesDto: CreateFlightSeriesDto): Promise<FlightSeries> {
    console.log('✈️ [FlightSeriesService] Creating new flight series:', createFlightSeriesDto.flt);
    console.log('✈️ [FlightSeriesService] DTO data:', JSON.stringify(createFlightSeriesDto, null, 2));
    
    try {
      const flightSeries = this.flightSeriesRepository.create({
        flt: createFlightSeriesDto.flt!,
        aircraft_id: createFlightSeriesDto.aircraft_id ?? null,
        flight_type: createFlightSeriesDto.flight_type!,
        start_date: new Date(createFlightSeriesDto.start_date!),
        end_date: new Date(createFlightSeriesDto.end_date!),
        std: createFlightSeriesDto.std ?? null,
        sta: createFlightSeriesDto.sta ?? null,
        number_of_seats: createFlightSeriesDto.number_of_seats ?? null,
        is_recurring: createFlightSeriesDto.is_recurring ?? false,
        days_of_week: createFlightSeriesDto.days_of_week ?? null,
        recurring_schedule: createFlightSeriesDto.recurring_schedule ?? null,
        from_destination_id: createFlightSeriesDto.from_destination_id ?? null,
        from_terminal: createFlightSeriesDto.from_terminal ?? null,
        to_terminal: createFlightSeriesDto.to_terminal ?? null,
        via_destination_id: createFlightSeriesDto.via_destination_id ?? null,
        via_std: createFlightSeriesDto.via_std ?? null,
        via_sta: createFlightSeriesDto.via_sta ?? null,
        to_destination_id: createFlightSeriesDto.to_destination_id ?? null,
        adult_fare: createFlightSeriesDto.adult_fare ?? null,
        child_fare: createFlightSeriesDto.child_fare ?? null,
        infant_fare: createFlightSeriesDto.infant_fare ?? null,
        adult_return_fare: createFlightSeriesDto.adult_return_fare ?? null,
        child_return_fare: createFlightSeriesDto.child_return_fare ?? null,
        infant_return_fare: createFlightSeriesDto.infant_return_fare ?? null,
      });
      
      const savedFlightSeries = await this.flightSeriesRepository.save(flightSeries);
      console.log(`✅ [FlightSeriesService] Flight series created with ID: ${savedFlightSeries.id}`);

      // Reload with all relations — this gives us clean date strings from MySQL
      const flightSeriesWithRelations = await this.flightSeriesRepository.findOne({
        where: { id: savedFlightSeries.id },
        relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew']
      });

      // Generate flight instances using the reloaded entity so dates are proper strings
      const seriesForGen = flightSeriesWithRelations ?? savedFlightSeries
      const count = await this.generateFlightInstances(seriesForGen)
      console.log(`✅ [FlightSeriesService] Created ${count} flight instances for series ${savedFlightSeries.id}`)

      if (flightSeriesWithRelations) {
        return flightSeriesWithRelations;
      }
      return savedFlightSeries;
    } catch (error) {
      console.error('❌ [FlightSeriesService] Error creating flight series:', error);
      throw error;
    }
  }

  async update(id: number, updateFlightSeriesDto: UpdateFlightSeriesDto): Promise<FlightSeries> {
    console.log(`✈️ [FlightSeriesService] Updating flight series ID: ${id}`);
    console.log(`✈️ [FlightSeriesService] Update DTO received:`, JSON.stringify(updateFlightSeriesDto, null, 2));
    
    const flightSeries = await this.findOne(id);
    console.log(`✈️ [FlightSeriesService] Current flight series before update:`, {
      id: flightSeries.id,
      flt: flightSeries.flt,
      aircraft_id: flightSeries.aircraft_id
    });
    
    // Handle fields explicitly
    if (updateFlightSeriesDto.flt !== undefined) flightSeries.flt = updateFlightSeriesDto.flt;
    if (updateFlightSeriesDto.aircraft_id !== undefined) flightSeries.aircraft_id = updateFlightSeriesDto.aircraft_id;
    if (updateFlightSeriesDto.flight_type !== undefined) flightSeries.flight_type = updateFlightSeriesDto.flight_type;
    if (updateFlightSeriesDto.start_date !== undefined) flightSeries.start_date = new Date(updateFlightSeriesDto.start_date);
    if (updateFlightSeriesDto.end_date !== undefined) flightSeries.end_date = new Date(updateFlightSeriesDto.end_date);
    if (updateFlightSeriesDto.std !== undefined) flightSeries.std = updateFlightSeriesDto.std ?? null;
    if (updateFlightSeriesDto.sta !== undefined) flightSeries.sta = updateFlightSeriesDto.sta ?? null;
    if (updateFlightSeriesDto.number_of_seats !== undefined) flightSeries.number_of_seats = updateFlightSeriesDto.number_of_seats ?? null;
    if (updateFlightSeriesDto.is_recurring !== undefined) flightSeries.is_recurring = updateFlightSeriesDto.is_recurring ?? false;
    if (updateFlightSeriesDto.days_of_week !== undefined) flightSeries.days_of_week = updateFlightSeriesDto.days_of_week ?? null;
    if (updateFlightSeriesDto.recurring_schedule !== undefined) flightSeries.recurring_schedule = updateFlightSeriesDto.recurring_schedule ?? null;
    if (updateFlightSeriesDto.from_destination_id !== undefined) flightSeries.from_destination_id = updateFlightSeriesDto.from_destination_id ?? null;
    if (updateFlightSeriesDto.from_terminal !== undefined) flightSeries.from_terminal = updateFlightSeriesDto.from_terminal ?? null;
    if (updateFlightSeriesDto.to_terminal !== undefined) flightSeries.to_terminal = updateFlightSeriesDto.to_terminal ?? null;
    if (updateFlightSeriesDto.via_destination_id !== undefined) flightSeries.via_destination_id = updateFlightSeriesDto.via_destination_id ?? null;
    if (updateFlightSeriesDto.via_std !== undefined) flightSeries.via_std = updateFlightSeriesDto.via_std ?? null;
    if (updateFlightSeriesDto.via_sta !== undefined) flightSeries.via_sta = updateFlightSeriesDto.via_sta ?? null;
    if (updateFlightSeriesDto.to_destination_id !== undefined) flightSeries.to_destination_id = updateFlightSeriesDto.to_destination_id ?? null;
    
    // Handle fare prices - explicitly check for undefined to allow null values
    if ('adult_fare' in updateFlightSeriesDto) {
      flightSeries.adult_fare = updateFlightSeriesDto.adult_fare ?? null;
      console.log(`✈️ [FlightSeriesService] Setting adult_fare:`, updateFlightSeriesDto.adult_fare);
    }
    if ('child_fare' in updateFlightSeriesDto) {
      flightSeries.child_fare = updateFlightSeriesDto.child_fare ?? null;
      console.log(`✈️ [FlightSeriesService] Setting child_fare:`, updateFlightSeriesDto.child_fare);
    }
    if ('infant_fare' in updateFlightSeriesDto) {
      flightSeries.infant_fare = updateFlightSeriesDto.infant_fare ?? null;
      console.log(`✈️ [FlightSeriesService] Setting infant_fare:`, updateFlightSeriesDto.infant_fare);
    }
    if (updateFlightSeriesDto.adult_return_fare !== undefined) flightSeries.adult_return_fare = updateFlightSeriesDto.adult_return_fare ?? null;
    if (updateFlightSeriesDto.child_return_fare !== undefined) flightSeries.child_return_fare = updateFlightSeriesDto.child_return_fare ?? null;
    if (updateFlightSeriesDto.infant_return_fare !== undefined) flightSeries.infant_return_fare = updateFlightSeriesDto.infant_return_fare ?? null;
    
    console.log(`✈️ [FlightSeriesService] Flight series object before save:`, {
      id: flightSeries.id,
      flt: flightSeries.flt,
      aircraft_id: flightSeries.aircraft_id,
      adult_fare: flightSeries.adult_fare,
      child_fare: flightSeries.child_fare,
      infant_fare: flightSeries.infant_fare
    });
    
    const updatedFlightSeries = await this.flightSeriesRepository.save(flightSeries);
    console.log(`✅ [FlightSeriesService] Flight series updated: ${updatedFlightSeries.flt}`);
    console.log(`✅ [FlightSeriesService] Updated flight series aircraft_id:`, updatedFlightSeries.aircraft_id);
    console.log(`✅ [FlightSeriesService] Updated fare prices:`, {
      adult_fare: updatedFlightSeries.adult_fare,
      child_fare: updatedFlightSeries.child_fare,
      infant_fare: updatedFlightSeries.infant_fare
    });
    
    // Reload with all relations
    const flightSeriesWithRelations = await this.flightSeriesRepository.findOne({
      where: { id: updatedFlightSeries.id },
      relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew']
    });
    
    if (flightSeriesWithRelations) {
      return flightSeriesWithRelations;
    }
    return updatedFlightSeries;
  }

  async remove(id: number): Promise<void> {
    console.log(`✈️ [FlightSeriesService] Deleting flight series ID: ${id}`);
    
    const flightSeries = await this.findOne(id);
    await this.flightSeriesRepository.remove(flightSeries);
    
    console.log(`✅ [FlightSeriesService] Flight series deleted: ${flightSeries.flt}`);
  }

  async assignCrew(flightSeriesId: number, crewId: number): Promise<FlightCrew> {
    console.log(`✈️ [FlightSeriesService] Assigning crew ${crewId} to flight series ${flightSeriesId}`);
    
    // Verify flight series exists
    const flightSeries = await this.findOne(flightSeriesId);
    
    // Verify crew exists
    const crew = await this.crewRepository.findOne({ where: { id: crewId } });
    if (!crew) {
      throw new NotFoundException(`Crew with ID ${crewId} not found`);
    }
    
    // Check if assignment already exists
    const existingAssignment = await this.flightCrewRepository.findOne({
      where: { flight_series_id: flightSeriesId, crew_id: crewId }
    });
    
    if (existingAssignment) {
      console.log(`⚠️ [FlightSeriesService] Crew ${crewId} already assigned to flight series ${flightSeriesId}`);
      return existingAssignment;
    }
    
    // Create new assignment
    const flightCrew = this.flightCrewRepository.create({
      flight_series_id: flightSeriesId,
      crew_id: crewId
    });
    
    const savedFlightCrew = await this.flightCrewRepository.save(flightCrew);
    console.log(`✅ [FlightSeriesService] Crew assigned successfully`);
    return savedFlightCrew;
  }

  async removeCrew(flightSeriesId: number, crewId: number): Promise<void> {
    console.log(`✈️ [FlightSeriesService] Removing crew ${crewId} from flight series ${flightSeriesId}`);
    
    const flightCrew = await this.flightCrewRepository.findOne({
      where: { flight_series_id: flightSeriesId, crew_id: crewId }
    });
    
    if (!flightCrew) {
      throw new NotFoundException(`Crew assignment not found`);
    }
    
    await this.flightCrewRepository.remove(flightCrew);
    console.log(`✅ [FlightSeriesService] Crew removed successfully`);
  }

  async getCrewAssignments(flightSeriesId: number): Promise<FlightCrew[]> {
    console.log(`✈️ [FlightSeriesService] Getting crew assignments for flight series ${flightSeriesId}`);

    const flightCrew = await this.flightCrewRepository.find({
      where: { flight_series_id: flightSeriesId },
      relations: ['crew']
    });

    return flightCrew;
  }

  // Return individual flight instances for a series, optionally filtered by date range
  async getFlightInstances(seriesId: number, from?: string, to?: string): Promise<Flight[]> {
    const qb = this.flightRepository
      .createQueryBuilder('f')
      .where('f.series_id = :seriesId', { seriesId })
      .orderBy('f.flight_date', 'ASC')
    if (from) qb.andWhere('f.flight_date >= :from', { from })
    if (to)   qb.andWhere('f.flight_date <= :to',   { to })
    return qb.getMany()
  }

  // Delete existing instances and re-generate (use after editing a series)
  async regenerateFlightInstances(seriesId: number): Promise<number> {
    const series = await this.findOne(seriesId) // findOne returns dates as MySQL strings
    const deleted = await this.flightRepository.delete({ series_id: seriesId })
    console.log(`🗑️ [FlightSeriesService] Deleted ${(deleted.affected ?? 0)} existing instances for series ${seriesId}`)
    return this.generateFlightInstances(series)
  }
}

