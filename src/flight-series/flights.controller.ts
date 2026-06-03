import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from '../entities/flight.entity';
import { FlightException } from '../entities/flight-exception.entity';
import { ExceptionType } from '../entities/exception-type.entity';
import { PassengerDisruption } from '../entities/passenger-disruption.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/flights')
@UseGuards(JwtAuthGuard)
export class FlightsController {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    @InjectRepository(FlightException)
    private readonly exceptionRepository: Repository<FlightException>,
    @InjectRepository(ExceptionType)
    private readonly exceptionTypeRepository: Repository<ExceptionType>,
    @InjectRepository(PassengerDisruption)
    private readonly disruptionRepository: Repository<PassengerDisruption>,
    @InjectRepository(BookingPassenger)
    private readonly bookingPassengerRepository: Repository<BookingPassenger>,
  ) {}

  // ── Flights ────────────────────────────────────────────────────────────────

  @Get()
  async findAll(
    @Query('page')     page      = 1,
    @Query('limit')    limit     = 50,
    @Query('from')     from?:    string,
    @Query('to')       to?:      string,
    @Query('search')   search?:  string,
    @Query('status')   status?:  string,
    @Query('seriesId') seriesId?: number,
  ) {
    const qb = this.flightRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.series', 's')
      .leftJoinAndSelect('s.fromDestination', 'fd')
      .leftJoinAndSelect('s.toDestination', 'td')
      .leftJoinAndSelect('s.aircraft', 'ac')
      .leftJoinAndSelect('f.aircraft', 'fac')
      .orderBy('f.flight_date', 'ASC')
      .addOrderBy('f.flight_no', 'ASC')

    if (from)     qb.andWhere('f.flight_date >= :from',    { from })
    if (to)       qb.andWhere('f.flight_date <= :to',      { to })
    if (status)   qb.andWhere('f.status = :status',        { status })
    if (seriesId) qb.andWhere('f.series_id = :seriesId',   { seriesId: Number(seriesId) })
    if (search)   qb.andWhere('f.flight_no LIKE :search',  { search: `%${search}%` })

    const total = await qb.getCount()
    const entities = await qb
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getMany()

    if (entities.length === 0) return { flights: [], total }

    // Use flight_id directly — most reliable since it's stored on booking_passengers
    const flightIds = entities.map(f => (f as any).id).filter(Boolean)

    const countMap = new Map<number, number>()

    if (flightIds.length > 0) {
      const rows: { flight_id: string; cnt: string }[] = await this.flightRepository.query(
        `SELECT bp.flight_id,
                COUNT(bp.id) AS cnt
         FROM booking_passengers bp
         WHERE bp.leg = 'outbound'
           AND bp.flight_id IN (${flightIds.join(',')})
         GROUP BY bp.flight_id`
      )
      console.log('✈️ [FlightsController] booked rows by flight_id:', rows.length, rows.slice(0, 3))
      for (const r of rows) {
        countMap.set(Number(r.flight_id), Number(r.cnt))
      }
    }

    const flights = entities.map(flight => {
      const fid         = (flight as any).id
      const bookedCount = countMap.get(fid) ?? 0
      // aircraft_capacity is stored directly on the flight row at generation time
      const capacity =
        (flight as any).aircraft_capacity ??
        (flight as any).aircraft?.capacity ??
        (flight as any).series?.aircraft?.capacity ??
        (flight as any).series?.number_of_seats ??
        null
      const available = capacity !== null ? Math.max(0, capacity - bookedCount) : null
      return { ...flight, booked_count: bookedCount, available_seats: available }
    })

    return { flights, total }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Pick<Flight, 'std' | 'sta' | 'status' | 'notes'>>,
  ) {
    const flight = await this.flightRepository.findOneOrFail({ where: { id } })
    if (body.std    !== undefined) flight.std    = body.std    ?? null
    if (body.sta    !== undefined) flight.sta    = body.sta    ?? null
    if (body.status !== undefined) flight.status = body.status
    if (body.notes  !== undefined) flight.notes  = body.notes  ?? null
    return this.flightRepository.save(flight)
  }

  // ── Extra flights ─────────────────────────────────────────────────────────

  @Post(':id/extra')
  async addExtraFlight(
    @Param('id', ParseIntPipe) flightId: number,
    @Body() body: { aircraft_id: number; notes?: string },
  ) {
    const original = await this.flightRepository.findOneOrFail({
      where: { id: flightId },
      relations: ['series'],
    })
    const extra = this.flightRepository.create({
      series_id:   original.series_id,
      aircraft_id: body.aircraft_id,
      flight_no:   original.flight_no,
      flight_date: original.flight_date,
      std:         original.std,
      sta:         original.sta,
      status:      'scheduled',
      is_extra:    true,
      notes:       body.notes ?? null,
    })
    return this.flightRepository.save(extra)
  }

  // ── Flight Exceptions ──────────────────────────────────────────────────────

  // Passenger bookings for a specific flight — from booking_passengers WHERE flight_id = :id
  @Get(':id/passengers')
  async getPassengers(@Param('id', ParseIntPipe) id: number) {
    const rows = await this.bookingPassengerRepository.find({
      where: { flight_id: id },
      relations: ['passenger', 'booking', 'booking.flightSeries',
                  'booking.flightSeries.fromDestination',
                  'booking.flightSeries.toDestination'],
      order: { created_at: 'ASC' },
    })
    return rows.map(bp => ({
      id:              bp.id,
      booking_id:      bp.booking_id,
      booking_reference: (bp as any).booking?.booking_reference ?? null,
      payment_status:  (bp as any).booking?.payment_status ?? null,
      passenger_type:  bp.passenger_type,
      fare_amount:     Number(bp.fare_amount ?? 0),
      travel_date:     bp.travel_date ? String(bp.travel_date).slice(0, 10) : null,
      leg:             bp.leg,
      ticket_status:   bp.ticket_status ?? null,
      ticket_number:   bp.ticket_number ?? null,
      passenger: bp.passenger ? {
        id:             bp.passenger.id,
        pnr:            bp.passenger.pnr,
        name:           bp.passenger.name,
        title:          (bp.passenger as any).title ?? null,
        email:          bp.passenger.email,
        contact:        bp.passenger.contact,
        nationality:    bp.passenger.nationality,
        id_type:        bp.passenger.id_type,
        identification: bp.passenger.identification,
      } : null,
    }))
  }

  @Get(':id/exceptions')
  async getExceptions(@Param('id', ParseIntPipe) id: number) {
    return this.exceptionRepository.find({
      where: { flight_id: id },
      relations: ['exceptionType'],
      order: { created_at: 'DESC' },
    })
  }

  @Post(':id/exceptions')
  async addException(
    @Param('id', ParseIntPipe) flightId: number,
    @Body() body: {
      exception_type: number
      reason?: string
      old_value?: string
      new_value?: string
      created_by?: string
      action_taken?: string
    },
  ) {
    // Save the exception record
    const exc = this.exceptionRepository.create({
      flight_id:      flightId,
      exception_type: body.exception_type,
      reason:         body.reason      ?? null,
      old_value:      body.old_value   ?? null,
      new_value:      body.new_value   ?? null,
      created_by:     body.created_by  ?? null,
    })
    const saved = await this.exceptionRepository.save(exc)

    // Auto-create PassengerDisruption records for every booking on this flight
    const exType = await this.exceptionTypeRepository.findOne({ where: { id: body.exception_type } })
    const disruptionType = exType?.name ?? `Exception #${body.exception_type}`

    const flight = await this.flightRepository.findOne({ where: { id: flightId } })
    if (flight) {
      const affectedBps = await this.bookingPassengerRepository.find({
        where: { flight_series_id: flight.series_id, travel_date: flight.flight_date as any },
        relations: ['booking'],
      })
      const uniqueBookingIds = [...new Set(affectedBps.map(bp => bp.booking_id))]
      if (uniqueBookingIds.length > 0) {
        const disruptions = uniqueBookingIds.map(bookingId =>
          this.disruptionRepository.create({
            booking_id:      bookingId,
            flight_id:       flightId,
            disruption_type: disruptionType,
            action_taken:    body.action_taken ?? null,
          })
        )
        await this.disruptionRepository.save(disruptions)
        console.log(`✅ Created ${disruptions.length} passenger disruption records for flight ${flightId}`)
      }
    }

    return this.exceptionRepository.findOne({
      where: { id: saved.id },
      relations: ['exceptionType'],
    })
  }

  // ── Exception Types ────────────────────────────────────────────────────────

  @Get('exception-types/list')
  async getExceptionTypes() {
    return this.exceptionTypeRepository.find({ order: { name: 'ASC' } })
  }
}
