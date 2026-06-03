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
import { CreateBookingDto, PassengerDto } from './dto/create-booking.dto';
import { PassengersService } from '../passengers/passengers.service';

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
    private passengersService: PassengersService,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    console.log('🎫 [BookingsService] Creating new booking:', createBookingDto);
    
    // Verify flight series exists
    const flightSeries = await this.flightSeriesRepository.findOne({
      where: { id: createBookingDto.flight_series_id }
    });
    
    if (!flightSeries) {
      throw new NotFoundException(`Flight series with ID ${createBookingDto.flight_series_id} not found`);
    }

    if (!createBookingDto.passengers || createBookingDto.passengers.length === 0) {
      throw new BadRequestException('At least one passenger is required');
    }

    // Create all passengers first
    const createdPassengers: Passenger[] = []
    let totalAmount = 0
    let farePerPassenger = 0
    const isReturnTrip = !!createBookingDto.is_return_trip
    console.log(`✈️ [BookingsService] is_return_trip=${createBookingDto.is_return_trip} → isReturnTrip=${isReturnTrip}, flight=${flightSeries.flt}, adult_fare=${flightSeries.adult_fare}, adult_return_fare=${flightSeries.adult_return_fare}`)

    for (const passengerDto of createBookingDto.passengers) {
      // Calculate fare based on passenger type
      // For return trips: use adult_return_fare ÷ 2 per leg (each leg gets half the round-trip fare)
      let fare = 0
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
      totalAmount += fare
      farePerPassenger = fare

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
          title:          passengerDto.title          || null,
        })
        console.log(`✅ [BookingsService] Created new passenger ${passenger.id} with PNR: ${passenger.pnr}`)
      }

      createdPassengers.push(passenger)
      console.log(`✅ [BookingsService] Using passenger ${passenger.id} (${passenger.pnr}) for booking`)
    }

    // Use first passenger as primary passenger for booking record
    const primaryPassenger = createdPassengers[0]

    // Generate unique booking reference
    const bookingReference = this.generateBookingReference()

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
      is_return_trip: isReturnTrip,
      return_date: isReturnTrip ? (createBookingDto.return_date ?? null) : null,
      return_flight_series_id: isReturnTrip ? (createBookingDto.return_flight_series_id ?? null) : null,
      flight_id: createBookingDto.flight_id ?? null,
    });
    
    console.log(`💳 [BookingsService] Saving booking — method=${createBookingDto.payment_method} ref=${createBookingDto.payment_reference ?? 'null'} account=${createBookingDto.payment_account ?? 'null'}`)
    const savedBooking = await this.bookingRepository.save(booking);
    console.log(`✅ [BookingsService] Booking saved: id=${savedBooking.id} ref=${savedBooking.booking_reference} payment_ref=${savedBooking.payment_reference ?? 'null'} payment_acc=${savedBooking.payment_account ?? 'null'}`);
    console.log(`✅ [BookingsService] Created ${createdPassengers.length} passengers for booking`);
    
    // Create booking_passengers records — one row per passenger per leg
    const outboundDate = createBookingDto.travel_date ?? createBookingDto.booking_date ?? null
    const returnDate   = isReturnTrip ? (createBookingDto.return_date ?? null) : null
    const returnFsId   = isReturnTrip ? (createBookingDto.return_flight_series_id ?? createBookingDto.flight_series_id) : null

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

    const outboundFlightId = createBookingDto.flight_id
      ?? await lookupFlightId(createBookingDto.flight_series_id, outboundDate)
    const returnFlightId = isReturnTrip
      ? (createBookingDto.return_flight_id ?? await lookupFlightId(returnFsId, returnDate))
      : null
    console.log(`✈️ [BookingsService] flight_id: outbound=${outboundFlightId}, return=${returnFlightId}`)

    const bookingPassengerRecords: BookingPassenger[] = []
    for (let i = 0; i < createdPassengers.length; i++) {
      const passenger = createdPassengers[i]
      const passengerDto = createBookingDto.passengers[i]

      let fare = 0
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

      // Outbound leg
      const outboundBp = this.bookingPassengerRepository.create({
        booking_id:        savedBooking.id,
        passenger_id:      passenger.id,
        flight_series_id:  createBookingDto.flight_series_id,
        flight_id:         outboundFlightId,
        passenger_type:    passengerDto.passenger_type,
        fare_amount:       fare,
        travel_date:       outboundDate,
        leg:               'outbound',
        payment_reference: createBookingDto.payment_reference ?? null,
        payment_account:   createBookingDto.payment_account   ?? null,
      })
      try {
        const saved = await this.bookingPassengerRepository.save(outboundBp)
        bookingPassengerRecords.push(saved)
        console.log(`✅ [BookingsService] Created outbound booking_passenger for pax ${passenger.id} (${passenger.pnr}), date=${outboundDate}, fs=${createBookingDto.flight_series_id}`)
      } catch (error) {
        console.error(`❌ [BookingsService] Error saving outbound booking_passenger for passenger ${passenger.id}:`, error)
        throw new BadRequestException(`Failed to link passenger ${passenger.name} to booking: ${error instanceof Error ? error.message : String(error)}`)
      }

      // Return leg — always created for return trips so both travel dates and flight
      // details are stored as separate rows in booking_passengers.
      if (isReturnTrip) {
        const retFsId = returnFsId ?? createBookingDto.flight_series_id
        console.log(`🔁 [BookingsService] Saving return booking_passenger: booking=${savedBooking.id}, pax=${passenger.id}, fs=${retFsId}, date=${returnDate ?? 'null'}`)
        const returnBp = this.bookingPassengerRepository.create({
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
        })
        try {
          const saved = await this.bookingPassengerRepository.save(returnBp)
          bookingPassengerRecords.push(saved)
          console.log(`✅ [BookingsService] Return booking_passenger saved: id=${saved.id}, pax=${passenger.id} (${passenger.pnr}), date=${returnDate ?? 'null'}, fs=${retFsId}`)
        } catch (error: any) {
          // Surface the real error — most likely cause is the old unique constraint
          // (booking_id, passenger_id) without the leg column.
          // Fix: ALTER TABLE booking_passengers DROP INDEX <old>, ADD UNIQUE KEY(booking_id, passenger_id, leg)
          console.error(`❌ [BookingsService] Return booking_passenger FAILED for pax ${passenger.id}: ${error?.message}`)
          console.error(`❌ SQL error code: ${error?.code}  errno: ${error?.errno}`)
          throw new BadRequestException(
            `Failed to save return leg for passenger ${passenger.name}: ${error?.message}. ` +
            `If this is a duplicate key error, run the DB migration to update the unique constraint on booking_passengers.`
          )
        }
      }
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
          await this.seatReservationRepository.save(seatReservation);
          console.log(`✅ [BookingsService] Updated seat reservation ${seatReservation.id} status to 'booked'`);

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
    
    // Reload with relations
    const bookingWithRelations = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'returnFlightSeries', 'returnFlightSeries.fromDestination', 'returnFlightSeries.toDestination', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger', 'bookingPassengers.flightSeries', 'bookingPassengers.flightSeries.fromDestination', 'bookingPassengers.flightSeries.toDestination']
    });
    
    return bookingWithRelations || savedBooking;
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
      
      try {
        // Fetch all accounts once and search by name keywords (case-insensitive)
        console.log('📝 [BookingsService] Fetching chart of accounts for revenue matching...');
        const allAccounts = await queryRunner.manager.find(ChartOfAccount);
        console.log(`📝 [BookingsService] Found ${allAccounts.length} total accounts in chart_of_accounts`);
        
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
        try {
          const sampleAccounts = await queryRunner.manager.find(ChartOfAccount, { take: 10 });
          console.error(`❌ [BookingsService] Revenue account not found. Sample accounts:`, 
            sampleAccounts.map(a => ({ id: a.id, name: a.name, type: a.account_type }))
          );
        } catch (error) {
          console.error(`❌ [BookingsService] Error fetching sample accounts:`, error);
        }
        const errorMsg = 'Passenger Revenue account not found. Please create a "Passenger Revenue" (or "Sales Revenue") account in chart of accounts.';
        console.error(`❌ [BookingsService] ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
       console.log(`✅ [BookingsService] Revenue account selected: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}, ID: ${revenueAccount.id}`);
       
       // Find payment account from chart_of_accounts
       console.log(`📝 [BookingsService] Looking for payment account with ID ${paymentAccountId}...`);
       let paymentAccount: ChartOfAccount | null = null;
      
      try {
        paymentAccount = await queryRunner.manager.findOne(ChartOfAccount, {
          where: { id: paymentAccountId, account_type: 9 },
        });
        console.log(`📝 [BookingsService] Payment account search (with type=9) result: ${paymentAccount ? `Found: ${paymentAccount.name}` : 'Not found'}`);
      } catch (error) {
        console.error(`❌ [BookingsService] Error searching for payment account with type=9:`, error);
        console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
      }
      
      // If not found with account_type = 9, try without the type restriction
      if (!paymentAccount) {
        try {
          console.log(`📝 [BookingsService] Payment account not found with account_type=9, trying without type restriction...`);
          paymentAccount = await queryRunner.manager.findOne(ChartOfAccount, {
            where: { id: paymentAccountId },
          });
          console.log(`📝 [BookingsService] Payment account search (without type) result: ${paymentAccount ? `Found: ${paymentAccount.name} (type: ${paymentAccount.account_type})` : 'Not found'}`);
        } catch (error) {
          console.error(`❌ [BookingsService] Error searching for payment account without type:`, error);
          console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
        }
      }
      
      if (!paymentAccount) {
        // Try to find all accounts with the given ID to see what's in the database
        try {
          const allAccountsWithId = await queryRunner.manager.find(ChartOfAccount, {
            where: { id: paymentAccountId },
          });
          console.error(`❌ [BookingsService] Payment account with ID ${paymentAccountId} not found. Accounts with this ID:`, allAccountsWithId);
        } catch (error) {
          console.error(`❌ [BookingsService] Error checking for accounts with ID ${paymentAccountId}:`, error);
        }
        const errorMsg = `Payment account with ID ${paymentAccountId} not found in chart_of_accounts`;
        console.error(`❌ [BookingsService] ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
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
        
        // Verify it was actually saved by querying it back
        const verifyEntry = await queryRunner.manager.findOne(JournalEntry, {
          where: { id: savedJournalEntry.id }
        });
        if (verifyEntry) {
          console.log(`✅ [BookingsService] Verified: Journal entry exists in database with ID ${verifyEntry.id}`);
        } else {
          console.error(`❌ [BookingsService] WARNING: Journal entry was not found after save!`);
        }
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
        
        // Verify lines were actually saved by querying them back
        const verifyLines = await queryRunner.manager.find(JournalEntryLine, {
          where: { journal_entry_id: savedJournalEntry.id }
        });
        console.log(`✅ [BookingsService] Verified: Found ${verifyLines.length} journal entry lines in database for journal entry ID ${savedJournalEntry.id}`);
        verifyLines.forEach((line, index) => {
          console.log(`   Line ${index + 1}: ID=${line.id}, Account ID=${line.account_id}, Debit=${line.debit_amount}, Credit=${line.credit_amount}`);
        });
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

  async findAll(page: number = 1, limit: number = 50): Promise<{ bookings: Booking[], total: number }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
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
      ],
      order: { booking_date: 'DESC', created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return { bookings, total };
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
}

