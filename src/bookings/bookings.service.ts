import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
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

      // Create passenger (PNR will be auto-generated)
      const passenger = await this.passengersService.create({
        name: passengerDto.name,
        email: passengerDto.email || null,
        contact: passengerDto.contact || null,
        nationality: passengerDto.nationality || null,
        id_type: passengerDto.id_type || null,
        identification: passengerDto.identification || null,
        age: passengerDto.age ? (typeof passengerDto.age === 'string' ? parseInt(passengerDto.age, 10) : passengerDto.age) : null,
        title: passengerDto.title || null
      })
      
      createdPassengers.push(passenger)
      console.log(`✅ [BookingsService] Created passenger ${passenger.id} with PNR: ${passenger.pnr}`)
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
      total_amount: totalAmount,
      payment_method: createBookingDto.payment_method,
      payment_status: createBookingDto.payment_status || 'pending',
      booking_date: new Date(createBookingDto.booking_date),
      notes: createBookingDto.notes ?? null,
      is_return_trip: isReturnTrip,
    });
    
    const savedBooking = await this.bookingRepository.save(booking);
    console.log(`✅ [BookingsService] Booking created with ID: ${savedBooking.id}, Reference: ${savedBooking.booking_reference}`);
    console.log(`✅ [BookingsService] Created ${createdPassengers.length} passengers for booking`);
    
    // Create booking_passengers records for all passengers
    const bookingPassengerRecords: BookingPassenger[] = []
    for (let i = 0; i < createdPassengers.length; i++) {
      const passenger = createdPassengers[i]
      const passengerDto = createBookingDto.passengers[i]
      
      // Calculate fare for this passenger (same logic as above — return trips get half)
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
      
      console.log(`🎫 [BookingsService] Creating booking_passenger record: booking_id=${savedBooking.id}, passenger_id=${passenger.id}, type=${passengerDto.passenger_type}, fare=${fare}`)
      
      const bookingPassenger = this.bookingPassengerRepository.create({
        booking_id: savedBooking.id,
        passenger_id: passenger.id,
        passenger_type: passengerDto.passenger_type,
        fare_amount: fare,
        travel_date: createBookingDto.travel_date ?? null,
      })
      
      try {
        const savedBookingPassenger = await this.bookingPassengerRepository.save(bookingPassenger)
        bookingPassengerRecords.push(savedBookingPassenger)
        console.log(`✅ [BookingsService] Linked passenger ${passenger.id} (${passenger.pnr}) to booking ${savedBooking.id}, booking_passenger ID: ${savedBookingPassenger.id}`)
      } catch (error) {
        console.error(`❌ [BookingsService] Error saving booking_passenger for passenger ${passenger.id}:`, error)
        console.error(`❌ [BookingsService] Error details:`, JSON.stringify(error, null, 2))
        // Re-throw to prevent booking from being created without passenger links
        throw new BadRequestException(`Failed to link passenger ${passenger.name} to booking: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    
    console.log(`✅ [BookingsService] Successfully created ${bookingPassengerRecords.length} booking_passenger records`)
    
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
          if (currentBalance < totalAmount) {
            throw new BadRequestException(
              `Insufficient agency balance. Agency "${agency.name}" has a balance of ${currentBalance.toFixed(2)}, but the booking amount is ${totalAmount.toFixed(2)}. Shortfall: ${(totalAmount - currentBalance).toFixed(2)}`
            );
          }
          
          // Deduct from agency balance
          const newBalance = currentBalance - totalAmount;
          agency.balance = newBalance;
          await this.agencyRepository.save(agency);
          
          // Get current ledger balance
          const latestLedger = await this.agencyLedgerRepository.findOne({
            where: { agencyId: agency.id },
            order: { transactionDate: 'DESC', createdAt: 'DESC' }
          });
          
          const currentLedgerBalance = latestLedger ? Number(latestLedger.balance) : currentBalance;
          const updatedLedgerBalance = currentLedgerBalance - totalAmount;
          
          // Create ledger entry
          const ledgerEntry = this.agencyLedgerRepository.create({
            agencyId: agency.id,
            transactionDate: new Date(createBookingDto.booking_date),
            description: `Booking payment - ${savedBooking.booking_reference}`,
            debit: 0,
            credit: totalAmount,
            balance: updatedLedgerBalance,
            reference: savedBooking.booking_reference
          });
          
          await this.agencyLedgerRepository.save(ledgerEntry);
          console.log(`✅ [BookingsService] Deducted ${totalAmount} from agency ${agency.name}. New balance: ${newBalance}`);
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error deducting from agency balance:`, error);
        // Re-throw if it's a BadRequestException, otherwise log and continue
        if (error instanceof BadRequestException) {
          throw error;
        }
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
        } else {
          console.warn(`⚠️ [BookingsService] Seat reservation ${createBookingDto.seat_reservation_id} not found`);
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error updating seat reservation status:`, error);
        // Don't throw - booking is already created successfully
      }
    }
    
    // Reload with relations
    const bookingWithRelations = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger']
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
        'passenger',
        'bookingPassengers',
        'bookingPassengers.passenger',
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
      relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger']
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  private generateBookingReference(): string {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}

