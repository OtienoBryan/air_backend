"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const flight_entity_1 = require("../entities/flight.entity");
const passenger_entity_1 = require("../entities/passenger.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const seat_reservation_entity_1 = require("../entities/seat-reservation.entity");
const agency_entity_1 = require("../entities/agency.entity");
const agency_ledger_entity_1 = require("../entities/agency-ledger.entity");
const journal_entry_entity_1 = require("../entities/journal-entry.entity");
const journal_entry_line_entity_1 = require("../entities/journal-entry-line.entity");
const chart_of_account_entity_1 = require("../entities/chart-of-account.entity");
const passengers_service_1 = require("../passengers/passengers.service");
const mail_service_1 = require("../mail/mail.service");
let BookingsService = class BookingsService {
    bookingRepository;
    flightSeriesRepository;
    flightRepository;
    passengerRepository;
    bookingPassengerRepository;
    seatReservationRepository;
    agencyRepository;
    agencyLedgerRepository;
    journalEntryRepository;
    journalEntryLineRepository;
    chartOfAccountRepository;
    passengersService;
    dataSource;
    mailService;
    constructor(bookingRepository, flightSeriesRepository, flightRepository, passengerRepository, bookingPassengerRepository, seatReservationRepository, agencyRepository, agencyLedgerRepository, journalEntryRepository, journalEntryLineRepository, chartOfAccountRepository, passengersService, dataSource, mailService) {
        this.bookingRepository = bookingRepository;
        this.flightSeriesRepository = flightSeriesRepository;
        this.flightRepository = flightRepository;
        this.passengerRepository = passengerRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
        this.seatReservationRepository = seatReservationRepository;
        this.agencyRepository = agencyRepository;
        this.agencyLedgerRepository = agencyLedgerRepository;
        this.journalEntryRepository = journalEntryRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.chartOfAccountRepository = chartOfAccountRepository;
        this.passengersService = passengersService;
        this.dataSource = dataSource;
        this.mailService = mailService;
    }
    async create(createBookingDto) {
        console.log('🎫 [BookingsService] Creating new booking:', createBookingDto);
        const flightSeries = await this.flightSeriesRepository.findOne({
            where: { id: createBookingDto.flight_series_id }
        });
        if (!flightSeries) {
            throw new common_1.NotFoundException(`Flight series with ID ${createBookingDto.flight_series_id} not found`);
        }
        if (!createBookingDto.passengers || createBookingDto.passengers.length === 0) {
            throw new common_1.BadRequestException('At least one passenger is required');
        }
        const createdPassengers = [];
        let totalAmount = 0;
        let farePerPassenger = 0;
        const isReturnTrip = !!createBookingDto.is_return_trip;
        console.log(`✈️ [BookingsService] is_return_trip=${createBookingDto.is_return_trip} → isReturnTrip=${isReturnTrip}, flight=${flightSeries.flt}, adult_fare=${flightSeries.adult_fare}, adult_return_fare=${flightSeries.adult_return_fare}`);
        for (const passengerDto of createBookingDto.passengers) {
            let fare = 0;
            if (passengerDto.fare_amount != null) {
                fare = Number(passengerDto.fare_amount) || 0;
            }
            else {
                switch (passengerDto.passenger_type) {
                    case 'adult':
                        fare = isReturnTrip
                            ? (Number(flightSeries.adult_return_fare ?? flightSeries.adult_fare) || 0) / 2
                            : Number(flightSeries.adult_fare) || 0;
                        break;
                    case 'child':
                        fare = isReturnTrip
                            ? (Number(flightSeries.child_return_fare ?? flightSeries.child_fare) || 0) / 2
                            : Number(flightSeries.child_fare) || 0;
                        break;
                    case 'infant':
                        fare = isReturnTrip
                            ? (Number(flightSeries.infant_return_fare ?? flightSeries.infant_fare) || 0) / 2
                            : Number(flightSeries.infant_fare) || 0;
                        break;
                }
            }
            totalAmount += fare;
            farePerPassenger = fare;
            let passenger = null;
            if (passengerDto.id_type && passengerDto.identification) {
                passenger = await this.passengerRepository.findOne({
                    where: {
                        id_type: passengerDto.id_type,
                        identification: passengerDto.identification,
                    },
                });
                if (passenger) {
                    console.log(`♻️ [BookingsService] Reusing existing passenger id=${passenger.id} (${passenger.pnr}) matched by ${passengerDto.id_type}/${passengerDto.identification}`);
                    passenger.name = passengerDto.name || passenger.name;
                    passenger.email = passengerDto.email || passenger.email;
                    passenger.contact = passengerDto.contact || passenger.contact;
                    passenger.nationality = passengerDto.nationality || passenger.nationality;
                    if (passengerDto.title)
                        passenger.title = passengerDto.title;
                    if (passengerDto.date_of_birth)
                        passenger.date_of_birth = passengerDto.date_of_birth;
                    passenger = await this.passengerRepository.save(passenger);
                }
            }
            if (!passenger) {
                passenger = await this.passengersService.create({
                    name: passengerDto.name,
                    email: passengerDto.email || null,
                    contact: passengerDto.contact || null,
                    nationality: passengerDto.nationality || null,
                    id_type: passengerDto.id_type || null,
                    identification: passengerDto.identification || null,
                    age: passengerDto.age ? (typeof passengerDto.age === 'string' ? parseInt(passengerDto.age, 10) : passengerDto.age) : null,
                    date_of_birth: passengerDto.date_of_birth || null,
                    title: passengerDto.title || null,
                });
                console.log(`✅ [BookingsService] Created new passenger ${passenger.id} with PNR: ${passenger.pnr}`);
            }
            createdPassengers.push(passenger);
            console.log(`✅ [BookingsService] Using passenger ${passenger.id} (${passenger.pnr}) for booking`);
        }
        const primaryPassenger = createdPassengers[0];
        const bookingReference = this.generateBookingReference();
        const outboundDate = createBookingDto.travel_date ?? createBookingDto.booking_date ?? null;
        const returnDate = isReturnTrip ? (createBookingDto.return_date ?? null) : null;
        const returnFsId = isReturnTrip ? (createBookingDto.return_flight_series_id ?? createBookingDto.flight_series_id) : null;
        const lookupFlightId = async (seriesId, date) => {
            if (!seriesId || !date)
                return null;
            try {
                const f = await this.flightRepository.findOne({
                    where: { series_id: seriesId, flight_date: date },
                });
                return f?.id ?? null;
            }
            catch {
                return null;
            }
        };
        const outboundFlightId = createBookingDto.flight_id
            ?? await lookupFlightId(createBookingDto.flight_series_id, outboundDate);
        const returnFlightId = isReturnTrip
            ? (createBookingDto.return_flight_id ?? await lookupFlightId(returnFsId, returnDate))
            : null;
        console.log(`✈️ [BookingsService] flight_id: outbound=${outboundFlightId}, return=${returnFlightId}`);
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
            payment_status: (createBookingDto.payment_status === 'paid' || createBookingDto.payment_method === 'agency_balance')
                ? 'paid'
                : (createBookingDto.payment_status || 'pending'),
            booking_date: new Date(createBookingDto.booking_date),
            notes: createBookingDto.notes ?? null,
            payment_reference: createBookingDto.payment_reference ?? null,
            payment_account: createBookingDto.payment_account ?? null,
            agency_id: createBookingDto.agency_id ?? null,
            is_return_trip: isReturnTrip,
            return_date: isReturnTrip ? (createBookingDto.return_date ?? null) : null,
            return_flight_series_id: isReturnTrip ? (createBookingDto.return_flight_series_id ?? null) : null,
            flight_id: outboundFlightId,
        });
        console.log(`💳 [BookingsService] Saving booking — method=${createBookingDto.payment_method} ref=${createBookingDto.payment_reference ?? 'null'} account=${createBookingDto.payment_account ?? 'null'}`);
        const savedBooking = await this.bookingRepository.save(booking);
        console.log(`✅ [BookingsService] Booking saved: id=${savedBooking.id} ref=${savedBooking.booking_reference} flight_id=${savedBooking.flight_id ?? 'null'} payment_ref=${savedBooking.payment_reference ?? 'null'} payment_acc=${savedBooking.payment_account ?? 'null'}`);
        console.log(`✅ [BookingsService] Created ${createdPassengers.length} passengers for booking`);
        const bookingPassengerRecords = [];
        for (let i = 0; i < createdPassengers.length; i++) {
            const passenger = createdPassengers[i];
            const passengerDto = createBookingDto.passengers[i];
            let fare = 0;
            if (passengerDto.fare_amount != null) {
                fare = Number(passengerDto.fare_amount) || 0;
            }
            else {
                switch (passengerDto.passenger_type) {
                    case 'adult':
                        fare = isReturnTrip
                            ? (Number(flightSeries.adult_return_fare ?? flightSeries.adult_fare) || 0) / 2
                            : Number(flightSeries.adult_fare) || 0;
                        break;
                    case 'child':
                        fare = isReturnTrip
                            ? (Number(flightSeries.child_return_fare ?? flightSeries.child_fare) || 0) / 2
                            : Number(flightSeries.child_fare) || 0;
                        break;
                    case 'infant':
                        fare = isReturnTrip
                            ? (Number(flightSeries.infant_return_fare ?? flightSeries.infant_fare) || 0) / 2
                            : Number(flightSeries.infant_fare) || 0;
                        break;
                }
            }
            const outboundBp = this.bookingPassengerRepository.create({
                booking_id: savedBooking.id,
                passenger_id: passenger.id,
                flight_series_id: createBookingDto.flight_series_id,
                flight_id: outboundFlightId,
                departure_id: createBookingDto.departure_id ?? null,
                destination_id: createBookingDto.destination_id ?? null,
                passenger_type: passengerDto.passenger_type,
                fare_amount: fare,
                travel_date: outboundDate,
                leg: 'outbound',
                ticket_number: passengerDto.ticket_number || null,
                payment_reference: createBookingDto.payment_reference ?? null,
                payment_account: createBookingDto.payment_account ?? null,
            });
            try {
                const saved = await this.bookingPassengerRepository.save(outboundBp);
                bookingPassengerRecords.push(saved);
                console.log(`✅ [BookingsService] Created outbound booking_passenger for pax ${passenger.id} (${passenger.pnr}), date=${outboundDate}, fs=${createBookingDto.flight_series_id}`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error saving outbound booking_passenger for passenger ${passenger.id}:`, error);
                throw new common_1.BadRequestException(`Failed to link passenger ${passenger.name} to booking: ${error instanceof Error ? error.message : String(error)}`);
            }
            if (isReturnTrip) {
                const retFsId = returnFsId ?? createBookingDto.flight_series_id;
                console.log(`🔁 [BookingsService] Saving return booking_passenger: booking=${savedBooking.id}, pax=${passenger.id}, fs=${retFsId}, date=${returnDate ?? 'null'}`);
                const returnBp = this.bookingPassengerRepository.create({
                    booking_id: savedBooking.id,
                    passenger_id: passenger.id,
                    flight_series_id: retFsId,
                    flight_id: returnFlightId,
                    passenger_type: passengerDto.passenger_type,
                    fare_amount: fare,
                    travel_date: returnDate,
                    leg: 'return',
                    payment_reference: createBookingDto.payment_reference ?? null,
                    payment_account: createBookingDto.payment_account ?? null,
                });
                try {
                    const saved = await this.bookingPassengerRepository.save(returnBp);
                    bookingPassengerRecords.push(saved);
                    console.log(`✅ [BookingsService] Return booking_passenger saved: id=${saved.id}, pax=${passenger.id} (${passenger.pnr}), date=${returnDate ?? 'null'}, fs=${retFsId}`);
                }
                catch (error) {
                    console.error(`❌ [BookingsService] Return booking_passenger FAILED for pax ${passenger.id}: ${error?.message}`);
                    console.error(`❌ SQL error code: ${error?.code}  errno: ${error?.errno}`);
                    throw new common_1.BadRequestException(`Failed to save return leg for passenger ${passenger.name}: ${error?.message}. ` +
                        `If this is a duplicate key error, run the DB migration to update the unique constraint on booking_passengers.`);
                }
            }
        }
        console.log(`✅ [BookingsService] Created ${bookingPassengerRecords.length} booking_passenger records (${isReturnTrip ? 'return trip' : 'one-way'})`);
        const deductAmount = createBookingDto.override_total_amount ?? totalAmount;
        if (createBookingDto.agency_id) {
            try {
                const agency = await this.agencyRepository.findOne({
                    where: { id: createBookingDto.agency_id }
                });
                if (!agency) {
                    console.warn(`⚠️ [BookingsService] Agency ${createBookingDto.agency_id} not found`);
                }
                else {
                    const currentBalance = Number(agency.balance);
                    if (currentBalance < deductAmount) {
                        throw new common_1.BadRequestException(`Insufficient agency balance. Agency "${agency.name}" has ${currentBalance.toFixed(2)}, booking requires ${deductAmount.toFixed(2)}. Shortfall: ${(deductAmount - currentBalance).toFixed(2)}`);
                    }
                    const newBalance = currentBalance - deductAmount;
                    agency.balance = newBalance;
                    await this.agencyRepository.save(agency);
                    const latestLedger = await this.agencyLedgerRepository.findOne({
                        where: { agencyId: agency.id },
                        order: { transactionDate: 'DESC', createdAt: 'DESC' }
                    });
                    const currentLedgerBalance = latestLedger ? Number(latestLedger.balance) : currentBalance;
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
                    try {
                        await this.createJournalEntryForBooking(savedBooking, flightSeries, deductAmount, createBookingDto.payment_account_id ?? 0, createBookingDto.booking_date, createBookingDto.agency_id);
                        console.log(`✅ [BookingsService] Journal entry created for agency booking ${savedBooking.booking_reference}`);
                    }
                    catch (journalErr) {
                        console.warn(`⚠️ [BookingsService] Journal entry skipped for agency booking:`, journalErr instanceof Error ? journalErr.message : String(journalErr));
                    }
                }
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error deducting from agency balance:`, error);
                if (error instanceof common_1.BadRequestException)
                    throw error;
                console.warn(`⚠️ [BookingsService] Continuing despite agency balance deduction error`);
            }
        }
        if (!createBookingDto.payment_account_id && !createBookingDto.agency_id) {
            throw new common_1.BadRequestException('Payment account is required for direct bookings. Please select a payment account.');
        }
        if (createBookingDto.payment_account_id)
            try {
                const paymentAccount = await this.chartOfAccountRepository.findOne({
                    where: { id: createBookingDto.payment_account_id, account_type: 9 }
                });
                if (!paymentAccount) {
                    throw new common_1.BadRequestException(`Payment account with ID ${createBookingDto.payment_account_id} not found in chart_of_accounts`);
                }
                console.log(`✅ [BookingsService] Payment account found: ${paymentAccount.name} (${paymentAccount.code})`);
                console.log(`📝 [BookingsService] ==========================================`);
                console.log(`📝 [BookingsService] CREATING JOURNAL ENTRY - Payment account selected: ${paymentAccount.name} (ID: ${createBookingDto.payment_account_id})`);
                console.log(`📝 [BookingsService] This will record to journal_entries and journal_entry_lines tables`);
                console.log(`📝 [BookingsService] ==========================================`);
                try {
                    await this.createJournalEntryForBooking(savedBooking, flightSeries, totalAmount, createBookingDto.payment_account_id, createBookingDto.booking_date, createBookingDto.agency_id);
                    console.log(`✅ [BookingsService] ==========================================`);
                    console.log(`✅ [BookingsService] JOURNAL ENTRY CREATION COMPLETED SUCCESSFULLY`);
                    console.log(`✅ [BookingsService] Entry recorded to journal_entries table`);
                    console.log(`✅ [BookingsService] Lines recorded to journal_entry_lines table`);
                    console.log(`✅ [BookingsService] ==========================================`);
                }
                catch (journalError) {
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
                    console.warn(`⚠️ [BookingsService] WARNING: Journal entry was not created. Please check the logs above for details.`);
                }
                console.log(`✅ [BookingsService] Skipping legacy account_ledger write (uses accounts table).`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error adding to payment account:`, error);
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                console.warn(`⚠️ [BookingsService] Continuing despite payment account addition error`);
            }
        if (createBookingDto.deduct_from_account && createBookingDto.account_id) {
            try {
                const account = await this.chartOfAccountRepository.findOne({
                    where: { id: createBookingDto.account_id }
                });
                if (!account) {
                    throw new common_1.BadRequestException(`Account with ID ${createBookingDto.account_id} not found in chart_of_accounts`);
                }
                console.log(`✅ [BookingsService] Legacy deduct_from_account: chart entry found for ${account.name}. Ledger write skipped.`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error adding to account:`, error);
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                console.warn(`⚠️ [BookingsService] Continuing despite account addition error`);
            }
        }
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
                                reservation_date: createBookingDto.return_date,
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
                }
                else {
                    console.warn(`⚠️ [BookingsService] Seat reservation ${createBookingDto.seat_reservation_id} not found`);
                }
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error updating seat reservation status:`, error);
            }
        }
        else if (savedBooking.payment_status === 'paid') {
            try {
                const outboundDate = createBookingDto.travel_date ?? createBookingDto.booking_date;
                const numSeats = createBookingDto.passengers.length;
                console.log(`📅 [BookingsService] Seat tracking: outboundDate=${outboundDate}, numSeats=${numSeats}, flightSeriesId=${createBookingDto.flight_series_id}, isReturn=${isReturnTrip}, returnDate=${createBookingDto.return_date}, returnFsId=${createBookingDto.return_flight_series_id}`);
                const outboundRes = this.seatReservationRepository.create({
                    flight_series_id: createBookingDto.flight_series_id,
                    passenger_id: primaryPassenger.id,
                    number_of_seats: numSeats,
                    passenger_name: primaryPassenger.name,
                    passenger_email: primaryPassenger.email ?? null,
                    passenger_phone: primaryPassenger.contact ?? null,
                    booking_reference: savedBooking.booking_reference,
                    status: 'booked',
                    reservation_date: outboundDate,
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
                        reservation_date: createBookingDto.return_date,
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
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error creating seat_reservation for confirmed booking:`, error);
            }
        }
        const bookingWithRelations = await this.bookingRepository.findOne({
            where: { id: savedBooking.id },
            relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'returnFlightSeries', 'returnFlightSeries.fromDestination', 'returnFlightSeries.toDestination', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger', 'bookingPassengers.flightSeries', 'bookingPassengers.flightSeries.fromDestination', 'bookingPassengers.flightSeries.toDestination']
        });
        const finalBooking = bookingWithRelations || savedBooking;
        if (finalBooking.passenger_email) {
            await this.mailService.sendBookingConfirmation({
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
            });
        }
        for (const bp of finalBooking.bookingPassengers || []) {
            const passenger = bp.passenger;
            if (!passenger?.email)
                continue;
            const ticketNumber = bp.ticket_number
                || `${finalBooking.booking_reference.replace(/-/g, '').slice(0, 6)}${String(passenger.id).padStart(4, '0')}`;
            const bpFlightSeries = bp.flightSeries || finalBooking.flightSeries;
            await this.mailService.sendTicket({
                passengerEmail: passenger.email,
                passengerTitle: passenger.title,
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
            });
        }
        return finalBooking;
    }
    async generateEntryNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${year}${month}${day}`;
        const latestEntry = await this.journalEntryRepository.findOne({
            where: {
                entry_number: (0, typeorm_2.Like)(`JE-${datePrefix}-%`),
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
    async createJournalEntryForBooking(booking, flightSeries, totalAmount, paymentAccountId, bookingDate, agencyId) {
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
        }
        catch (error) {
            console.error(`❌ [BookingsService] Error setting up query runner:`, error);
            console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
            console.error(`❌ [BookingsService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
            throw error;
        }
        try {
            console.log('📝 [BookingsService] Looking for Passenger Revenue account...');
            let revenueAccount = null;
            try {
                console.log('📝 [BookingsService] Fetching chart of accounts for revenue matching...');
                const allAccounts = await queryRunner.manager.find(chart_of_account_entity_1.ChartOfAccount);
                console.log(`📝 [BookingsService] Found ${allAccounts.length} total accounts in chart_of_accounts`);
                const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
                revenueAccount = allAccounts.find(acc => normalize(acc.name) === 'passenger revenue') || null;
                if (revenueAccount) {
                    console.log(`✅ [BookingsService] Found "Passenger Revenue" account: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
                }
                else {
                    revenueAccount =
                        allAccounts.find(acc => normalize(acc.name).includes('passenger revenue')) ||
                            allAccounts.find(acc => normalize(acc.name).includes('passenger') && normalize(acc.name).includes('revenue')) ||
                            null;
                    if (revenueAccount)
                        console.log(`✅ [BookingsService] Found Passenger Revenue account (keyword match): ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
                }
                if (!revenueAccount) {
                    revenueAccount = allAccounts.find(acc => normalize(acc.name) === 'sales revenue') || null;
                    if (revenueAccount)
                        console.log(`✅ [BookingsService] Found "Sales Revenue" account: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
                }
                if (!revenueAccount) {
                    revenueAccount =
                        allAccounts.find(acc => normalize(acc.name).includes('sales revenue')) ||
                            allAccounts.find(acc => normalize(acc.name).includes('revenue')) ||
                            allAccounts.find(acc => normalize(acc.name).includes('income')) ||
                            null;
                    if (revenueAccount)
                        console.log(`✅ [BookingsService] Found revenue account (fallback keyword match): ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}`);
                }
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error searching for revenue account by name:`, error);
            }
            if (!revenueAccount) {
                try {
                    const sampleAccounts = await queryRunner.manager.find(chart_of_account_entity_1.ChartOfAccount, { take: 10 });
                    console.error(`❌ [BookingsService] Revenue account not found. Sample accounts:`, sampleAccounts.map(a => ({ id: a.id, name: a.name, type: a.account_type })));
                }
                catch (error) {
                    console.error(`❌ [BookingsService] Error fetching sample accounts:`, error);
                }
                const errorMsg = 'Passenger Revenue account not found. Please create a "Passenger Revenue" (or "Sales Revenue") account in chart of accounts.';
                console.error(`❌ [BookingsService] ${errorMsg}`);
                throw new Error(errorMsg);
            }
            console.log(`✅ [BookingsService] Revenue account selected: ${revenueAccount.name} (${revenueAccount.code}), Type: ${revenueAccount.account_type}, ID: ${revenueAccount.id}`);
            console.log(`📝 [BookingsService] Looking for payment account with ID ${paymentAccountId}...`);
            let paymentAccount = null;
            try {
                paymentAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                    where: { id: paymentAccountId, account_type: 9 },
                });
                console.log(`📝 [BookingsService] Payment account search (with type=9) result: ${paymentAccount ? `Found: ${paymentAccount.name}` : 'Not found'}`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error searching for payment account with type=9:`, error);
                console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
            }
            if (!paymentAccount) {
                try {
                    console.log(`📝 [BookingsService] Payment account not found with account_type=9, trying without type restriction...`);
                    paymentAccount = await queryRunner.manager.findOne(chart_of_account_entity_1.ChartOfAccount, {
                        where: { id: paymentAccountId },
                    });
                    console.log(`📝 [BookingsService] Payment account search (without type) result: ${paymentAccount ? `Found: ${paymentAccount.name} (type: ${paymentAccount.account_type})` : 'Not found'}`);
                }
                catch (error) {
                    console.error(`❌ [BookingsService] Error searching for payment account without type:`, error);
                    console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
                }
            }
            if (!paymentAccount) {
                try {
                    const allAccountsWithId = await queryRunner.manager.find(chart_of_account_entity_1.ChartOfAccount, {
                        where: { id: paymentAccountId },
                    });
                    console.error(`❌ [BookingsService] Payment account with ID ${paymentAccountId} not found. Accounts with this ID:`, allAccountsWithId);
                }
                catch (error) {
                    console.error(`❌ [BookingsService] Error checking for accounts with ID ${paymentAccountId}:`, error);
                }
                const errorMsg = `Payment account with ID ${paymentAccountId} not found in chart_of_accounts`;
                console.error(`❌ [BookingsService] ${errorMsg}`);
                throw new Error(errorMsg);
            }
            console.log(`✅ [BookingsService] Payment account found: ${paymentAccount.name} (${paymentAccount.code}), Type: ${paymentAccount.account_type}, ID: ${paymentAccount.id}`);
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
            console.log('📝 [BookingsService] Generating entry number...');
            let entryNumber;
            try {
                entryNumber = await this.generateEntryNumber();
                console.log(`✅ [BookingsService] Generated entry number: ${entryNumber}`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error generating entry number:`, error);
                throw error;
            }
            console.log('📝 [BookingsService] Creating journal entry record...');
            let journalEntry;
            try {
                journalEntry = queryRunner.manager.create(journal_entry_entity_1.JournalEntry, {
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
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error creating journal entry object:`, error);
                throw error;
            }
            let savedJournalEntry;
            try {
                console.log(`📝 [BookingsService] Attempting to save journal entry to journal_entries table...`);
                savedJournalEntry = await queryRunner.manager.save(journal_entry_entity_1.JournalEntry, journalEntry);
                console.log(`✅ [BookingsService] Journal entry saved to journal_entries table:`);
                console.log(`   - ID: ${savedJournalEntry.id}`);
                console.log(`   - Entry Number: ${savedJournalEntry.entry_number}`);
                console.log(`   - Entry Date: ${savedJournalEntry.entry_date}`);
                console.log(`   - Total Debit: ${savedJournalEntry.total_debit}`);
                console.log(`   - Total Credit: ${savedJournalEntry.total_credit}`);
                console.log(`   - Status: ${savedJournalEntry.status}`);
                const verifyEntry = await queryRunner.manager.findOne(journal_entry_entity_1.JournalEntry, {
                    where: { id: savedJournalEntry.id }
                });
                if (verifyEntry) {
                    console.log(`✅ [BookingsService] Verified: Journal entry exists in database with ID ${verifyEntry.id}`);
                }
                else {
                    console.error(`❌ [BookingsService] WARNING: Journal entry was not found after save!`);
                }
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error saving journal entry to database:`, error);
                console.error(`❌ [BookingsService] Error details:`, error instanceof Error ? error.message : String(error));
                console.error(`❌ [BookingsService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
                throw error;
            }
            console.log('📝 [BookingsService] Creating journal entry lines...');
            console.log(`📝 [BookingsService] Creating debit line: Account ${paymentAccount.name} (ID: ${paymentAccount.id}), Amount: ${totalAmount}`);
            let debitLine;
            try {
                debitLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                    journal_entry_id: savedJournalEntry.id,
                    account_id: paymentAccount.id,
                    debit_amount: totalAmount,
                    credit_amount: 0,
                    description: `Payment received via ${paymentAccount.name} - ${booking.booking_reference}`,
                });
                console.log(`✅ [BookingsService] Debit line object created`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error creating debit line object:`, error);
                throw error;
            }
            console.log(`📝 [BookingsService] Creating credit line: Account ${revenueAccount.name} (ID: ${revenueAccount.id}), Amount: ${totalAmount}`);
            let creditLine;
            try {
                creditLine = queryRunner.manager.create(journal_entry_line_entity_1.JournalEntryLine, {
                    journal_entry_id: savedJournalEntry.id,
                    account_id: revenueAccount.id,
                    debit_amount: 0,
                    credit_amount: totalAmount,
                    description: `Passenger revenue - ${flightSeries.flt} - ${booking.booking_reference}`,
                });
                console.log(`✅ [BookingsService] Credit line object created`);
            }
            catch (error) {
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
                savedLines = await queryRunner.manager.save(journal_entry_line_entity_1.JournalEntryLine, [debitLine, creditLine]);
                console.log(`✅ [BookingsService] Journal entry lines saved to journal_entry_lines table:`);
                console.log(`   - Debit line ID: ${savedLines[0].id}, Journal Entry ID: ${savedLines[0].journal_entry_id}, Account ID: ${savedLines[0].account_id}, Account: ${paymentAccount.name}, Debit Amount: ${savedLines[0].debit_amount}`);
                console.log(`   - Credit line ID: ${savedLines[1].id}, Journal Entry ID: ${savedLines[1].journal_entry_id}, Account ID: ${savedLines[1].account_id}, Account: ${revenueAccount.name}, Credit Amount: ${savedLines[1].credit_amount}`);
                const verifyLines = await queryRunner.manager.find(journal_entry_line_entity_1.JournalEntryLine, {
                    where: { journal_entry_id: savedJournalEntry.id }
                });
                console.log(`✅ [BookingsService] Verified: Found ${verifyLines.length} journal entry lines in database for journal entry ID ${savedJournalEntry.id}`);
                verifyLines.forEach((line, index) => {
                    console.log(`   Line ${index + 1}: ID=${line.id}, Account ID=${line.account_id}, Debit=${line.debit_amount}, Credit=${line.credit_amount}`);
                });
            }
            catch (error) {
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
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error committing transaction:`, error);
                throw error;
            }
        }
        catch (error) {
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
            }
            catch (rollbackError) {
                console.error(`❌ [BookingsService] Error during rollback:`, rollbackError);
            }
            throw error;
        }
        finally {
            try {
                console.log(`📝 [BookingsService] Releasing query runner...`);
                await queryRunner.release();
                console.log(`✅ [BookingsService] Query runner released`);
            }
            catch (releaseError) {
                console.error(`❌ [BookingsService] Error releasing query runner:`, releaseError);
            }
        }
    }
    async findAll(page = 1, limit = 50) {
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
                'bookingPassengers.flight',
            ],
            order: { booking_date: 'DESC', created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { bookings, total };
    }
    async addPassengerToBooking(bookingId, dto) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['flightSeries', 'returnFlightSeries', 'bookingPassengers'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        if (!booking.flightSeries) {
            throw new common_1.BadRequestException(`Booking ${bookingId} has no flight series`);
        }
        let passenger = null;
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
        }
        else if (dto.guardian_passenger_id !== undefined && passenger.guardian_passenger_id !== dto.guardian_passenger_id) {
            passenger.guardian_passenger_id = dto.guardian_passenger_id ?? null;
            passenger = await this.passengerRepository.save(passenger);
        }
        const isReturnTrip = !!booking.is_return_trip;
        const existingOutbound = booking.bookingPassengers?.find(bp => bp.leg === 'outbound');
        const outboundFare = 0;
        const outboundBp = this.bookingPassengerRepository.create({
            booking_id: booking.id,
            passenger_id: passenger.id,
            flight_series_id: booking.flight_series_id,
            flight_id: existingOutbound?.flight_id ?? booking.flight_id ?? null,
            departure_id: existingOutbound?.departure_id ?? null,
            destination_id: existingOutbound?.destination_id ?? null,
            passenger_type: dto.passenger_type,
            fare_amount: outboundFare,
            travel_date: existingOutbound?.travel_date ?? null,
            leg: 'outbound',
        });
        await this.bookingPassengerRepository.save(outboundBp);
        let returnFare = 0;
        if (isReturnTrip) {
            const existingReturn = booking.bookingPassengers?.find(bp => bp.leg === 'return');
            const returnBp = this.bookingPassengerRepository.create({
                booking_id: booking.id,
                passenger_id: passenger.id,
                flight_series_id: booking.return_flight_series_id ?? booking.flight_series_id,
                flight_id: existingReturn?.flight_id ?? null,
                passenger_type: dto.passenger_type,
                fare_amount: returnFare,
                travel_date: existingReturn?.travel_date ?? booking.return_date ?? null,
                leg: 'return',
            });
            await this.bookingPassengerRepository.save(returnBp);
        }
        booking.number_of_passengers = (booking.number_of_passengers || 0) + 1;
        booking.total_amount = Number(booking.total_amount) + outboundFare + returnFare;
        await this.bookingRepository.save(booking);
        return this.findOne(bookingId);
    }
    async cancelAndRefund(bpId, dto, staffId) {
        const bp = await this.bookingPassengerRepository.findOne({
            where: { id: bpId },
            relations: ['booking', 'passenger', 'flight'],
        });
        if (!bp)
            throw new common_1.NotFoundException(`Booking passenger ${bpId} not found`);
        if (bp.ticket_status === 'REFUNDED' || bp.ticket_status === 'RESCHEDULED') {
            throw new common_1.BadRequestException(`Ticket is already ${bp.ticket_status.toLowerCase()}`);
        }
        const originalFare = Number(bp.fare_amount);
        const refundAmount = Number(dto.refund_amount);
        if (refundAmount > originalFare) {
            throw new common_1.BadRequestException(`Refund amount cannot exceed the fare (${originalFare.toFixed(2)})`);
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
                await this.creditAgencyBalance(booking.agency_id, refundAmount, `REFUND-BP${bp.id}`, `Ticket refund — ${bp.passenger?.name ?? 'passenger'} (${bp.flight?.flight_no ?? booking.booking_reference})`).catch(err => console.warn(`⚠️ [BookingsService] Agency credit failed for refund bp ${bp.id}:`, err?.message));
            }
        }
        if (refundAmount > 0) {
            await this.postSimpleJournalEntry(`Ticket refund — ${bp.passenger?.name ?? ''}`.trim(), booking?.payment_account ?? null, refundAmount, 'refund').catch(err => console.warn(`⚠️ [BookingsService] Skipped refund journal entry for bp ${bp.id}:`, err?.message));
        }
        return (await this.bookingPassengerRepository.findOne({ where: { id: bp.id }, relations: ['passenger', 'flight', 'booking'] }));
    }
    async cancelAndReschedule(bpId, dto, staffId) {
        const bp = await this.bookingPassengerRepository.findOne({
            where: { id: bpId },
            relations: ['booking', 'passenger', 'flight'],
        });
        if (!bp)
            throw new common_1.NotFoundException(`Booking passenger ${bpId} not found`);
        if (bp.ticket_status === 'REFUNDED' || bp.ticket_status === 'RESCHEDULED') {
            throw new common_1.BadRequestException(`Ticket is already ${bp.ticket_status.toLowerCase()}`);
        }
        const newFlight = await this.flightRepository.findOne({ where: { id: dto.new_flight_id } });
        if (!newFlight)
            throw new common_1.NotFoundException(`Flight ${dto.new_flight_id} not found`);
        const fee = Number(dto.reschedule_fee);
        const newFare = Number(bp.fare_amount) + fee;
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
            booking.booking_date = newFlight.flight_date;
            await this.bookingRepository.save(booking);
            if (booking.agency_id && fee > 0) {
                await this.debitAgencyBalance(booking.agency_id, fee, `RESCHEDULE-BP${bp.id}`, `Reschedule fee — ${bp.passenger?.name ?? 'passenger'} (${bp.flight?.flight_no ?? booking.booking_reference} → ${newFlight.flight_no})`).catch(err => console.warn(`⚠️ [BookingsService] Agency debit failed for reschedule bp ${bp.id}:`, err?.message));
            }
        }
        if (fee > 0) {
            await this.postSimpleJournalEntry(`Reschedule fee — ${bp.passenger?.name ?? ''}`.trim(), booking?.payment_account ?? null, fee, 'fee').catch(err => console.warn(`⚠️ [BookingsService] Skipped reschedule journal entry for bp ${bp.id}:`, err?.message));
        }
        return (await this.bookingPassengerRepository.findOne({ where: { id: savedNewBp.id }, relations: ['passenger', 'flight', 'booking'] }));
    }
    async creditAgencyBalance(agencyId, amount, reference, description) {
        const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
        if (!agency)
            return;
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
    async debitAgencyBalance(agencyId, amount, reference, description) {
        const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
        if (!agency)
            return;
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
    async postSimpleJournalEntry(description, paymentAccountName, amount, kind) {
        const allAccounts = await this.chartOfAccountRepository.find();
        const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
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
        const journalEntry = await this.journalEntryRepository.save(this.journalEntryRepository.create({
            entry_number: entryNumber,
            entry_date: new Date(),
            reference: description,
            description,
            total_debit: amount,
            total_credit: amount,
            status: 'posted',
            created_by: 1,
        }));
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
    async findOne(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['flightSeries', 'flightSeries.fromDestination', 'flightSeries.toDestination', 'returnFlightSeries', 'returnFlightSeries.fromDestination', 'returnFlightSeries.toDestination', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger', 'bookingPassengers.flightSeries', 'bookingPassengers.flightSeries.fromDestination', 'bookingPassengers.flightSeries.toDestination']
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async getPassengersByFlight(flightSeriesId) {
        const rows = await this.bookingPassengerRepository.find({
            where: { flight_series_id: flightSeriesId },
            relations: ['passenger', 'booking', 'booking.flightSeries',
                'booking.flightSeries.fromDestination', 'booking.flightSeries.toDestination'],
            order: { travel_date: 'ASC' },
        });
        return rows.map(bp => ({
            id: bp.id,
            booking_id: bp.booking_id,
            booking_reference: bp.booking?.booking_reference ?? null,
            payment_status: bp.booking?.payment_status ?? null,
            flight_series_id: bp.flight_series_id,
            passenger_id: bp.passenger_id,
            passenger_type: bp.passenger_type,
            fare_amount: Number(bp.fare_amount ?? 0),
            travel_date: bp.travel_date ? String(bp.travel_date).slice(0, 10) : null,
            leg: bp.leg,
            ticket_status: bp.ticket_status ?? null,
            passenger: bp.passenger ? {
                id: bp.passenger.id,
                pnr: bp.passenger.pnr,
                name: bp.passenger.name,
                title: bp.passenger.title ?? null,
                email: bp.passenger.email,
                contact: bp.passenger.contact,
                nationality: bp.passenger.nationality,
                id_type: bp.passenger.id_type,
                identification: bp.passenger.identification,
                booking_status: bp.passenger.booking_status ?? null,
            } : null,
        }));
    }
    async getPassengersByFlightId(flightId) {
        const rows = await this.bookingPassengerRepository.find({
            where: { flight_id: flightId },
            relations: ['passenger', 'booking', 'booking.flightSeries',
                'booking.flightSeries.fromDestination', 'booking.flightSeries.toDestination'],
            order: { travel_date: 'ASC' },
        });
        return rows.map(bp => ({
            id: bp.id,
            booking_id: bp.booking_id,
            booking_reference: bp.booking?.booking_reference ?? null,
            payment_status: bp.booking?.payment_status ?? null,
            flight_series_id: bp.flight_series_id,
            flight_id: bp.flight_id,
            passenger_id: bp.passenger_id,
            passenger_type: bp.passenger_type,
            fare_amount: Number(bp.fare_amount ?? 0),
            travel_date: bp.travel_date ? String(bp.travel_date).slice(0, 10) : null,
            leg: bp.leg,
            ticket_status: bp.ticket_status ?? null,
            payment_reference: bp.payment_reference ?? null,
            payment_account: bp.payment_account ?? null,
            passenger: bp.passenger ? {
                id: bp.passenger.id,
                pnr: bp.passenger.pnr,
                name: bp.passenger.name,
                title: bp.passenger.title ?? null,
                email: bp.passenger.email,
                contact: bp.passenger.contact,
                nationality: bp.passenger.nationality,
                id_type: bp.passenger.id_type,
                identification: bp.passenger.identification,
                booking_status: bp.passenger.booking_status ?? null,
            } : null,
        }));
    }
    async getBookedSeatCounts(flightSeriesId) {
        const rows = await this.bookingPassengerRepository.query(`SELECT DATE_FORMAT(bp.travel_date, '%Y-%m-%d') AS d, COUNT(bp.id) AS cnt
       FROM booking_passengers bp
       INNER JOIN bookings b ON b.id = bp.booking_id
       WHERE bp.flight_series_id = ?
         AND b.payment_status = 'paid'
         AND bp.travel_date IS NOT NULL
       GROUP BY bp.travel_date`, [flightSeriesId]);
        const result = {};
        for (const row of rows) {
            if (row.d)
                result[row.d] = Number(row.cnt);
        }
        console.log(`📊 [BookingsService] seat-counts for fs=${flightSeriesId}:`, result);
        return result;
    }
    generateBookingReference() {
        const prefix = 'BK';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
    async updateBookingPassengerStatus(id, status, updatedBy) {
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
    async assignSeat(id, seatNumber) {
        const bp = await this.bookingPassengerRepository.findOneOrFail({ where: { id } });
        const seat = seatNumber?.trim().toUpperCase() || null;
        if (seat && bp.flight_id) {
            const clash = await this.bookingPassengerRepository.findOne({
                where: { flight_id: bp.flight_id, seat_number: seat },
            });
            if (clash && clash.id !== bp.id && clash.ticket_status !== 'REFUNDED' && clash.ticket_status !== 'RESCHEDULED') {
                throw new common_1.BadRequestException(`Seat ${seat} is already assigned to another passenger on this flight`);
            }
        }
        bp.seat_number = seat;
        return this.bookingPassengerRepository.save(bp);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_series_entity_1.FlightSeries)),
    __param(2, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(3, (0, typeorm_1.InjectRepository)(passenger_entity_1.Passenger)),
    __param(4, (0, typeorm_1.InjectRepository)(booking_passenger_entity_1.BookingPassenger)),
    __param(5, (0, typeorm_1.InjectRepository)(seat_reservation_entity_1.SeatReservation)),
    __param(6, (0, typeorm_1.InjectRepository)(agency_entity_1.Agency)),
    __param(7, (0, typeorm_1.InjectRepository)(agency_ledger_entity_1.AgencyLedger)),
    __param(8, (0, typeorm_1.InjectRepository)(journal_entry_entity_1.JournalEntry)),
    __param(9, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __param(10, (0, typeorm_1.InjectRepository)(chart_of_account_entity_1.ChartOfAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        passengers_service_1.PassengersService,
        typeorm_2.DataSource,
        mail_service_1.MailService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map