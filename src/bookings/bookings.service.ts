import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Flight } from '../entities/flight.entity';
import { Passenger } from '../entities/passenger.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { Agency } from '../entities/agency.entity';
import { AgencyLedger } from '../entities/agency-ledger.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { CountryTax } from '../entities/country-tax.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { CreateBookingDto, PassengerDto } from './dto/create-booking.dto';
import { AddBookingPassengerDto } from './dto/add-booking-passenger.dto';
import { CancelRefundDto } from './dto/cancel-refund.dto';
import { CancelRescheduleDto } from './dto/cancel-reschedule.dto';
import { PassengersService } from '../passengers/passengers.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
    @InjectRepository(BookingPassenger)
    private bookingPassengerRepository: Repository<BookingPassenger>,
    @InjectRepository(SeatReservation)
    private seatReservationRepository: Repository<SeatReservation>,
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(AgencyLedger)
    private agencyLedgerRepository: Repository<AgencyLedger>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(CountryTax)
    private countryTaxRepository: Repository<CountryTax>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(SupplierLedger)
    private supplierLedgerRepository: Repository<SupplierLedger>,
    private passengersService: PassengersService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    console.log('🎫 [BookingsService] Creating new booking:', createBookingDto);

    const isReturnTrip = !!createBookingDto.is_return_trip
    const returnFsIdEarly = isReturnTrip
      ? (createBookingDto.return_flight_series_id ?? createBookingDto.flight_series_id)
      : null

    // Load the outbound (and, for return trips, return) flight series up front with
    // the destination relations needed for confirmation/ticket emails. Loading these
    // now — instead of the flat findOne this used to be — lets the final response
    // and background emails be built from data already in memory, avoiding the
    // expensive multi-relation reload query that used to run at the very end.
    // Also fetched concurrently with the passenger idempotency work below.
    const [flightSeries, returnFlightSeriesEntity] = await Promise.all([
      this.flightSeriesRepository.findOne({
        where: { id: createBookingDto.flight_series_id },
        relations: ['fromDestination', 'toDestination'],
      }),
      (returnFsIdEarly && returnFsIdEarly !== createBookingDto.flight_series_id)
        ? this.flightSeriesRepository.findOne({ where: { id: returnFsIdEarly }, relations: ['fromDestination', 'toDestination'] })
        : Promise.resolve(null),
    ])

    if (!flightSeries) {
      throw new NotFoundException(`Flight series with ID ${createBookingDto.flight_series_id} not found`);
    }

    if (!createBookingDto.passengers || createBookingDto.passengers.length === 0) {
      throw new BadRequestException('At least one passenger is required');
    }

    // Create all passengers first
    let totalAmount = 0
    let farePerPassenger = 0
    console.log(`✈️ [BookingsService] is_return_trip=${createBookingDto.is_return_trip} → isReturnTrip=${isReturnTrip}, flight=${flightSeries.flt}, adult_fare=${flightSeries.adult_fare}, adult_return_fare=${flightSeries.adult_return_fare}`)

    for (const passengerDto of createBookingDto.passengers) {
      // Calculate fare based on passenger type
      // For return trips: use adult_return_fare ÷ 2 per leg (each leg gets half the round-trip fare)
      // A client-supplied fare_amount (e.g. a via-leg/route fare resolved on the confirm page,
      // which can differ from the flight series' own flat fare) takes priority when present.
      let fare = 0
      if (passengerDto.fare_amount != null) {
        fare = Number(passengerDto.fare_amount) || 0
      } else {
        switch (passengerDto.passenger_type) {
          case 'adult':
            fare = isReturnTrip
              ? (Number(flightSeries.adult_return_fare ?? flightSeries.adult_fare) || 0) / 2
              : Number(flightSeries.adult_fare) || 0
            break
          case 'child':
            fare = isReturnTrip
              ? (Number(flightSeries.child_return_fare ?? flightSeries.child_fare) || 0) / 2
              : Number(flightSeries.child_fare) || 0
            break
          case 'infant':
            fare = isReturnTrip
              ? (Number(flightSeries.infant_return_fare ?? flightSeries.infant_fare) || 0) / 2
              : Number(flightSeries.infant_fare) || 0
            break
        }
      }
      totalAmount += fare
      farePerPassenger = fare
    }

    // Resolve/create all passengers concurrently — the DB is remote, so sequential
    // per-passenger round-trips (lookup + save each) dominated response time.
    const createdPassengers: Passenger[] = await Promise.all(
      createBookingDto.passengers.map(async (passengerDto) => {
        // Check if passenger already exists by id_type + identification before creating
        let passenger: Passenger | null = null

        if (passengerDto.id_type && passengerDto.identification) {
          passenger = await this.passengerRepository.findOne({
            where: {
              id_type:        passengerDto.id_type,
              identification: passengerDto.identification,
            },
          })
          if (passenger) {
            console.log(`♻️ [BookingsService] Reusing existing passenger id=${passenger.id} (${passenger.pnr}) matched by ${passengerDto.id_type}/${passengerDto.identification}`)
            // Update name/contact in case details changed
            passenger.name          = passengerDto.name          || passenger.name
            passenger.email         = passengerDto.email         || passenger.email
            passenger.contact       = passengerDto.contact       || passenger.contact
            passenger.nationality   = passengerDto.nationality   || passenger.nationality
            if (passengerDto.title) passenger.title = passengerDto.title as any
            if (passengerDto.date_of_birth) passenger.date_of_birth = passengerDto.date_of_birth
            passenger = await this.passengerRepository.save(passenger)
          }
        }

        if (!passenger) {
          // No match — create a new passenger record
          passenger = await this.passengersService.create({
            name:           passengerDto.name,
            email:          passengerDto.email          || null,
            contact:        passengerDto.contact        || null,
            nationality:    passengerDto.nationality    || null,
            id_type:        passengerDto.id_type        || null,
            identification: passengerDto.identification || null,
            age:            passengerDto.age ? (typeof passengerDto.age === 'string' ? parseInt(passengerDto.age, 10) : passengerDto.age) : null,
            date_of_birth:  passengerDto.date_of_birth   || null,
            title:          passengerDto.title          || null,
          })
          console.log(`✅ [BookingsService] Created new passenger ${passenger.id} with PNR: ${passenger.pnr}`)
        }

        return passenger
      })
    )

    // Use first passenger as primary passenger for booking record
    const primaryPassenger = createdPassengers[0]

    // Idempotency guard: bookings table has no seat_reservation_id column, but the
    // passenger lookup above already dedups by id_type+identification, so a retried
    // submission (e.g. the confirm page re-posting after a client-side timeout that
    // actually succeeded server-side) resolves to the SAME primary passenger. Only
    // short-circuit when THIS reservation has already been converted before (status
    // != 'reserved') — otherwise a still-'reserved' reservation must always create
    // its own new booking, even if the same passenger (matched by id_type+identification,
    // which can collide on placeholder/test data) already has an unrelated booking on
    // this flight series from a different reservation. Without this check that other
    // booking gets silently returned and the current reservation never gets marked
    // 'booked'.
    if (createBookingDto.seat_reservation_id) {
      const reservationForIdempotency = await this.seatReservationRepository.findOne({
        where: { id: createBookingDto.seat_reservation_id },
      })
      if (reservationForIdempotency && reservationForIdempotency.status !== 'reserved') {
        const existingBooking = await this.bookingRepository.findOne({
          where: {
            flight_series_id: createBookingDto.flight_series_id,
            passenger_id: primaryPassenger.id,
          },
          order: { created_at: 'DESC' },
        })
        if (existingBooking) {
          console.log(`♻️ [BookingsService] Reservation ${createBookingDto.seat_reservation_id} already has status '${reservationForIdempotency.status}' and booking ${existingBooking.id} exists for flight_series_id=${createBookingDto.flight_series_id}, passenger_id=${primaryPassenger.id} — returning existing booking instead of creating a duplicate`)
          return this.findOne(existingBooking.id)
        }
      }
    }

    // Generate unique booking reference
    const bookingReference = this.generateBookingReference()

    // Resolve the actual flights table row(s) before creating the booking so that
    // bookings.flight_id (not just booking_passengers.flight_id) gets populated.
    const outboundDate = createBookingDto.travel_date ?? createBookingDto.booking_date ?? null
    const returnDate   = isReturnTrip ? (createBookingDto.return_date ?? null) : null
    const returnFsId   = returnFsIdEarly

    // Use provided flight_id if available, otherwise look up from the flights table
    const lookupFlightId = async (seriesId: number | null, date: string | null): Promise<number | null> => {
      if (!seriesId || !date) return null
      try {
        const f = await this.flightRepository.findOne({
          where: { series_id: seriesId, flight_date: date as any },
        })
        return f?.id ?? null
      } catch { return null }
    }

    // Resolve both legs' flight rows concurrently — they're independent lookups.
    const [outboundFlightId, returnFlightId] = await Promise.all([
      createBookingDto.flight_id != null
        ? Promise.resolve(createBookingDto.flight_id)
        : lookupFlightId(createBookingDto.flight_series_id, outboundDate),
      isReturnTrip
        ? (createBookingDto.return_flight_id != null
            ? Promise.resolve(createBookingDto.return_flight_id)
            : lookupFlightId(returnFsId, returnDate))
        : Promise.resolve(null),
    ])
    console.log(`✈️ [BookingsService] flight_id: outbound=${outboundFlightId}, return=${returnFlightId}`)

    const booking = this.bookingRepository.create({
      booking_reference: bookingReference,
      flight_series_id: createBookingDto.flight_series_id,
      passenger_id: primaryPassenger.id,
      passenger_name: primaryPassenger.name,
      passenger_email: primaryPassenger.email,
      passenger_phone: primaryPassenger.contact,
      passenger_type: createBookingDto.passengers[0].passenger_type,
      number_of_passengers: createBookingDto.passengers.length,
      fare_per_passenger: farePerPassenger,
      total_amount: createBookingDto.override_total_amount ?? totalAmount,
      payment_method: createBookingDto.payment_method,
      // agency_balance always settles immediately — mark paid regardless of what frontend sent
      payment_status: (createBookingDto.payment_status === 'paid' || createBookingDto.payment_method === 'agency_balance')
        ? 'paid'
        : (createBookingDto.payment_status || 'pending'),
      booking_date: new Date(createBookingDto.booking_date),
      notes:              createBookingDto.notes              ?? null,
      payment_reference:  createBookingDto.payment_reference  ?? null,
      payment_account:    createBookingDto.payment_account    ?? null,
      agency_id: createBookingDto.agency_id ?? null,
      agent_id: createBookingDto.agent_id ?? null,
      is_return_trip: isReturnTrip,
      return_date: isReturnTrip ? (createBookingDto.return_date ?? null) : null,
      return_flight_series_id: isReturnTrip ? (createBookingDto.return_flight_series_id ?? null) : null,
      flight_id: outboundFlightId,
    });

    console.log(`💳 [BookingsService] Saving booking — method=${createBookingDto.payment_method} ref=${createBookingDto.payment_reference ?? 'null'} account=${createBookingDto.payment_account ?? 'null'}`)
    const savedBooking = await this.bookingRepository.save(booking);
    console.log(`✅ [BookingsService] Booking saved: id=${savedBooking.id} ref=${savedBooking.booking_reference} flight_id=${savedBooking.flight_id ?? 'null'} payment_ref=${savedBooking.payment_reference ?? 'null'} payment_acc=${savedBooking.payment_account ?? 'null'}`);
    console.log(`✅ [BookingsService] Created ${createdPassengers.length} passengers for booking`);

    // Build all booking_passengers rows (one per passenger per leg) then persist them
    // in a single batched insert instead of a round-trip per row — a return trip with
    // several passengers previously issued 2×N sequential INSERTs.
    const bookingPassengersToSave: BookingPassenger[] = []
    for (let i = 0; i < createdPassengers.length; i++) {
      const passenger = createdPassengers[i]
      const passengerDto = createBookingDto.passengers[i]

      let fare = 0
      if (passengerDto.fare_amount != null) {
        fare = Number(passengerDto.fare_amount) || 0
      } else {
        switch (passengerDto.passenger_type) {
          case 'adult':
            fare = isReturnTrip
              ? (Number(flightSeries.adult_return_fare ?? flightSeries.adult_fare) || 0) / 2
              : Number(flightSeries.adult_fare) || 0
            break
          case 'child':
            fare = isReturnTrip
              ? (Number(flightSeries.child_return_fare ?? flightSeries.child_fare) || 0) / 2
              : Number(flightSeries.child_fare) || 0
            break
          case 'infant':
            fare = isReturnTrip
              ? (Number(flightSeries.infant_return_fare ?? flightSeries.infant_fare) || 0) / 2
              : Number(flightSeries.infant_fare) || 0
            break
        }
      }

      // Outbound leg
      bookingPassengersToSave.push(this.bookingPassengerRepository.create({
        booking_id:        savedBooking.id,
        passenger_id:      passenger.id,
        flight_series_id:  createBookingDto.flight_series_id,
        flight_id:         outboundFlightId,
        departure_id:      createBookingDto.departure_id ?? null,
        destination_id:    createBookingDto.destination_id ?? null,
        passenger_type:    passengerDto.passenger_type,
        fare_amount:       fare,
        travel_date:       outboundDate,
        leg:               'outbound',
        ticket_number:     passengerDto.ticket_number || null,
        payment_reference: createBookingDto.payment_reference ?? null,
        payment_account:   createBookingDto.payment_account   ?? null,
      }))

      // Return leg — always created for return trips so both travel dates and flight
      // details are stored as separate rows in booking_passengers.
      if (isReturnTrip) {
        const retFsId = returnFsId ?? createBookingDto.flight_series_id
        bookingPassengersToSave.push(this.bookingPassengerRepository.create({
          booking_id:        savedBooking.id,
          passenger_id:      passenger.id,
          flight_series_id:  retFsId,
          flight_id:         returnFlightId,
          passenger_type:    passengerDto.passenger_type,
          fare_amount:       fare,
          travel_date:       returnDate,
          leg:               'return',
          payment_reference: createBookingDto.payment_reference ?? null,
          payment_account:   createBookingDto.payment_account   ?? null,
        }))
      }
    }

    let bookingPassengerRecords: BookingPassenger[]
    try {
      bookingPassengerRecords = await this.bookingPassengerRepository.save(bookingPassengersToSave)
    } catch (error: any) {
      // Most likely cause of a duplicate-key failure is the old unique constraint
      // (booking_id, passenger_id) that predates the per-leg `leg` column.
      // Fix: ALTER TABLE booking_passengers DROP INDEX <old>, ADD UNIQUE KEY(booking_id, passenger_id, leg)
      console.error(`❌ [BookingsService] Failed to save booking_passenger rows: ${error?.message}`)
      console.error(`❌ SQL error code: ${error?.code}  errno: ${error?.errno}`)
      throw new BadRequestException(
        `Failed to link passengers to booking: ${error?.message}. ` +
        `If this is a duplicate key error, run the DB migration to update the unique constraint on booking_passengers.`
      )
    }

    console.log(`✅ [BookingsService] Created ${bookingPassengerRecords.length} booking_passenger records (${isReturnTrip ? 'return trip' : 'one-way'})`)
    
    // Use override amount for agency deduction if provided (e.g. reservation's agreed fare_amount)
    const deductAmount = createBookingDto.override_total_amount ?? totalAmount;

    // Handle agency balance deduction if applicable
    if (createBookingDto.agency_id) {
      try {
        const agency = await this.agencyRepository.findOne({
          where: { id: createBookingDto.agency_id }
        });
        
        if (!agency) {
          console.warn(`⚠️ [BookingsService] Agency ${createBookingDto.agency_id} not found`);
        } else {
          // Get current balance from agency entity
          const currentBalance = Number(agency.balance);
          
          // Check if agency has sufficient balance
          if (currentBalance < deductAmount) {
            throw new BadRequestException(
              `Insufficient agency balance. Agency "${agency.name}" has ${currentBalance.toFixed(2)}, booking requires ${deductAmount.toFixed(2)}. Shortfall: ${(deductAmount - currentBalance).toFixed(2)}`
            );
          }

          // Deduct from agency balance
          const newBalance = currentBalance - deductAmount;
          agency.balance = newBalance;
          await this.agencyRepository.save(agency);

          // Get current ledger balance
          const latestLedger = await this.agencyLedgerRepository.findOne({
            where: { agencyId: agency.id },
            order: { transactionDate: 'DESC', createdAt: 'DESC' }
          });

          const currentLedgerBalance = latestLedger ? Number(latestLedger.balance) : currentBalance;

          // Create ledger entry for the full deductAmount
          const ledgerEntry = this.agencyLedgerRepository.create({
            agencyId: agency.id,
            transactionDate: new Date(createBookingDto.booking_date),
            description: `Booking payment - ${savedBooking.booking_reference}`,
            debit: 0,
            credit: deductAmount,
            balance: currentLedgerBalance - deductAmount,
            reference: savedBooking.booking_reference
          });

          await this.agencyLedgerRepository.save(ledgerEntry);
          console.log(`✅ [BookingsService] Deducted ${deductAmount} from agency ${agency.name}. New balance: ${newBalance}`);

          // Log to journal entries
          try {
            await this.createJournalEntryForBooking(
              savedBooking, flightSeries, deductAmount,
              createBookingDto.payment_account_id ?? 0,
              createBookingDto.booking_date,
              createBookingDto.agency_id,
            );
            console.log(`✅ [BookingsService] Journal entry created for agency booking ${savedBooking.booking_reference}`);
          } catch (journalErr) {
            console.warn(`⚠️ [BookingsService] Journal entry skipped for agency booking:`, journalErr instanceof Error ? journalErr.message : String(journalErr));
          }

          if (createBookingDto.payment_account_id) {
            try {
              await this.postCountryTaxesForBooking(
                savedBooking, flightSeries, createdPassengers.length,
                createBookingDto.payment_account_id,
                createBookingDto.booking_date,
              );
            } catch (taxErr) {
              console.warn(`⚠️ [BookingsService] Country tax posting skipped for agency booking:`, taxErr instanceof Error ? taxErr.message : String(taxErr));
            }
          }
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error deducting from agency balance:`, error);
        if (error instanceof BadRequestException) throw error;
        console.warn(`⚠️ [BookingsService] Continuing despite agency balance deduction error`);
      }
    }
    
    // Handle payment account addition — required for direct bookings, optional for agency bookings
    if (!createBookingDto.payment_account_id && !createBookingDto.agency_id) {
      throw new BadRequestException('Payment account is required for direct bookings. Please select a payment account.');
    }
    
    if (createBookingDto.payment_account_id) try {
      // Find payment account from chart_of_accounts (where account_type = 9)
      const paymentAccount = await this.chartOfAccountRepository.findOne({
        where: { id: createBookingDto.payment_account_id, account_type: 9 }
      });

      if (!paymentAccount) {
        throw new BadRequestException(`Payment account with ID ${createBookingDto.payment_account_id} not found in chart_of_accounts`);
      }
      
      console.log(`✅ [BookingsService] Payment account found: ${paymentAccount.name} (${paymentAccount.code})`);
      
      // Create journal entry for booking revenue - REQUIRED when payment account is selected.
      // Do this before touching account_ledger so missing legacy tables cannot block journal posting.
      console.log(`📝 [BookingsService] ==========================================`);
      console.log(`📝 [BookingsService] CREATING JOURNAL ENTRY - Payment account selected: ${paymentAccount.name} (ID: ${createBookingDto.payment_account_id})`);
      console.log(`📝 [BookingsService] This will record to journal_entries and journal_entry_lines tables`);
      console.log(`📝 [BookingsService] ==========================================`);
      
      try {
        await this.createJournalEntryForBooking(
          savedBooking,
          flightSeries,
          totalAmount,
          createBookingDto.payment_account_id,
          createBookingDto.booking_date,
          createBookingDto.agency_id
        );
        console.log(`✅ [BookingsService] ==========================================`);
        console.log(`✅ [BookingsService] JOURNAL ENTRY CREATION COMPLETED SUCCESSFULLY`);
        console.log(`✅ [BookingsService] Entry recorded to journal_entries table`);
        console.log(`✅ [BookingsService] Lines recorded to journal_entry_lines table`);
        console.log(`✅ [BookingsService] ==========================================`);
      } catch (journalError) {
        console.error(`❌ [BookingsService] ==========================================`);
        console.error(`❌ [BookingsService] ⚠️⚠️⚠️ CRITICAL: FAILED TO CREATE JOURNAL ENTRY ⚠️⚠️⚠️`);
        console.error(`❌ [BookingsService] Payment account was selected (ID: ${createBookingDto.payment_account_id}) but journal entry creation failed`);
        console.error(`❌ [BookingsService] Booking was created successfully, but journal entry was NOT recorded`);
        console.error(`❌ [BookingsService] This means the transaction is NOT in journal_entries or journal_entry_lines tables`);
        console.error(`❌ [BookingsService] Error:`, journalError);
        console.error(`❌ [BookingsService] Error type:`, journalError?.constructor?.name || typeof journalError);
        console.error(`❌ [BookingsService] Error message:`, journalError instanceof Error ? journalError.message : String(journalError));
        console.error(`❌ [BookingsService] Error stack:`, journalError instanceof Error ? journalError.stack : 'No stack trace');
        console.error(`❌ [BookingsService] Full error:`, JSON.stringify(journalError, Object.getOwnPropertyNames(journalError), 2));
        console.error(`❌ [BookingsService] ==========================================`);
        // Don't throw - booking is already created successfully
        // But log prominently so it's not missed
        console.warn(`⚠️ [BookingsService] WARNING: Journal entry was not created. Please check the logs above for details.`);
      }

      try {
        await this.postCountryTaxesForBooking(
          savedBooking, flightSeries, createdPassengers.length,
          createBookingDto.payment_account_id,
          createBookingDto.booking_date,
        );
      } catch (taxErr) {
        console.warn(`⚠️ [BookingsService] Country tax posting skipped:`, taxErr instanceof Error ? taxErr.message : String(taxErr));
      }

      // Legacy account_ledger write — skipped because account_ledger references the
      // accounts table which does not exist in this installation.
      // Journal entries are written via createJournalEntryForBooking above.
      console.log(`✅ [BookingsService] Skipping legacy account_ledger write (uses accounts table).`);
    } catch (error) {
      console.error(`❌ [BookingsService] Error adding to payment account:`, error);
      // Re-throw if it's a BadRequestException, otherwise log and continue
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.warn(`⚠️ [BookingsService] Continuing despite payment account addition error`);
    }
    
    // Legacy account addition — uses chart_of_accounts table
    if (createBookingDto.deduct_from_account && createBookingDto.account_id) {
      try {
        const account = await this.chartOfAccountRepository.findOne({
          where: { id: createBookingDto.account_id }
        });

        if (!account) {
          throw new BadRequestException(`Account with ID ${createBookingDto.account_id} not found in chart_of_accounts`);
        }

        // account_ledger skipped — references accounts table which does not exist.
        console.log(`✅ [BookingsService] Legacy deduct_from_account: chart entry found for ${account.name}. Ledger write skipped.`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error adding to account:`, error);
        // Re-throw if it's a BadRequestException, otherwise log and continue
        if (error instanceof BadRequestException) {
          throw error;
        }
        console.warn(`⚠️ [BookingsService] Continuing despite account addition error`);
      }
    }
    
    // Update seat reservation status to 'booked' if reservation_id is provided
    if (createBookingDto.seat_reservation_id) {
      try {
        const seatReservation = await this.seatReservationRepository.findOne({
          where: { id: createBookingDto.seat_reservation_id }
        });

        if (seatReservation) {
          seatReservation.status = 'booked';
          seatReservation.payment_status = savedBooking.payment_status;
          seatReservation.amount_paid = Number(savedBooking.total_amount) || 0;
          await this.seatReservationRepository.save(seatReservation);
          console.log(`✅ [BookingsService] Updated seat reservation ${seatReservation.id} status to 'booked', payment_status to '${seatReservation.payment_status}', amount_paid to ${seatReservation.amount_paid}`);

          // Also create a separate booked record for the return leg so the return flight's
          // availability is tracked (the reservation record only covers the outbound date).
          if (isReturnTrip && createBookingDto.return_date) {
            const returnFlightSeriesId = createBookingDto.return_flight_series_id
              ?? seatReservation.return_flight_series_id
              ?? createBookingDto.flight_series_id;
            const returnRef = `${savedBooking.booking_reference}-R`;
            const existing = await this.seatReservationRepository.findOne({ where: { booking_reference: returnRef } });
            if (!existing) {
              const returnRes = this.seatReservationRepository.create({
                flight_series_id: returnFlightSeriesId,
                passenger_id: primaryPassenger.id,
                number_of_seats: createBookingDto.passengers.length,
                passenger_name: primaryPassenger.name,
                passenger_email: primaryPassenger.email ?? null,
                passenger_phone: primaryPassenger.contact ?? null,
                booking_reference: returnRef,
                status: 'booked',
                reservation_date: createBookingDto.return_date as any,
                trip_type: 'one_way',
                payment_status: 'paid',
                amount_paid: 0,
                fare_amount: 0,
                agent_id: null,
                notes: createBookingDto.notes ?? null,
              });
              await this.seatReservationRepository.save(returnRes);
              console.log(`✅ [BookingsService] Created return seat_reservation for reservation-based booking ${returnRef}`);
            }
          }
        } else {
          console.warn(`⚠️ [BookingsService] Seat reservation ${createBookingDto.seat_reservation_id} not found`);
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error updating seat reservation status:`, error);
        // Don't throw - booking is already created successfully
      }
    } else if (savedBooking.payment_status === 'paid') {
      // Direct confirmed booking — create seat_reservation records so seat counts are tracked.
      // Only runs when the booking is actually paid (e.g. agency_balance deduction succeeded).
      try {
        const outboundDate = createBookingDto.travel_date ?? createBookingDto.booking_date;
        const numSeats = createBookingDto.passengers.length;
        console.log(`📅 [BookingsService] Seat tracking: outboundDate=${outboundDate}, numSeats=${numSeats}, flightSeriesId=${createBookingDto.flight_series_id}, isReturn=${isReturnTrip}, returnDate=${createBookingDto.return_date}, returnFsId=${createBookingDto.return_flight_series_id}`);

        // Outbound seat record
        const outboundRes = this.seatReservationRepository.create({
          flight_series_id: createBookingDto.flight_series_id,
          passenger_id: primaryPassenger.id,
          number_of_seats: numSeats,
          passenger_name: primaryPassenger.name,
          passenger_email: primaryPassenger.email ?? null,
          passenger_phone: primaryPassenger.contact ?? null,
          booking_reference: savedBooking.booking_reference,
          status: 'booked',
          reservation_date: outboundDate as any,
          trip_type: isReturnTrip ? 'return' : 'one_way',
          return_flight_series_id: isReturnTrip ? (createBookingDto.return_flight_series_id ?? null) : null,
          return_date: isReturnTrip ? (createBookingDto.return_date ?? null) : null,
          payment_status: 'paid',
          amount_paid: deductAmount,
          fare_amount: deductAmount,
          agent_id: null,
          notes: createBookingDto.notes ?? null,
        });
        await this.seatReservationRepository.save(outboundRes);
        console.log(`✅ [BookingsService] Created outbound seat_reservation for confirmed booking ${savedBooking.booking_reference}`);

        // Return seat record — only the return_date is required.
        // When no separate return_flight_series_id is given (same aircraft/series flies back),
        // fall back to the outbound flight_series_id so that the return date's availability
        // on that series is also decremented.
        if (isReturnTrip && createBookingDto.return_date) {
          const returnFlightSeriesId = createBookingDto.return_flight_series_id ?? createBookingDto.flight_series_id;
          console.log(`📅 [BookingsService] Creating return seat_reservation: flightSeriesId=${returnFlightSeriesId}, date=${createBookingDto.return_date}`);
          const returnRes = this.seatReservationRepository.create({
            flight_series_id: returnFlightSeriesId,
            passenger_id: primaryPassenger.id,
            number_of_seats: numSeats,
            passenger_name: primaryPassenger.name,
            passenger_email: primaryPassenger.email ?? null,
            passenger_phone: primaryPassenger.contact ?? null,
            booking_reference: `${savedBooking.booking_reference}-R`,
            status: 'booked',
            reservation_date: createBookingDto.return_date as any,
            trip_type: 'one_way',
            payment_status: 'paid',
            amount_paid: 0,
            fare_amount: 0,
            agent_id: null,
            notes: createBookingDto.notes ?? null,
          });
          await this.seatReservationRepository.save(returnRes);
          console.log(`✅ [BookingsService] Created return seat_reservation for confirmed booking ${savedBooking.booking_reference}-R`);
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error creating seat_reservation for confirmed booking:`, error);
        // Don't throw — booking already created
      }
    }
    
    // Attach relations from data already in memory instead of an expensive reload
    // query with 9+ joined tables — flightSeries (and returnFlightSeries), the
    // primary passenger, and each booking_passenger's own passenger/flightSeries
    // were all already fetched/created above in this same request.
    const passengerById = new Map(createdPassengers.map(p => [p.id, p]))
    const flightSeriesById = new Map<number, FlightSeries>([[flightSeries.id, flightSeries]])
    if (returnFlightSeriesEntity) flightSeriesById.set(returnFlightSeriesEntity.id, returnFlightSeriesEntity)

    const finalBooking = savedBooking as Booking & { bookingPassengers: (BookingPassenger & { passenger?: Passenger; flightSeries?: FlightSeries })[] }
    finalBooking.flightSeries = flightSeries
    finalBooking.passenger = primaryPassenger
    if (isReturnTrip) {
      finalBooking.returnFlightSeries = (returnFsId != null ? flightSeriesById.get(returnFsId) : undefined) ?? flightSeries
    }
    finalBooking.bookingPassengers = bookingPassengerRecords.map(bp => ({
      ...bp,
      passenger: passengerById.get(bp.passenger_id),
      flightSeries: (bp.flight_series_id != null ? flightSeriesById.get(bp.flight_series_id) : undefined) ?? flightSeries,
    }))

    // Send confirmation + ticket emails in the background. These were previously
    // `await`ed sequentially (1 confirmation + 1 per booking_passenger row), which
    // on a return-trip booking with several passengers meant the HTTP response sat
    // through half a dozen+ SMTP round-trips (each easily 1-3+s) before returning —
    // the dominant cause of "confirming a booking takes long". The comment above
    // already documented the intent ("never let an email failure affect the booking
    // response") — firing these without awaiting actually delivers on that, since a
    // slow/failed send can no longer add to (or fail) the response at all.
    if (finalBooking.passenger_email) {
      this.mailService.sendBookingConfirmation({
        passengerEmail: finalBooking.passenger_email,
        passengerName: finalBooking.passenger_name,
        bookingReference: finalBooking.booking_reference,
        flightNo: finalBooking.flightSeries?.flt || '',
        origin: finalBooking.flightSeries?.fromDestination?.code || '',
        destination: finalBooking.flightSeries?.toDestination?.code || '',
        travelDate: String(finalBooking.booking_date || '').slice(0, 10),
        std: finalBooking.flightSeries?.std,
        sta: finalBooking.flightSeries?.sta,
        totalAmount: Number(finalBooking.total_amount || 0),
        isReturnTrip: finalBooking.is_return_trip,
      }).catch(err => console.error(`❌ [BookingsService] Failed to send booking confirmation email to ${finalBooking.passenger_email}:`, err));
    }

    // Send each passenger their own ticket as a separate email — one per booking_passenger
    // row (covers both legs of a return trip), sent to that passenger's own email if known.
    for (const bp of finalBooking.bookingPassengers || []) {
      const passenger = bp.passenger;
      if (!passenger?.email) continue;

      const ticketNumber = bp.ticket_number
        || `${finalBooking.booking_reference.replace(/-/g, '').slice(0, 6)}${String(passenger.id).padStart(4, '0')}`;
      const bpFlightSeries = bp.flightSeries || finalBooking.flightSeries;

      this.mailService.sendTicket({
        passengerEmail: passenger.email,
        passengerTitle: (passenger as any).title,
        passengerName: passenger.name,
        pnr: passenger.pnr,
        ticketNumber,
        bookingReference: finalBooking.booking_reference,
        passengerType: bp.passenger_type,
        flightNo: bpFlightSeries?.flt || '',
        origin: bpFlightSeries?.fromDestination?.code || '',
        originName: bpFlightSeries?.fromDestination?.name,
        destination: bpFlightSeries?.toDestination?.code || '',
        destinationName: bpFlightSeries?.toDestination?.name,
        travelDate: String(bp.travel_date || finalBooking.booking_date || '').slice(0, 10),
        std: bpFlightSeries?.std,
        sta: bpFlightSeries?.sta,
        seatNumber: bp.seat_number,
        fareAmount: Number(bp.fare_amount || 0),
        paymentMethod: finalBooking.payment_method,
      }).catch(err => console.error(`❌ [BookingsService] Failed to send ticket email to ${passenger.email}:`, err));
    }

    return finalBooking;
  }

  private async generateEntryNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    // Find the latest entry number for today
    const latestEntry = await this.journalEntryRepository.findOne({
      where: {
        entry_number: Like(`JE-${datePrefix}-%`),
      },
      order: { entry_number: 'DESC' },
    });
    
    let sequence = 1;
    if (latestEntry) {
      const parts = latestEntry.entry_number.split('-');
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2] || '0');
        sequence = lastSequence + 1;
      }
    }
    
    return `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
  }

  private async createJournalEntryForBooking(
    booking: Booking,
    flightSeries: FlightSeries,
    totalAmount: number,
    paymentAccountId: number,
    bookingDate: string,
    agencyId?: number | null
  ): Promise<void> {
    console.log('📝 [BookingsService] ==========================================');
    console.log('📝 [BookingsService] Starting journal entry creation for booking');
    console.log(`📝 [BookingsService] Booking Reference: ${booking.booking_reference}`);
    console.log(`📝 [BookingsService] Booking ID: ${booking.id}`);
    console.log(`📝 [BookingsService] Payment Account ID: ${paymentAccountId}`);
    console.log(`📝 [BookingsService] Total Amount: ${totalAmount}`);
    console.log(`📝 [BookingsService] Booking Date: ${bookingDate}`);
    console.log(`📝 [BookingsService] Flight Series: ${flightSeries.flt}`);
    
    let queryRunner;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      console.log('📝 [BookingsService] Creating query runner...');
      await queryRunner.connect();
      console.log('✅ [BookingsService] Query runner connected');
      await queryRunner.startTransaction();
      console.log('✅ [BookingsService] Transaction started');
    } catch (error) {
      console.error(`❌ [BookingsService] Error setting up query runner:`, error);
      console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
      console.error(`❌ [BookingsService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }

    try {
      // Find Passenger Revenue account (preferred) for booking revenue.
      // Fallback: Sales Revenue. We do NOT want fixed-asset accounts here.
      console.log('📝 [BookingsService] Looking for Passenger Revenue account...');
      let revenueAccount: ChartOfAccount | null = null;

      // Fetch all accounts once — reused below both for revenue-account name matching
      // AND for the payment-account lookup, so we don't issue 2-3 more sequential
      // queries against the same small table for something already in memory.
      console.log('📝 [BookingsService] Fetching chart of accounts for revenue matching...');
      const allAccounts = await queryRunner.manager.find(ChartOfAccount);
      console.log(`📝 [BookingsService] Found ${allAccounts.length} total accounts in chart_of_accounts`);

      try {
        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

        // 1) Prefer exact "Passenger Revenue"
        revenueAccount = allAccounts.find(acc => normalize(acc.name) === 'passenger revenue') || null;
        
        if (revenueAccount) {
          console.log(`✅ [BookingsService] Found "Passenger Revenue" account: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
        } else {
          // 2) Partial keyword match for passenger revenue
          revenueAccount =
            allAccounts.find(acc => normalize(acc.name).includes('passenger revenue')) ||
            allAccounts.find(acc => normalize(acc.name).includes('passenger') && normalize(acc.name).includes('revenue')) ||
            null;

          if (revenueAccount) console.log(`✅ [BookingsService] Found Passenger Revenue account (keyword match): ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
        }

        // 3) Fallback to "Sales Revenue"
        if (!revenueAccount) {
          revenueAccount = allAccounts.find(acc => normalize(acc.name) === 'sales revenue') || null;
          if (revenueAccount) console.log(`✅ [BookingsService] Found "Sales Revenue" account: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
        }

        if (!revenueAccount) {
          revenueAccount =
            allAccounts.find(acc => normalize(acc.name).includes('sales revenue')) ||
            allAccounts.find(acc => normalize(acc.name).includes('revenue')) ||
            allAccounts.find(acc => normalize(acc.name).includes('income')) ||
            null;
          if (revenueAccount) console.log(`✅ [BookingsService] Found revenue account (fallback keyword match): ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error searching for revenue account by name:`, error);
      }
      
      if (!revenueAccount) {
        console.error(`❌ [BookingsService] Revenue account not found. Sample accounts:`,
          allAccounts.slice(0, 10).map(a => ({ id: a.id, name: a.name, type: a.account_type }))
        );
        const errorMsg = 'Passenger Revenue account not found. Please create a "Passenger Revenue" (or "Sales Revenue") account in chart of accounts.';
        console.error(`❌ [BookingsService] ${errorMsg}`);
        throw new Error(errorMsg);
      }

       console.log(`✅ [BookingsService] Revenue account selected: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}, ID: ${revenueAccount.id}`);

       // Find payment account — reuse the already-fetched allAccounts list instead of
       // issuing 2-3 more sequential queries against the same table for one row we
       // already have in memory.
       console.log(`📝 [BookingsService] Looking for payment account with ID ${paymentAccountId}...`);
       const paymentAccount = allAccounts.find(a => a.id === paymentAccountId) || null;

      if (!paymentAccount) {
        console.error(`❌ [BookingsService] Payment account with ID ${paymentAccountId} not found in chart_of_accounts`);
        const errorMsg = `Payment account with ID ${paymentAccountId} not found in chart_of_accounts`;
        throw new Error(errorMsg);
      }
      console.log(`📝 [BookingsService] Payment account search result: Found: ${paymentAccount.name} (type: ${paymentAccount.account_type})`);
      
       console.log(`✅ [BookingsService] Payment account found: ${paymentAccount.name} (${paymentAccount.code}), Type: ${paymentAccount.account_type}, ID: ${paymentAccount.id}`);
       
       // Display all accounts that will be affected
       console.log(`📊 [BookingsService] ==========================================`);
       console.log(`📊 [BookingsService] JOURNAL ENTRY - ACCOUNTS TO BE AFFECTED:`);
       console.log(`📊 [BookingsService] ==========================================`);
       console.log(`📊 [BookingsService] DEBIT SIDE (Payment):`);
       console.log(`   - Account: ${paymentAccount.name}`);
       console.log(`   - Code: ${paymentAccount.code}`);
       console.log(`   - ID: ${paymentAccount.id}`);
       console.log(`   - Type: ${paymentAccount.account_type}`);
       console.log(`   - Amount: ${totalAmount} (DEBIT)`);
       console.log(`📊 [BookingsService] CREDIT SIDE (Passenger Revenue):`);
       console.log(`   - Account: ${revenueAccount.name}`);
       console.log(`   - Code: ${revenueAccount.code}`);
       console.log(`   - ID: ${revenueAccount.id}`);
       console.log(`   - Type: ${revenueAccount.account_type}`);
       console.log(`   - Amount: ${totalAmount} (CREDIT)`);
       console.log(`📊 [BookingsService] ==========================================`);
       
       // Generate entry number
      console.log('📝 [BookingsService] Generating entry number...');
      let entryNumber: string;
      try {
        entryNumber = await this.generateEntryNumber();
        console.log(`✅ [BookingsService] Generated entry number: ${entryNumber}`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error generating entry number:`, error);
        throw error;
      }
      
      // Create journal entry
      console.log('📝 [BookingsService] Creating journal entry record...');
      let journalEntry;
      try {
        journalEntry = queryRunner.manager.create(JournalEntry, {
          entry_number: entryNumber,
          entry_date: new Date(bookingDate),
          reference: booking.booking_reference,
          description: `Booking revenue - ${flightSeries.flt}${agencyId ? ` (Agency ID: ${agencyId})` : ''}`,
          total_debit: totalAmount,
          total_credit: totalAmount,
          status: 'posted',
          created_by: 1,
        });
        console.log(`📝 [BookingsService] Journal entry object created:`, {
          entry_number: journalEntry.entry_number,
          entry_date: journalEntry.entry_date,
          reference: journalEntry.reference,
          total_debit: journalEntry.total_debit,
          total_credit: journalEntry.total_credit,
        });
      } catch (error) {
        console.error(`❌ [BookingsService] Error creating journal entry object:`, error);
        throw error;
      }
      
      let savedJournalEntry;
      try {
        console.log(`📝 [BookingsService] Attempting to save journal entry to journal_entries table...`);
        savedJournalEntry = await queryRunner.manager.save(JournalEntry, journalEntry);
        console.log(`✅ [BookingsService] Journal entry saved to journal_entries table:`);
        console.log(`   - ID: ${savedJournalEntry.id}`);
        console.log(`   - Entry Number: ${savedJournalEntry.entry_number}`);
        console.log(`   - Entry Date: ${savedJournalEntry.entry_date}`);
        console.log(`   - Total Debit: ${savedJournalEntry.total_debit}`);
        console.log(`   - Total Credit: ${savedJournalEntry.total_credit}`);
        console.log(`   - Status: ${savedJournalEntry.status}`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error saving journal entry to database:`, error);
        console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
        console.error(`❌ [BookingsService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
        throw error;
      }
      
      // Create journal entry lines
      console.log('📝 [BookingsService] Creating journal entry lines...');
      
      // Debit line: Payment account (Cash/Bank)
      console.log(`📝 [BookingsService] Creating debit line: Account ${paymentAccount.name} (ID: ${paymentAccount.id}), Amount: ${totalAmount}`);
      let debitLine;
      try {
        debitLine = queryRunner.manager.create(JournalEntryLine, {
          journal_entry_id: savedJournalEntry.id,
          account_id: paymentAccount.id,
          debit_amount: totalAmount,
          credit_amount: 0,
          description: `Payment received via ${paymentAccount.name} - ${booking.booking_reference}`,
        });
        console.log(`✅ [BookingsService] Debit line object created`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error creating debit line object:`, error);
        throw error;
      }
      
      // Credit line: Passenger Revenue account
      console.log(`📝 [BookingsService] Creating credit line: Account ${revenueAccount.name} (ID: ${revenueAccount.id}), Amount: ${totalAmount}`);
      let creditLine;
      try {
        creditLine = queryRunner.manager.create(JournalEntryLine, {
          journal_entry_id: savedJournalEntry.id,
          account_id: revenueAccount.id,
          debit_amount: 0,
          credit_amount: totalAmount,
          description: `Passenger revenue - ${flightSeries.flt} - ${booking.booking_reference}`,
        });
        console.log(`✅ [BookingsService] Credit line object created`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error creating credit line object:`, error);
        throw error;
      }
      
      let savedLines;
      try {
        console.log(`📝 [BookingsService] Saving journal entry lines to journal_entry_lines table...`);
        console.log(`📝 [BookingsService] Debit line data:`, {
          journal_entry_id: debitLine.journal_entry_id,
          account_id: debitLine.account_id,
          debit_amount: debitLine.debit_amount,
          credit_amount: debitLine.credit_amount,
        });
        console.log(`📝 [BookingsService] Credit line data:`, {
          journal_entry_id: creditLine.journal_entry_id,
          account_id: creditLine.account_id,
          debit_amount: creditLine.debit_amount,
          credit_amount: creditLine.credit_amount,
        });
        
        savedLines = await queryRunner.manager.save(JournalEntryLine, [debitLine, creditLine]);
        console.log(`✅ [BookingsService] Journal entry lines saved to journal_entry_lines table:`);
        console.log(`   - Debit line ID: ${savedLines[0].id}, Journal Entry ID: ${savedLines[0].journal_entry_id}, Account ID: ${savedLines[0].account_id}, Account: ${paymentAccount.name}, Debit Amount: ${savedLines[0].debit_amount}`);
        console.log(`   - Credit line ID: ${savedLines[1].id}, Journal Entry ID: ${savedLines[1].journal_entry_id}, Account ID: ${savedLines[1].account_id}, Account: ${revenueAccount.name}, Credit Amount: ${savedLines[1].credit_amount}`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error saving journal entry lines to database:`, error);
        console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
        console.error(`❌ [BookingsService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
        throw error;
      }
      
      try {
        console.log(`📝 [BookingsService] Committing transaction...`);
        await queryRunner.commitTransaction();
        console.log(`✅ [BookingsService] Transaction committed successfully`);
        console.log(`✅ [BookingsService] Journal entry ${savedJournalEntry.entry_number} completed successfully`);
        console.log('📝 [BookingsService] ==========================================');
      } catch (error) {
        console.error(`❌ [BookingsService] Error committing transaction:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`❌ [BookingsService] ==========================================`);
      console.error(`❌ [BookingsService] ERROR in journal entry creation:`);
      console.error(`❌ [BookingsService] Error type:`, error?.constructor?.name || typeof error);
      console.error(`❌ [BookingsService] Error message:`, error instanceof Error ? error.message : String(error));
      console.error(`❌ [BookingsService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
      console.error(`❌ [BookingsService] Full error object:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      try {
        console.log(`📝 [BookingsService] Rolling back transaction...`);
        await queryRunner.rollbackTransaction();
        console.log(`✅ [BookingsService] Transaction rolled back`);
      } catch (rollbackError) {
        console.error(`❌ [BookingsService] Error during rollback:`, rollbackError);
      }
      
      // Re-throw the error so it can be logged by the caller
      throw error;
    } finally {
      try {
        console.log(`📝 [BookingsService] Releasing query runner...`);
        await queryRunner.release();
        console.log(`✅ [BookingsService] Query runner released`);
      } catch (releaseError) {
        console.error(`❌ [BookingsService] Error releasing query runner:`, releaseError);
      }
    }
  }

  // Country taxes collected on bookings are owed to the Tanzania Airport Authority,
  // modeled here as supplier #2 — every country-tax posting also credits their
  // supplier ledger and running balance, not just the chart-of-accounts.
  private static readonly COUNTRY_TAX_SUPPLIER_ID = 2;

  // Posts each applicable country_taxes row for the flight's departure (origin)
  // country as its OWN separate journal entry (own entry_number, own debit/credit
  // lines, own supplier ledger posting) — rather than combining all rows into one
  // entry — so "Airport Taxes", "Passenger Facilitation Fees", and "Carrier
  // Charges" each show up as their own distinct, traceable transaction. No-op if
  // the origin has no country_id or no tax rows.
  // Origin, not destination: the configured rows are departure/embarkation taxes
  // owed to the Tanzania Airport Authority — charged when departing Tanzania,
  // regardless of where the flight lands.
  private async postCountryTaxesForBooking(
    booking: Booking,
    flightSeries: FlightSeries,
    passengerCount: number,
    paymentAccountId: number,
    bookingDate: string,
  ): Promise<void> {
    const countryId = flightSeries.fromDestination?.country_id;
    if (!countryId) {
      console.log('📝 [BookingsService] Origin destination has no country_id — skipping country tax posting');
      return;
    }

    const taxRows = await this.countryTaxRepository.find({
      where: { country_id: countryId },
      relations: ['account'],
    });
    if (taxRows.length === 0) {
      console.log(`📝 [BookingsService] No country_taxes rows for country ${countryId} — skipping`);
      return;
    }

    const paymentAccount = await this.chartOfAccountRepository.findOne({ where: { id: paymentAccountId } });
    if (!paymentAccount) {
      console.warn(`⚠️ [BookingsService] Payment account ${paymentAccountId} not found — skipping country tax posting`);
      return;
    }

    // Each tax row can carry its own account — only post rows whose account
    // actually resolved (relation load failures shouldn't silently post to account_id 0).
    const validRows = taxRows.filter(t => !!t.account);
    if (validRows.length === 0) {
      console.warn(`⚠️ [BookingsService] Country ${countryId} has tax rows but none resolved a valid account — skipping`);
      return;
    }

    // Posted sequentially (not Promise.all) — generateEntryNumber() reads the
    // latest committed entry_number, so each row must fully commit before the
    // next one asks for its number, or two rows could compute the same number.
    for (const taxRow of validRows) {
      const amount = Number(taxRow.amount) * passengerCount;
      if (amount <= 0) continue;
      try {
        await this.postSingleCountryTax(booking, flightSeries, taxRow, amount, passengerCount, paymentAccount, bookingDate);
      } catch (err) {
        console.warn(`⚠️ [BookingsService] Failed to post country tax row ${taxRow.id} (${taxRow.account?.name}):`, err instanceof Error ? err.message : String(err));
      }
    }
  }

  private async postSingleCountryTax(
    booking: Booking,
    flightSeries: FlightSeries,
    taxRow: CountryTax,
    amount: number,
    passengerCount: number,
    paymentAccount: ChartOfAccount,
    bookingDate: string,
  ): Promise<void> {
    const taxAccount = taxRow.account!;
    const countryName = flightSeries.fromDestination?.country?.name || `country #${taxRow.country_id}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entryNumber = await this.generateEntryNumber();
      const journalEntry = queryRunner.manager.create(JournalEntry, {
        entry_number: entryNumber,
        entry_date: new Date(bookingDate),
        reference: booking.booking_reference,
        description: `${taxAccount.name} (${countryName}) — ${flightSeries.flt} — ${booking.booking_reference}`,
        total_debit: amount,
        total_credit: amount,
        status: 'posted',
        created_by: 1,
      });
      const savedEntry = await queryRunner.manager.save(JournalEntry, journalEntry);

      const debitLine = queryRunner.manager.create(JournalEntryLine, {
        journal_entry_id: savedEntry.id,
        account_id: paymentAccount.id,
        debit_amount: amount,
        credit_amount: 0,
        description: `${taxAccount.name} collected via ${paymentAccount.name} — ${booking.booking_reference}`,
      });
      const creditLine = queryRunner.manager.create(JournalEntryLine, {
        journal_entry_id: savedEntry.id,
        account_id: taxAccount.id,
        debit_amount: 0,
        credit_amount: amount,
        description: `${taxAccount.name} — ${passengerCount} pax × ${Number(taxRow.amount).toFixed(2)} ${taxRow.currency} — ${booking.booking_reference}`,
      });
      await queryRunner.manager.save(JournalEntryLine, [debitLine, creditLine]);

      // Credit the Tanzania Airport Authority's supplier ledger for this same tax
      // row's amount — this is money collected from the passenger but owed onward.
      const supplier = await queryRunner.manager.findOne(Supplier, {
        where: { id: BookingsService.COUNTRY_TAX_SUPPLIER_ID },
      });
      if (supplier) {
        const latestLedger = await queryRunner.manager.findOne(SupplierLedger, {
          where: { supplierId: supplier.id },
          order: { date: 'DESC', createdAt: 'DESC' },
        });
        const currentBalance = latestLedger ? Number(latestLedger.runningBalance) : Number(supplier.balance || 0);
        const updatedBalance = currentBalance + amount;

        const ledgerEntry = queryRunner.manager.create(SupplierLedger, {
          supplierId: supplier.id,
          date: new Date(bookingDate),
          description: `${taxAccount.name} — ${flightSeries.flt} — ${booking.booking_reference}`,
          debit: 0,
          credit: amount,
          runningBalance: updatedBalance,
          referenceType: 'BOOKING_COUNTRY_TAX',
          referenceId: savedEntry.id,
        });
        await queryRunner.manager.save(SupplierLedger, ledgerEntry);

        supplier.balance = updatedBalance;
        await queryRunner.manager.save(Supplier, supplier);
        console.log(`✅ [BookingsService] Supplier ${supplier.company_name} ledger/balance updated: ${currentBalance} -> ${updatedBalance} (${taxAccount.name})`);
      } else {
        console.warn(`⚠️ [BookingsService] Supplier #${BookingsService.COUNTRY_TAX_SUPPLIER_ID} not found — skipping supplier ledger update`);
      }

      await queryRunner.commitTransaction();
      console.log(`✅ [BookingsService] Country tax journal entry ${entryNumber} posted (${taxAccount.name}, ${amount})`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 50, agentId?: number): Promise<{ bookings: Booking[], total: number }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: agentId ? { agent_id: agentId } : {},
      relations: [
        'flightSeries',
        'flightSeries.fromDestination',
        'flightSeries.toDestination',
        'flightSeries.viaDestination',
        'returnFlightSeries',
        'returnFlightSeries.fromDestination',
        'returnFlightSeries.toDestination',
        'passenger',
        'bookingPassengers',
        'bookingPassengers.passenger',
        'bookingPassengers.flightSeries',
        'bookingPassengers.flightSeries.fromDestination',
        'bookingPassengers.flightSeries.toDestination',
        'bookingPassengers.flight',
      ],
      order: { booking_date: 'DESC', created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return { bookings, total };
  }

  // Adds a child/infant to an existing booking — new passenger + booking_passenger row(s)
  // (one per leg for return trips), and rolls the fare into the booking's total_amount.
  async addPassengerToBooking(bookingId: number, dto: AddBookingPassengerDto): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['flightSeries', 'returnFlightSeries', 'bookingPassengers'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    if (!booking.flightSeries) {
      throw new BadRequestException(`Booking ${bookingId} has no flight series`);
    }

    // Reuse an existing passenger matched by id_type + identification, else create new
    let passenger: Passenger | null = null;
    if (dto.id_type && dto.identification) {
      passenger = await this.passengerRepository.findOne({
        where: { id_type: dto.id_type, identification: dto.identification },
      });
    }
    if (!passenger) {
      passenger = await this.passengersService.create({
        name: dto.name,
        email: dto.email || null,
        contact: dto.contact || null,
        nationality: dto.nationality || null,
        id_type: dto.id_type || null,
        identification: dto.identification || null,
        age: dto.age ?? null,
        title: dto.title || null,
        guardian_passenger_id: dto.guardian_passenger_id ?? null,
      });
    } else if (dto.guardian_passenger_id !== undefined && passenger.guardian_passenger_id !== dto.guardian_passenger_id) {
      passenger.guardian_passenger_id = dto.guardian_passenger_id ?? null;
      passenger = await this.passengerRepository.save(passenger);
    }

    // Dependents added after the original booking are not separately charged — fare stays 0.
    const isReturnTrip = !!booking.is_return_trip;

    const existingOutbound = booking.bookingPassengers?.find(bp => bp.leg === 'outbound');
    const outboundFare = 0;
    const outboundBp = this.bookingPassengerRepository.create({
      booking_id:       booking.id,
      passenger_id:     passenger.id,
      flight_series_id: booking.flight_series_id,
      flight_id:        existingOutbound?.flight_id ?? booking.flight_id ?? null,
      departure_id:     existingOutbound?.departure_id ?? null,
      destination_id:   existingOutbound?.destination_id ?? null,
      passenger_type:   dto.passenger_type,
      fare_amount:      outboundFare,
      travel_date:      existingOutbound?.travel_date ?? null,
      leg:              'outbound',
    });
    await this.bookingPassengerRepository.save(outboundBp);

    let returnFare = 0;
    if (isReturnTrip) {
      const existingReturn = booking.bookingPassengers?.find(bp => bp.leg === 'return');
      const returnBp = this.bookingPassengerRepository.create({
        booking_id:       booking.id,
        passenger_id:     passenger.id,
        flight_series_id: booking.return_flight_series_id ?? booking.flight_series_id,
        flight_id:        existingReturn?.flight_id ?? null,
        passenger_type:   dto.passenger_type,
        fare_amount:      returnFare,
        travel_date:      existingReturn?.travel_date ?? booking.return_date ?? null,
        leg:              'return',
      });
      await this.bookingPassengerRepository.save(returnBp);
    }

    booking.number_of_passengers = (booking.number_of_passengers || 0) + 1;
    booking.total_amount = Number(booking.total_amount) + outboundFare + returnFare;
    await this.bookingRepository.save(booking);

    return this.findOne(bookingId);
  }

  // Cancels a ticket and refunds the passenger — refund_amount is staff-editable
  // (defaults to 80% of the fare on the frontend, but enforced here only to be ≤ the fare).
  async cancelAndRefund(bpId: number, dto: CancelRefundDto, staffId: number | null): Promise<BookingPassenger> {
    const bp = await this.bookingPassengerRepository.findOne({
      where: { id: bpId },
      relations: ['booking', 'passenger', 'flight'],
    });
    if (!bp) throw new NotFoundException(`Booking passenger ${bpId} not found`);
    if (bp.ticket_status === 'REFUNDED' || bp.ticket_status === 'RESCHEDULED') {
      throw new BadRequestException(`Ticket is already ${bp.ticket_status.toLowerCase()}`);
    }

    const originalFare = Number(bp.fare_amount);
    const refundAmount = Number(dto.refund_amount);
    if (refundAmount > originalFare) {
      throw new BadRequestException(`Refund amount cannot exceed the fare (${originalFare.toFixed(2)})`);
    }

    bp.status = 'cancelled';
    bp.ticket_status = 'REFUNDED';
    bp.refund_amount = refundAmount;
    bp.cancellation_reason = dto.reason ?? null;
    bp.cancelled_at = new Date();
    bp.cancelled_by = staffId;
    await this.bookingPassengerRepository.save(bp);

    const booking = bp.booking;
    if (booking) {
      booking.total_amount = Math.max(0, Number(booking.total_amount) - refundAmount);
      await this.bookingRepository.save(booking);

      if (booking.agency_id && refundAmount > 0) {
        await this.creditAgencyBalance(
          booking.agency_id,
          refundAmount,
          `REFUND-BP${bp.id}`,
          `Ticket refund — ${bp.passenger?.name ?? 'passenger'} (${bp.flight?.flight_no ?? booking.booking_reference})`,
        ).catch(err => console.warn(`⚠️ [BookingsService] Agency credit failed for refund bp ${bp.id}:`, err?.message));
      }
    }

    if (refundAmount > 0) {
      await this.postSimpleJournalEntry(
        `Ticket refund — ${bp.passenger?.name ?? ''}`.trim(),
        booking?.payment_account ?? null,
        refundAmount,
        'refund',
      ).catch(err => console.warn(`⚠️ [BookingsService] Skipped refund journal entry for bp ${bp.id}:`, err?.message));
    }

    return (await this.bookingPassengerRepository.findOne({ where: { id: bp.id }, relations: ['passenger', 'flight', 'booking'] }))!;
  }

  // Cancels a ticket and rebooks the passenger onto a new flight — reschedule_fee is
  // staff-editable (defaults to 20% of the fare on the frontend) and is added to the new fare.
  async cancelAndReschedule(bpId: number, dto: CancelRescheduleDto, staffId: number | null): Promise<BookingPassenger> {
    const bp = await this.bookingPassengerRepository.findOne({
      where: { id: bpId },
      relations: ['booking', 'passenger', 'flight'],
    });
    if (!bp) throw new NotFoundException(`Booking passenger ${bpId} not found`);
    if (bp.ticket_status === 'REFUNDED' || bp.ticket_status === 'RESCHEDULED') {
      throw new BadRequestException(`Ticket is already ${bp.ticket_status.toLowerCase()}`);
    }

    const newFlight = await this.flightRepository.findOne({ where: { id: dto.new_flight_id } });
    if (!newFlight) throw new NotFoundException(`Flight ${dto.new_flight_id} not found`);

    const fee = Number(dto.reschedule_fee);
    const newFare = Number(bp.fare_amount) + fee;

    // Cancel the original first — this nulls its generated `active_leg` column, which
    // is required before inserting the replacement row (both share booking_id/passenger_id/leg,
    // and the unique index only allows one *active* row for that combination at a time).
    bp.status = 'cancelled';
    bp.ticket_status = 'RESCHEDULED';
    bp.reschedule_fee = fee;
    bp.cancellation_reason = dto.reason ?? null;
    bp.cancelled_at = new Date();
    bp.cancelled_by = staffId;
    await this.bookingPassengerRepository.save(bp);

    const newBp = this.bookingPassengerRepository.create({
      booking_id: bp.booking_id,
      passenger_id: bp.passenger_id,
      flight_series_id: newFlight.series_id,
      flight_id: newFlight.id,
      passenger_type: bp.passenger_type,
      fare_amount: newFare,
      travel_date: newFlight.flight_date,
      leg: bp.leg,
      status: 'confirmed',
      ticket_status: 'OPEN',
    });
    const savedNewBp = await this.bookingPassengerRepository.save(newBp);

    bp.rescheduled_to_id = savedNewBp.id;
    await this.bookingPassengerRepository.save(bp);

    const booking = bp.booking;
    if (booking) {
      booking.total_amount = Number(booking.total_amount) + fee;
      booking.booking_date = newFlight.flight_date as any;
      await this.bookingRepository.save(booking);

      if (booking.agency_id && fee > 0) {
        await this.debitAgencyBalance(
          booking.agency_id,
          fee,
          `RESCHEDULE-BP${bp.id}`,
          `Reschedule fee — ${bp.passenger?.name ?? 'passenger'} (${bp.flight?.flight_no ?? booking.booking_reference} → ${newFlight.flight_no})`,
        ).catch(err => console.warn(`⚠️ [BookingsService] Agency debit failed for reschedule bp ${bp.id}:`, err?.message));
      }
    }

    if (fee > 0) {
      await this.postSimpleJournalEntry(
        `Reschedule fee — ${bp.passenger?.name ?? ''}`.trim(),
        booking?.payment_account ?? null,
        fee,
        'fee',
      ).catch(err => console.warn(`⚠️ [BookingsService] Skipped reschedule journal entry for bp ${bp.id}:`, err?.message));
    }

    return (await this.bookingPassengerRepository.findOne({ where: { id: savedNewBp.id }, relations: ['passenger', 'flight', 'booking'] }))!;
  }

  // Increases an agency's balance (used when refunding a passenger whose booking was agency-billed).
  private async creditAgencyBalance(agencyId: number, amount: number, reference: string, description: string): Promise<void> {
    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) return;

    agency.balance = Number(agency.balance) + amount;
    await this.agencyRepository.save(agency);

    const latestLedger = await this.agencyLedgerRepository.findOne({
      where: { agencyId: agency.id },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
    const ledgerBalance = latestLedger ? Number(latestLedger.balance) : Number(agency.balance) - amount;

    const entry = this.agencyLedgerRepository.create({
      agencyId: agency.id,
      transactionDate: new Date(),
      description,
      debit: amount,
      credit: 0,
      balance: ledgerBalance + amount,
      reference,
    });
    await this.agencyLedgerRepository.save(entry);
  }

  // Decreases an agency's balance (used when charging a reschedule fee on an agency-billed booking).
  private async debitAgencyBalance(agencyId: number, amount: number, reference: string, description: string): Promise<void> {
    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) return;

    agency.balance = Number(agency.balance) - amount;
    await this.agencyRepository.save(agency);

    const latestLedger = await this.agencyLedgerRepository.findOne({
      where: { agencyId: agency.id },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
    const ledgerBalance = latestLedger ? Number(latestLedger.balance) : Number(agency.balance) + amount;

    const entry = this.agencyLedgerRepository.create({
      agencyId: agency.id,
      transactionDate: new Date(),
      description,
      debit: 0,
      credit: amount,
      balance: ledgerBalance - amount,
      reference,
    });
    await this.agencyLedgerRepository.save(entry);
  }

  // Best-effort GL posting for a refund or reschedule fee. Resolves the Passenger Revenue
  // account and (if resolvable by name) the original payment account; silently no-ops if
  // either can't be found, since this flow doesn't ask staff to pick a GL account.
  private async postSimpleJournalEntry(
    description: string,
    paymentAccountName: string | null,
    amount: number,
    kind: 'refund' | 'fee',
  ): Promise<void> {
    const allAccounts = await this.chartOfAccountRepository.find();
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

    // Refunds post against the dedicated "Passenger Refund" account (510017) rather than
    // reducing Passenger Revenue directly; reschedule fees are genuine new revenue.
    const revenueAccount = kind === 'refund'
      ? allAccounts.find(a => a.code === '510017')
      : allAccounts.find(a => normalize(a.name).includes('passenger revenue')) ?? allAccounts.find(a => normalize(a.name).includes('revenue'));

    const paymentAccount = paymentAccountName
      ? allAccounts.find(a => normalize(a.name) === normalize(paymentAccountName))
      : null;

    if (!revenueAccount) {
      console.warn(`⚠️ [BookingsService] Could not resolve ${kind === 'refund' ? 'Passenger Refund account (510017)' : 'Passenger Revenue account'} — skipping ${kind} journal entry`);
      return;
    }
    if (!paymentAccount) {
      console.warn(`⚠️ [BookingsService] Could not resolve payment account "${paymentAccountName}" — skipping ${kind} journal entry`);
      return;
    }

    const entryNumber = await this.generateEntryNumber();
    const journalEntry = await this.journalEntryRepository.save(
      this.journalEntryRepository.create({
        entry_number: entryNumber,
        entry_date: new Date(),
        reference: description,
        description,
        total_debit: amount,
        total_credit: amount,
        status: 'posted',
        created_by: 1,
      }),
    );

    // Refund: Passenger Refund account is debited, cash goes out (credit).
    // Reschedule fee: cash comes in (debit), Passenger Revenue goes up (credit).
    const revenueIsDebit = kind === 'refund';
    await this.journalEntryLineRepository.save([
      this.journalEntryLineRepository.create({
        journal_entry_id: journalEntry.id,
        account_id: revenueAccount.id,
        debit_amount: revenueIsDebit ? amount : 0,
        credit_amount: revenueIsDebit ? 0 : amount,
        description,
      }),
      this.journalEntryLineRepository.create({
        journal_entry_id: journalEntry.id,
        account_id: paymentAccount.id,
        debit_amount: revenueIsDebit ? 0 : amount,
        credit_amount: revenueIsDebit ? amount : 0,
        description,
      }),
    ]);
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'returnFlightSeries', 'returnFlightSeries.fromDestination', 'returnFlightSeries.toDestination', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger', 'bookingPassengers.flightSeries', 'bookingPassengers.flightSeries.fromDestination', 'bookingPassengers.flightSeries.toDestination']
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  // Returns all booking_passenger rows for a flight series with full passenger + booking details.
  async getPassengersByFlight(flightSeriesId: number): Promise<any[]> {
    const rows = await this.bookingPassengerRepository.find({
      where: { flight_series_id: flightSeriesId },
      relations: ['passenger', 'booking', 'booking.flightSeries',
                  'booking.flightSeries.fromDestination', 'booking.flightSeries.toDestination'],
      order: { travel_date: 'ASC' },
    })
    return rows.map(bp => ({
      id:             bp.id,
      booking_id:     bp.booking_id,
      booking_reference: (bp as any).booking?.booking_reference ?? null,
      payment_status:    (bp as any).booking?.payment_status    ?? null,
      flight_series_id:  bp.flight_series_id,
      passenger_id:   bp.passenger_id,
      passenger_type: bp.passenger_type,
      fare_amount:    Number(bp.fare_amount ?? 0),
      travel_date:    bp.travel_date ? String(bp.travel_date).slice(0, 10) : null,
      leg:            bp.leg,
      ticket_status:  bp.ticket_status ?? null,
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
        booking_status: (bp.passenger as any).booking_status ?? null,
      } : null,
    }))
  }

  async getPassengersByFlightId(flightId: number): Promise<any[]> {
    const rows = await this.bookingPassengerRepository.find({
      where: { flight_id: flightId },
      relations: ['passenger', 'booking', 'booking.flightSeries',
                  'booking.flightSeries.fromDestination', 'booking.flightSeries.toDestination'],
      order: { travel_date: 'ASC' },
    })
    return rows.map(bp => ({
      id:                bp.id,
      booking_id:        bp.booking_id,
      booking_reference: (bp as any).booking?.booking_reference ?? null,
      payment_status:    (bp as any).booking?.payment_status    ?? null,
      flight_series_id:  bp.flight_series_id,
      flight_id:         bp.flight_id,
      passenger_id:      bp.passenger_id,
      passenger_type:    bp.passenger_type,
      fare_amount:       Number(bp.fare_amount ?? 0),
      travel_date:       bp.travel_date ? String(bp.travel_date).slice(0, 10) : null,
      leg:               bp.leg,
      ticket_status:     bp.ticket_status ?? null,
      payment_reference: bp.payment_reference ?? null,
      payment_account:   bp.payment_account   ?? null,
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
        booking_status: (bp.passenger as any).booking_status ?? null,
      } : null,
    }))
  }

  // Returns { "2024-01-15": 3, "2024-01-22": 2 } — booked seat count per date for a flight series.
  // Only counts paid bookings. Source of truth for calendar seat availability.
  async getBookedSeatCounts(flightSeriesId: number): Promise<Record<string, number>> {
    // Use raw SQL with DATE_FORMAT to guarantee "YYYY-MM-DD" string keys regardless of
    // how the MySQL/MariaDB driver returns DATE column values (Date object vs string).
    const rows: { d: string; cnt: string }[] = await this.bookingPassengerRepository.query(
      `SELECT DATE_FORMAT(bp.travel_date, '%Y-%m-%d') AS d, COUNT(bp.id) AS cnt
       FROM booking_passengers bp
       INNER JOIN bookings b ON b.id = bp.booking_id
       WHERE bp.flight_series_id = ?
         AND b.payment_status = 'paid'
         AND bp.travel_date IS NOT NULL
       GROUP BY bp.travel_date`,
      [flightSeriesId],
    )

    const result: Record<string, number> = {}
    for (const row of rows) {
      if (row.d) result[row.d] = Number(row.cnt)
    }
    console.log(`📊 [BookingsService] seat-counts for fs=${flightSeriesId}:`, result)
    return result
  }

  private generateBookingReference(): string {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async updateBookingPassengerStatus(id: number, status: string, updatedBy?: number | null): Promise<any> {
    const bp = await this.bookingPassengerRepository.findOneOrFail({ where: { id } });
    bp.status = status;
    if (status === 'CHECK IN') {
      bp.checked_in_at = new Date();
    }
    if (status === 'Boarded') {
      bp.boarded_at = new Date();
    }
    if (updatedBy !== undefined) {
      bp.checkin_by = updatedBy ?? null;
    }
    return this.bookingPassengerRepository.save(bp);
  }

  async assignSeat(id: number, seatNumber: string | null, isComplimentary?: boolean): Promise<any> {
    const bp = await this.bookingPassengerRepository.findOneOrFail({ where: { id } });
    const seat = seatNumber?.trim().toUpperCase() || null;

    // "FREE" is a sentinel for a complimentary seat with no specific number
    // assigned — not a real seat, so multiple passengers can share it without
    // tripping the uniqueness clash check below.
    if (seat && seat !== 'FREE' && bp.flight_id) {
      const clash = await this.bookingPassengerRepository.findOne({
        where: { flight_id: bp.flight_id, seat_number: seat },
      });
      if (clash && clash.id !== bp.id && clash.ticket_status !== 'REFUNDED' && clash.ticket_status !== 'RESCHEDULED') {
        throw new BadRequestException(`Seat ${seat} is already assigned to another passenger on this flight`);
      }
    }

    bp.seat_number = seat;
    if (isComplimentary !== undefined) {
      bp.is_complimentary_seat = isComplimentary;
    }
    return this.bookingPassengerRepository.save(bp);
  }
}

