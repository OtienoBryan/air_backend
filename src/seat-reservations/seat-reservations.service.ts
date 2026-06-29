import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { Passenger } from '../entities/passenger.entity';
import { Agent } from '../entities/agent.entity';
import { Country } from '../entities/country.entity';
import { CreateSeatReservationDto } from './dto/create-seat-reservation.dto';
import { UpdateSeatReservationDto } from './dto/update-seat-reservation.dto';

@Injectable()
export class SeatReservationsService {
  constructor(
    @InjectRepository(SeatReservation)
    private seatReservationRepository: Repository<SeatReservation>,
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(page: number = 1, limit: number = 50, flightSeriesId?: number, agentId?: number, status?: string, staffId?: number): Promise<{ reservations: SeatReservation[], total: number }> {
    console.log('🎫 [SeatReservationsService] Finding all seat reservations');

    const queryBuilder = this.seatReservationRepository.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.flightSeries', 'flightSeries')
      .leftJoinAndSelect('flightSeries.fromDestination', 'fromDestination')
      .leftJoinAndSelect('flightSeries.toDestination', 'toDestination')
      .leftJoinAndSelect('flightSeries.viaDestination', 'viaDestination')
      .leftJoinAndSelect('reservation.passenger', 'passenger')
      .leftJoinAndSelect('reservation.agent', 'agent')
      .leftJoinAndSelect('agent.agency', 'agency')
      .leftJoinAndSelect('reservation.country', 'country')
      .leftJoinAndSelect('reservation.departure', 'departure')
      .leftJoinAndSelect('reservation.destination', 'destination')
      .where('1 = 1')
      .orderBy('reservation.id', 'DESC');

    if (flightSeriesId) {
      queryBuilder.andWhere('reservation.flight_series_id = :flightSeriesId', { flightSeriesId });
    }

    if (agentId) {
      queryBuilder.andWhere('reservation.agent_id = :agentId', { agentId });
    }

    if (status) {
      queryBuilder.andWhere('reservation.status = :status', { status });
    }

    if (staffId) {
      queryBuilder.andWhere('reservation.staff_id = :staffId', { staffId });
    }

    const [reservations, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    console.log(`✅ [SeatReservationsService] Found ${reservations.length} reservations`);
    return { reservations, total };
  }

  async findOne(id: number): Promise<SeatReservation> {
    console.log(`🎫 [SeatReservationsService] Finding reservation by ID: ${id}`);
    
    const reservation = await this.seatReservationRepository.findOne({
      where: { id },
      relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'flightSeries.viaDestination', 'passenger', 'agent', 'agent.agency', 'country', 'departure', 'destination']
    });
    
    if (!reservation) {
      console.log(`❌ [SeatReservationsService] Reservation with ID ${id} not found`);
      throw new NotFoundException(`Seat reservation with ID ${id} not found`);
    }
    
    console.log(`✅ [SeatReservationsService] Reservation found`);
    return reservation;
  }

  async findByFlightSeries(flightSeriesId: number): Promise<SeatReservation[]> {
    console.log(`🎫 [SeatReservationsService] Finding reservations for flight series: ${flightSeriesId}`);
    
    const reservations = await this.seatReservationRepository.find({
      where: { flight_series_id: flightSeriesId },
      relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'flightSeries.viaDestination', 'agent', 'agent.agency', 'departure', 'destination'],
      order: { booking_reference: 'ASC' }
    });
    
    console.log(`✅ [SeatReservationsService] Found ${reservations.length} reservations for flight series`);
    return reservations;
  }

  async create(createSeatReservationDto: CreateSeatReservationDto): Promise<SeatReservation> {
    console.log('🎫 [SeatReservationsService] Creating new seat reservation');
    
    // Get flight series with aircraft relation to check available seats
    const flightSeriesWithAircraft = await this.flightSeriesRepository.findOne({
      where: { id: createSeatReservationDto.flight_series_id },
      relations: ['aircraft']
    });
    
    if (!flightSeriesWithAircraft) {
      throw new NotFoundException(`Flight series with ID ${createSeatReservationDto.flight_series_id} not found`);
    }

    // Determine the maximum number of seats available for this flight
    // Priority: flight_series.number_of_seats > aircraft.capacity
    let maxSeats: number | null = null;
    if (flightSeriesWithAircraft.number_of_seats !== null && flightSeriesWithAircraft.number_of_seats !== undefined) {
      maxSeats = flightSeriesWithAircraft.number_of_seats;
    } else if (flightSeriesWithAircraft.aircraft && flightSeriesWithAircraft.aircraft.capacity !== null && flightSeriesWithAircraft.aircraft.capacity !== undefined) {
      maxSeats = flightSeriesWithAircraft.aircraft.capacity;
    }

    if (maxSeats === null || maxSeats === undefined) {
      throw new BadRequestException(`Flight series ${flightSeriesWithAircraft.flt} does not have a defined number of seats. Please set the number of seats in the flight series or ensure the aircraft has a capacity.`);
    }

    // Calculate total reserved seats for this flight (count all reservations except cancelled)
    const existingReservations = await this.seatReservationRepository.find({
      where: {
        flight_series_id: createSeatReservationDto.flight_series_id
      }
    });

    // Count all reservations except cancelled ones
    const totalReservedSeats = existingReservations
      .filter(res => res.status !== 'cancelled')
      .reduce((sum, res) => sum + (res.number_of_seats || 0), 0);
    const availableSeats = maxSeats - totalReservedSeats;

    if (createSeatReservationDto.number_of_seats > availableSeats) {
      throw new BadRequestException(
        `Not enough seats available for flight ${flightSeriesWithAircraft.flt}. ` +
        `Available: ${availableSeats} of ${maxSeats} total seats, ` +
        `Requested: ${createSeatReservationDto.number_of_seats}`
      );
    }

    // Handle passenger_id - if not provided, create a new passenger
    let passengerName = createSeatReservationDto.passenger_name;
    let passengerEmail = createSeatReservationDto.passenger_email ?? null;
    let passengerPhone = createSeatReservationDto.passenger_phone ?? null;
    let passengerId = createSeatReservationDto.passenger_id ?? null;

    if (passengerId) {
      // If passenger_id is provided, fetch passenger details to auto-populate
      const passenger = await this.passengerRepository.findOne({
        where: { id: passengerId }
      });
      
      if (!passenger) {
        throw new NotFoundException(`Passenger with ID ${passengerId} not found`);
      }
      
      // Auto-populate passenger details from passenger record
      passengerName = passenger.name;
      passengerEmail = passenger.email;
      passengerPhone = passenger.contact;
    }
    // No passenger_id provided — leave null; passenger will be created when reservation is confirmed

    // Generate booking reference (always auto-generated)
    const bookingReference = this.generateBookingReference();

    // Look up the specific flight record from the flights table
    let flightId: number | null = null
    if (createSeatReservationDto.reservation_date) {
      const dateStr = String(createSeatReservationDto.reservation_date).slice(0, 10)
      const matchingFlight = await this.flightRepository.findOne({
        where: {
          series_id:   createSeatReservationDto.flight_series_id,
          flight_date: dateStr as any,
        },
      })
      flightId = matchingFlight?.id ?? null
      console.log(`✈️ [SeatReservationsService] flight_id lookup: series=${createSeatReservationDto.flight_series_id} date=${dateStr} → flight_id=${flightId}`)
    }

    const reservation = this.seatReservationRepository.create({
      flight_series_id: createSeatReservationDto.flight_series_id,
      flight_id: flightId,
      departure_id: createSeatReservationDto.departure_id ?? null,
      destination_id: createSeatReservationDto.destination_id ?? null,
      passenger_id: passengerId,
      agent_id: createSeatReservationDto.agent_id ?? null,
      staff_id: createSeatReservationDto.staff_id ?? null,
      country_id: createSeatReservationDto.country_id ?? null,
      country_name: createSeatReservationDto.country ?? null,
      id_type: createSeatReservationDto.id_type ?? null,
      id_number: createSeatReservationDto.id_number ?? null,
      id_expiry: createSeatReservationDto.id_expiry ?? null,
      id_issued_by: createSeatReservationDto.id_issued_by ?? null,
      number_of_seats: createSeatReservationDto.number_of_seats,
      passenger_name:  passengerName,
      passenger_title: createSeatReservationDto.passenger_title ?? null,
      passenger_email: passengerEmail,
      passenger_phone: passengerPhone,
      date_of_birth: createSeatReservationDto.date_of_birth ?? null,
      booking_reference: bookingReference,
      status: createSeatReservationDto.status || 'reserved',
      reservation_date: new Date(createSeatReservationDto.reservation_date),
      notes: createSeatReservationDto.notes ?? null,
      trip_type: createSeatReservationDto.trip_type ?? 'one_way',
      return_flight_series_id: createSeatReservationDto.return_flight_series_id ?? null,
      return_date: createSeatReservationDto.return_date ?? null,
      fare_amount: createSeatReservationDto.fare_amount ?? null,
      payment_status: createSeatReservationDto.payment_status ?? 'unpaid',
      amount_paid: createSeatReservationDto.amount_paid ?? 0,
    });
    
    const savedReservation = await this.seatReservationRepository.save(reservation);
    console.log(`✅ [SeatReservationsService] Reservation created with ID: ${savedReservation.id}`);
    
      // Reload with flight series, destination, passenger, and agent relations
      const reservationWithRelations = await this.seatReservationRepository.findOne({
        where: { id: savedReservation.id },
        relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'flightSeries.viaDestination', 'passenger', 'agent', 'agent.agency', 'country', 'departure', 'destination']
      });

    return reservationWithRelations || savedReservation;
  }

  async update(id: number, updateSeatReservationDto: UpdateSeatReservationDto): Promise<SeatReservation> {
    console.log(`🎫 [SeatReservationsService] Updating reservation ID: ${id}`);
    
    const reservation = await this.findOne(id);

    // Determine if we need to check seat availability
    const flightSeriesId = updateSeatReservationDto.flight_series_id ?? reservation.flight_series_id;
    const numberOfSeats = updateSeatReservationDto.number_of_seats ?? reservation.number_of_seats;
    const newStatus = updateSeatReservationDto.status ?? reservation.status;

    // Check availability if:
    // 1. Flight series changed
    // 2. Number of seats changed
    // 3. Status changed (cancelling frees seats, uncancelling reserves seats)
    const needsAvailabilityCheck = 
      updateSeatReservationDto.flight_series_id !== undefined ||
      updateSeatReservationDto.number_of_seats !== undefined ||
      (updateSeatReservationDto.status !== undefined && newStatus !== reservation.status);

    if (needsAvailabilityCheck) {
      const flightSeriesWithAircraft = await this.flightSeriesRepository.findOne({
        where: { id: flightSeriesId },
        relations: ['aircraft']
      });

      if (!flightSeriesWithAircraft) {
        throw new NotFoundException(`Flight series with ID ${flightSeriesId} not found`);
      }

      // Determine the maximum number of seats available for this flight
      let maxSeats: number | null = null;
      if (flightSeriesWithAircraft.number_of_seats !== null && flightSeriesWithAircraft.number_of_seats !== undefined) {
        maxSeats = flightSeriesWithAircraft.number_of_seats;
      } else if (flightSeriesWithAircraft.aircraft && flightSeriesWithAircraft.aircraft.capacity !== null && flightSeriesWithAircraft.aircraft.capacity !== undefined) {
        maxSeats = flightSeriesWithAircraft.aircraft.capacity;
      }

      if (maxSeats === null || maxSeats === undefined) {
        throw new BadRequestException(`Flight series ${flightSeriesWithAircraft.flt} does not have a defined number of seats. Please set the number of seats in the flight series or ensure the aircraft has a capacity.`);
      }

      // Calculate total reserved seats for this flight (count all reservations except cancelled)
      const existingReservations = await this.seatReservationRepository.find({
        where: {
          flight_series_id: flightSeriesId
        }
      });

      // Calculate total reserved seats excluding the current reservation being updated
      // Count all reservations except cancelled ones
      const totalReservedSeats = existingReservations
        .filter(res => res.id !== id && res.status !== 'cancelled') // Exclude current reservation and cancelled ones
        .reduce((sum, res) => sum + (res.number_of_seats || 0), 0);

      // If current reservation was not cancelled and is on the same flight, we need to account for its seats being freed up
      const isSameFlight = !updateSeatReservationDto.flight_series_id || updateSeatReservationDto.flight_series_id === reservation.flight_series_id;
      const currentReservationWasActive = reservation.status !== 'cancelled' && isSameFlight;
      const currentReservationSeats = currentReservationWasActive ? (reservation.number_of_seats || 0) : 0;

      // Calculate available seats: max - (other active reservations) + (current reservation seats if it was active)
      // This ensures we don't double-count the current reservation's seats
      const availableSeats = maxSeats - totalReservedSeats + currentReservationSeats;

      if (numberOfSeats > availableSeats) {
        throw new BadRequestException(
          `Not enough seats available for flight ${flightSeriesWithAircraft.flt}. ` +
          `Available: ${availableSeats} of ${maxSeats} total seats, ` +
          `Requested: ${numberOfSeats}`
        );
      }
    }

    // If an explicit existing passenger_id is provided, link that passenger
    if (updateSeatReservationDto.passenger_id !== undefined && updateSeatReservationDto.passenger_id !== null) {
      const passenger = await this.passengerRepository.findOne({
        where: { id: updateSeatReservationDto.passenger_id }
      });

      if (!passenger) {
        throw new NotFoundException(`Passenger with ID ${updateSeatReservationDto.passenger_id} not found`);
      }

      reservation.passenger_id = passenger.id;
      reservation.passenger_name = passenger.name;
      reservation.passenger_email = passenger.email;
      reservation.passenger_phone = passenger.contact;
    } else if (updateSeatReservationDto.passenger_id === null) {
      reservation.passenger_id = null;
    }

    // Update fields (booking_reference is never updated - always auto-generated)
    if (updateSeatReservationDto.flight_series_id !== undefined) reservation.flight_series_id = updateSeatReservationDto.flight_series_id;
    if (updateSeatReservationDto.departure_id !== undefined) reservation.departure_id = updateSeatReservationDto.departure_id ?? null;
    if (updateSeatReservationDto.destination_id !== undefined) reservation.destination_id = updateSeatReservationDto.destination_id ?? null;
    if (updateSeatReservationDto.number_of_seats !== undefined) reservation.number_of_seats = updateSeatReservationDto.number_of_seats;
    if (updateSeatReservationDto.passenger_name !== undefined) reservation.passenger_name = updateSeatReservationDto.passenger_name;
    if (updateSeatReservationDto.passenger_email !== undefined) reservation.passenger_email = updateSeatReservationDto.passenger_email ?? null;
    if (updateSeatReservationDto.passenger_phone !== undefined) reservation.passenger_phone = updateSeatReservationDto.passenger_phone ?? null;
    if (updateSeatReservationDto.date_of_birth !== undefined) reservation.date_of_birth = updateSeatReservationDto.date_of_birth ?? null;
    if (updateSeatReservationDto.status !== undefined) reservation.status = updateSeatReservationDto.status;
    if (updateSeatReservationDto.reservation_date !== undefined) reservation.reservation_date = new Date(updateSeatReservationDto.reservation_date);
    if (updateSeatReservationDto.notes !== undefined) reservation.notes = updateSeatReservationDto.notes ?? null;
    if (updateSeatReservationDto.agent_id !== undefined) reservation.agent_id = updateSeatReservationDto.agent_id ?? null;
    if (updateSeatReservationDto.country_id !== undefined) reservation.country_id = updateSeatReservationDto.country_id ?? null;
    if (updateSeatReservationDto.id_type !== undefined) reservation.id_type = updateSeatReservationDto.id_type ?? null;
    if (updateSeatReservationDto.id_number !== undefined) reservation.id_number = updateSeatReservationDto.id_number ?? null;
    if (updateSeatReservationDto.id_expiry !== undefined) reservation.id_expiry = updateSeatReservationDto.id_expiry ?? null;
    if (updateSeatReservationDto.id_issued_by !== undefined) reservation.id_issued_by = updateSeatReservationDto.id_issued_by ?? null;
    if (updateSeatReservationDto.trip_type !== undefined) reservation.trip_type = updateSeatReservationDto.trip_type;
    if (updateSeatReservationDto.return_flight_series_id !== undefined) reservation.return_flight_series_id = updateSeatReservationDto.return_flight_series_id ?? null;
    if (updateSeatReservationDto.return_date !== undefined) reservation.return_date = updateSeatReservationDto.return_date ?? null;
    if (updateSeatReservationDto.fare_amount !== undefined) reservation.fare_amount = updateSeatReservationDto.fare_amount ?? null;
    if (updateSeatReservationDto.payment_status !== undefined) reservation.payment_status = updateSeatReservationDto.payment_status;
    if (updateSeatReservationDto.amount_paid !== undefined) reservation.amount_paid = updateSeatReservationDto.amount_paid ?? 0;

    // Only create or sync passenger record when the reservation is confirmed
    const finalStatus = updateSeatReservationDto.status ?? reservation.status;
    if (finalStatus === 'confirmed') {
      if (!reservation.passenger_id) {
        // Create new passenger on first confirmation
        const pnr = await this.generatePNR();
        let nationalityName: string | null = null;
        if (reservation.country_id) {
          const country = await this.countryRepository.findOne({ where: { id: reservation.country_id } });
          if (country) nationalityName = country.name;
        }
        const newPassenger = this.passengerRepository.create({
          pnr,
          name: reservation.passenger_name,
          email: reservation.passenger_email,
          contact: reservation.passenger_phone,
          nationality: nationalityName,
          id_type: reservation.id_type ?? null,
          identification: reservation.id_number ?? null,
        });
        const savedPassenger = await this.passengerRepository.save(newPassenger);
        reservation.passenger_id = savedPassenger.id;
        console.log(`✅ [SeatReservationsService] Created passenger on confirmation, ID: ${savedPassenger.id}, PNR: ${savedPassenger.pnr}`);
      } else {
        // Sync changes to the existing linked passenger
        const nationalityChanged = updateSeatReservationDto.country_id !== undefined;
        const idTypeChanged = updateSeatReservationDto.id_type !== undefined;
        const identificationChanged = updateSeatReservationDto.id_number !== undefined;
        if (nationalityChanged || idTypeChanged || identificationChanged) {
          const linkedPassenger = await this.passengerRepository.findOne({ where: { id: reservation.passenger_id } });
          if (linkedPassenger) {
            if (nationalityChanged) {
              if (reservation.country_id) {
                const country = await this.countryRepository.findOne({ where: { id: reservation.country_id } });
                linkedPassenger.nationality = country ? country.name : null;
              } else {
                linkedPassenger.nationality = null;
              }
            }
            if (idTypeChanged) {
              linkedPassenger.id_type = reservation.id_type ?? null;
            }
            if (identificationChanged) {
              linkedPassenger.identification = reservation.id_number ?? null;
            }
            await this.passengerRepository.save(linkedPassenger);
          }
        }
      }
    }

    const updatedReservation = await this.seatReservationRepository.save(reservation);
    console.log(`✅ [SeatReservationsService] Reservation updated`);
    
    // Reload with flight series, destination, passenger, and agent relations
    const reservationWithRelations = await this.seatReservationRepository.findOne({
      where: { id: updatedReservation.id },
      relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'flightSeries.viaDestination', 'passenger', 'agent', 'agent.agency', 'country', 'departure', 'destination']
    });
    return reservationWithRelations || updatedReservation;
  }

  async remove(id: number): Promise<void> {
    console.log(`🎫 [SeatReservationsService] Deleting reservation ID: ${id}`);
    const reservation = await this.findOne(id);
    await this.seatReservationRepository.remove(reservation);
    console.log(`✅ [SeatReservationsService] Reservation deleted`);
  }

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async generatePNR(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    let isUnique = false;
    
    while (!isUnique) {
      // Generate 10-character PNR
      pnr = '';
      for (let i = 0; i < 10; i++) {
        pnr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Check if PNR already exists
      const existing = await this.passengerRepository.findOne({ where: { pnr } });
      if (!existing) {
        isUnique = true;
      }
    }
    
    return pnr;
  }
}

