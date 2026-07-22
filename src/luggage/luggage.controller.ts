import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  DefaultValuePipe,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { LuggageService } from './luggage.service';
import { Luggage } from '../entities/luggage.entity';
import { LuggageExcessCharge } from '../entities/luggage-excess-charge.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';

// Fixed GL account that all excess-baggage revenue posts against — "Cargo Extra
// Charges" (chart_of_accounts.id = 54). Not configurable per-charge; every
// excess-weight journal entry credits this same account.
const EXCESS_BAGGAGE_REVENUE_ACCOUNT_ID = 54;

@Controller('admin/luggage')
@UseGuards(JwtAuthGuard)
export class LuggageController {
  constructor(
    private readonly luggageService: LuggageService,
    @InjectRepository(LuggageExcessCharge)
    private readonly excessChargeRepository: Repository<LuggageExcessCharge>,
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private readonly journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(ChartOfAccount)
    private readonly chartOfAccountRepository: Repository<ChartOfAccount>,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() createLuggageDto: CreateLuggageDto): Promise<Luggage> {
    console.log('🧳 [LuggageController] POST /admin/luggage');
    return this.luggageService.create(createLuggageDto);
  }

  @Get('all')
  async findAllWithDetails(
    @Query('flightSeriesId') flightSeriesId?: string,
    @Query('flightId') flightIdParam?: string,
  ): Promise<any[]> {
    const seriesId = flightSeriesId ? parseInt(flightSeriesId, 10) : undefined;
    if (flightSeriesId && isNaN(seriesId!)) {
      throw new Error('flightSeriesId must be a valid number');
    }
    const flightId = flightIdParam ? parseInt(flightIdParam, 10) : undefined;
    if (flightIdParam && isNaN(flightId!)) {
      throw new Error('flightId must be a valid number');
    }
    console.log(`🧳 [LuggageController] GET /admin/luggage/all${seriesId ? `?flightSeriesId=${seriesId}` : ''}${flightId ? `&flightId=${flightId}` : ''}`);
    return this.luggageService.findAllWithDetails(seriesId, flightId);
  }

  @Get('passenger/:passengerId')
  async findAllByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<Luggage[]> {
    console.log(`🧳 [LuggageController] GET /admin/luggage/passenger/${passengerId}`);
    return this.luggageService.findAllByPassenger(passengerId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Luggage> {
    console.log(`🧳 [LuggageController] GET /admin/luggage/${id}`);
    return this.luggageService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLuggageDto: UpdateLuggageDto,
    @Request() req,
  ): Promise<Luggage> {
    console.log(`🧳 [LuggageController] PUT /admin/luggage/${id}`);
    const updatedBy = req.user?.sub ? Number(req.user.sub) : null;
    return this.luggageService.update(id, updateLuggageDto, updatedBy);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🧳 [LuggageController] DELETE /admin/luggage/${id}`);
    await this.luggageService.remove(id);
    return { message: 'Luggage deleted successfully' };
  }

  @Delete('passenger/:passengerId')
  async removeAllByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<{ message: string }> {
    console.log(`🧳 [LuggageController] DELETE /admin/luggage/passenger/${passengerId}`);
    await this.luggageService.removeAllByPassenger(passengerId);
    return { message: 'All luggage deleted successfully' };
  }

  // ── Excess Charges ────────────────────────────────────────────────────────

  @Post('excess-charges')
  async postExcessCharge(
    @Body() body: {
      passenger_id: number;
      booking_id?: number | null;
      flight_id?: number | null;
      flight_series_id?: number | null;
      route_id?: number | null;
      total_weight: number;
      weight_limit: number;
      excess_kg: number;
      charge_per_kg: number;
      total_charge: number;
      currency?: string;
      payment_method?: string;
      payment_status?: string;
      payment_account_id?: number | null;
      notes?: string | null;
    },
    @Request() req,
  ): Promise<LuggageExcessCharge> {
    // Upsert: replace existing record for same passenger+flight to avoid duplicates
    await this.excessChargeRepository.delete({
      passenger_id: body.passenger_id,
      flight_id: body.flight_id ?? undefined,
    });
    const record = this.excessChargeRepository.create({
      passenger_id:    body.passenger_id,
      booking_id:      body.booking_id ?? null,
      flight_id:       body.flight_id ?? null,
      flight_series_id: body.flight_series_id ?? null,
      route_id:        body.route_id ?? null,
      total_weight:    body.total_weight,
      weight_limit:    body.weight_limit,
      excess_kg:       body.excess_kg,
      charge_per_kg:   body.charge_per_kg,
      total_charge:    body.total_charge,
      currency:        body.currency ?? 'USD',
      payment_method:  body.payment_method ?? 'cash',
      payment_status:  body.payment_status ?? 'pending',
      notes:           body.notes ?? null,
    });
    const saved = await this.excessChargeRepository.save(record);

    // Only post to the ledger once the charge is actually collected, and only
    // when staff picked a specific GL account to debit (payment_account_id) —
    // without one we don't know which account received the cash/card/etc, so
    // there's nothing valid to post.
    if (saved.payment_status === 'paid' && Number(saved.total_charge) > 0 && body.payment_account_id) {
      try {
        await this.postJournalEntryForExcessCharge(saved, body.payment_account_id, req.user?.sub ? Number(req.user.sub) : null);
      } catch (err) {
        // Don't fail the whole request over the journal posting — the excess
        // charge record itself (the source of truth for what's owed/collected)
        // is already saved; surface the failure in logs so it can be re-posted.
        console.error('❌ [LuggageController] Failed to post journal entry for excess charge:', err);
      }
    }

    return saved;
  }

  private async generateEntryNumber(): Promise<string> {
    const today = new Date();
    const datePrefix = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const latestEntry = await this.journalEntryRepository.findOne({
      where: { entry_number: Like(`JE-${datePrefix}-%`) },
      order: { entry_number: 'DESC' },
    });
    let sequence = 1;
    if (latestEntry) {
      const parts = latestEntry.entry_number.split('-');
      if (parts.length === 3) sequence = (parseInt(parts[2] || '0', 10) || 0) + 1;
    }
    return `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
  }

  // Debits the payment account staff collected into, credits the fixed
  // "Cargo Extra Charges" account (id 54) — the same debit-payment/credit-revenue
  // shape bookings.service.ts uses for booking payments, just against a fixed
  // revenue account instead of one looked up by name.
  private async postJournalEntryForExcessCharge(
    charge: LuggageExcessCharge,
    paymentAccountId: number,
    createdBy: number | null,
  ): Promise<void> {
    const paymentAccount = await this.chartOfAccountRepository.findOne({ where: { id: paymentAccountId } });
    if (!paymentAccount) {
      console.warn(`⚠️ [LuggageController] Payment account ${paymentAccountId} not found — skipping journal entry`);
      return;
    }
    const revenueAccount = await this.chartOfAccountRepository.findOne({ where: { id: EXCESS_BAGGAGE_REVENUE_ACCOUNT_ID } });
    if (!revenueAccount) {
      console.warn(`⚠️ [LuggageController] Excess-baggage revenue account ${EXCESS_BAGGAGE_REVENUE_ACCOUNT_ID} not found — skipping journal entry`);
      return;
    }

    const amount = Number(charge.total_charge);
    const entryNumber = await this.generateEntryNumber();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const journalEntry = queryRunner.manager.create(JournalEntry, {
        entry_number: entryNumber,
        entry_date: new Date(),
        reference: charge.notes ?? `Excess baggage — passenger ${charge.passenger_id}`,
        description: `Excess baggage charge — ${charge.excess_kg}kg over limit, passenger ${charge.passenger_id}${charge.flight_id ? `, flight ${charge.flight_id}` : ''}`,
        total_debit: amount,
        total_credit: amount,
        status: 'posted',
        created_by: createdBy ?? 1,
      });
      const savedEntry = await queryRunner.manager.save(JournalEntry, journalEntry);

      const debitLine = queryRunner.manager.create(JournalEntryLine, {
        journal_entry_id: savedEntry.id,
        account_id: paymentAccount.id,
        debit_amount: amount,
        credit_amount: 0,
        description: `Excess baggage payment received via ${paymentAccount.name}`,
      });
      const creditLine = queryRunner.manager.create(JournalEntryLine, {
        journal_entry_id: savedEntry.id,
        account_id: revenueAccount.id,
        debit_amount: 0,
        credit_amount: amount,
        description: `Excess baggage revenue — ${charge.excess_kg}kg over limit`,
      });
      await queryRunner.manager.save(JournalEntryLine, [debitLine, creditLine]);

      await queryRunner.commitTransaction();
      console.log(`✅ [LuggageController] Journal entry ${entryNumber} posted for excess baggage charge (passenger ${charge.passenger_id}, amount ${amount})`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @Get('excess-charges')
  async getExcessCharges(
    @Query('flightId') flightId?: string,
    @Query('passengerId') passengerId?: string,
  ): Promise<LuggageExcessCharge[]> {
    const where: any = {};
    if (flightId) where.flight_id = parseInt(flightId, 10);
    if (passengerId) where.passenger_id = parseInt(passengerId, 10);
    return this.excessChargeRepository.find({
      where,
      relations: ['passenger'],
      order: { created_at: 'DESC' },
    });
  }

  @Delete('excess-charges/:id')
  async deleteExcessCharge(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.excessChargeRepository.delete(id);
    return { message: 'Deleted' };
  }
}

