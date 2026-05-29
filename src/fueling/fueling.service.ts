import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Fueling } from '../entities/fueling.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Supplier } from '../entities/supplier.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalEntryLine } from '../entities/journal-entry-line.entity';
import { SupplierLedger } from '../entities/supplier-ledger.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { Account } from '../entities/account.entity';
import { CreateFuelingDto } from './dto/create-fueling.dto';

@Injectable()
export class FuelingService {
  constructor(
    @InjectRepository(Fueling)
    private fuelingRepository: Repository<Fueling>,
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLineRepository: Repository<JournalEntryLine>,
    @InjectRepository(SupplierLedger)
    private supplierLedgerRepository: Repository<SupplierLedger>,
    @InjectRepository(AccountLedger)
    private accountLedgerRepository: Repository<AccountLedger>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private dataSource: DataSource,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ fuelings: Fueling[], total: number }> {
    console.log('⛽ [FuelingService] Finding all fuelings');
    console.log(`⛽ [FuelingService] Page: ${page}, Limit: ${limit}`);
    
    const [fuelings, total] = await this.fuelingRepository.findAndCount({
      relations: ['flightSeries', 'flightSeries.aircraft', 'supplier', 'journal_entry'],
      order: { fueling_date: 'DESC', created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [FuelingService] Found ${fuelings.length} fuelings out of ${total} total`);
    return { fuelings, total };
  }

  async findOne(id: number): Promise<Fueling> {
    console.log(`⛽ [FuelingService] Finding fueling by ID: ${id}`);
    
    const fueling = await this.fuelingRepository.findOne({
      where: { id },
      relations: ['flightSeries', 'flightSeries.aircraft', 'supplier', 'journal_entry', 'journal_entry.lines', 'journal_entry.lines.account'],
    });
    
    if (!fueling) {
      console.log(`❌ [FuelingService] Fueling with ID ${id} not found`);
      throw new NotFoundException(`Fueling with ID ${id} not found`);
    }
    
    console.log(`✅ [FuelingService] Fueling found: ID ${fueling.id}`);
    return fueling;
  }

  private async generateEntryNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    console.log(`📝 [FuelingService] Generating entry number for date: ${datePrefix}`);
    
    // Find the latest entry number for today
    const latestEntry = await this.journalEntryRepository.findOne({
      where: {
        entry_number: Like(`JE-${datePrefix}-%`),
      },
      order: { entry_number: 'DESC' },
    });
    
    let sequence = 1;
    if (latestEntry) {
      console.log(`📝 [FuelingService] Found latest entry: ${latestEntry.entry_number}`);
      const parts = latestEntry.entry_number.split('-');
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2] || '0');
        sequence = lastSequence + 1;
        console.log(`📝 [FuelingService] Last sequence: ${lastSequence}, New sequence: ${sequence}`);
      }
    } else {
      console.log(`📝 [FuelingService] No previous entries found for today, starting with sequence 1`);
    }
    
    const entryNumber = `JE-${datePrefix}-${String(sequence).padStart(4, '0')}`;
    console.log(`📝 [FuelingService] Generated entry number: ${entryNumber}`);
    return entryNumber;
  }

  async create(createFuelingDto: CreateFuelingDto, createdBy: number | null = null): Promise<Fueling> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Parallelize independent queries for better performance
      const [
        existingFueling,
        flightSeries,
        supplier,
        fuelAccount,
        accountsPayableAccount
      ] = await Promise.all([
        // Check duplicate
        this.fuelingRepository.findOne({
          where: { fuel_slip_number: createFuelingDto.fuel_slip_number },
        }),
        // Verify flight series
        this.flightSeriesRepository.findOne({
          where: { id: createFuelingDto.flight_series_id },
        }),
        // Verify supplier
        this.supplierRepository.findOne({
          where: { id: createFuelingDto.supplier_id },
        }),
        // Find Aircraft Fueling account
        this.chartOfAccountRepository
          .createQueryBuilder('account')
          .where('LOWER(account.name) = LOWER(:name)', { name: 'Aircraft Fueling' })
          .andWhere('account.account_type = :accountType', { accountType: 16 })
          .getOne(),
        // Find accounts payable account
        this.chartOfAccountRepository.findOne({
          where: { account_type: 10 },
        }),
      ]);

      // Validate all required entities
      if (existingFueling) {
        throw new NotFoundException(`Fueling with slip number ${createFuelingDto.fuel_slip_number} already exists. Please use a different slip number.`);
      }

      if (!flightSeries) {
        throw new NotFoundException(`Flight series with ID ${createFuelingDto.flight_series_id} not found`);
      }

      if (!supplier) {
        throw new NotFoundException(`Supplier with ID ${createFuelingDto.supplier_id} not found`);
      }

      if (!fuelAccount) {
        throw new NotFoundException(`Aircraft Fueling account not found. Please configure an account named "Aircraft Fueling" in chart_of_accounts`);
      }

      if (!accountsPayableAccount) {
        throw new NotFoundException(`Accounts payable account not found. Please configure an accounts payable account in chart_of_accounts`);
      }

      // Calculate total amount
      const additionalFees = createFuelingDto.additional_fees || 0;
      const tax = createFuelingDto.tax || 0;
      const fuelCost = createFuelingDto.fuel_quantity * createFuelingDto.price_per_liter;
      const subtotal = fuelCost + additionalFees;
      const totalAmount = subtotal + tax;

      // Find tax-related accounts if tax > 0 (parallel)
      let purchaseTaxAccount: ChartOfAccount | null = null;
      let accruedLiabilitiesAccount: ChartOfAccount | null = null;

      if (tax > 0) {
        [purchaseTaxAccount, accruedLiabilitiesAccount] = await Promise.all([
          this.chartOfAccountRepository.findOne({
            where: { code: '110004' },
          }),
          this.chartOfAccountRepository
            .createQueryBuilder('account')
            .where('LOWER(account.name) = LOWER(:name)', { name: 'Accrued Liabilities' })
            .getOne(),
        ]);

        if (!purchaseTaxAccount) {
          throw new NotFoundException(`Purchase Tax account (code: 110004) not found. Please configure this account in chart_of_accounts`);
        }

        if (!accruedLiabilitiesAccount) {
          throw new NotFoundException(`Accrued Liabilities account not found. Please configure an account named "Accrued Liabilities" in chart_of_accounts`);
        }
      }
    
      // Generate entry number
      const entryNumber = await this.generateEntryNumber();
      
      // Create journal entry
      const journalEntry = queryRunner.manager.create(JournalEntry, {
        entry_number: entryNumber,
        entry_date: new Date(createFuelingDto.fueling_date),
        reference: createFuelingDto.fuel_slip_number,
        description: `Fueling - ${flightSeries.flt} - ${supplier.company_name} - ${createFuelingDto.location}`,
        total_debit: totalAmount,
        total_credit: totalAmount,
        status: 'posted',
        created_by: createdBy || 1,
      });
      
      const savedJournalEntry = await queryRunner.manager.save(JournalEntry, journalEntry);
      
      // Create journal entry lines
      const journalEntryLines: JournalEntryLine[] = [];
      
      // Debit line: Fuel expense account
      journalEntryLines.push(
        queryRunner.manager.create(JournalEntryLine, {
          journal_entry_id: savedJournalEntry.id,
          account_id: fuelAccount.id,
          debit_amount: subtotal,
          credit_amount: 0,
          description: `Fueling - ${flightSeries.flt} - ${createFuelingDto.fuel_quantity}L @ ${createFuelingDto.price_per_liter}/L`,
        })
      );
      
      // Debit line: Purchase Tax account (if tax > 0)
      if (tax > 0 && purchaseTaxAccount) {
        journalEntryLines.push(
          queryRunner.manager.create(JournalEntryLine, {
            journal_entry_id: savedJournalEntry.id,
            account_id: purchaseTaxAccount.id,
            debit_amount: tax,
            credit_amount: 0,
            description: `Purchase Tax - Fueling - ${flightSeries.flt} - Slip: ${createFuelingDto.fuel_slip_number}`,
          })
        );
      }
      
      // Credit line: Accounts payable (subtotal - fuel cost only)
      journalEntryLines.push(
        queryRunner.manager.create(JournalEntryLine, {
          journal_entry_id: savedJournalEntry.id,
          account_id: accountsPayableAccount.id,
          debit_amount: 0,
          credit_amount: subtotal,
          description: `Fueling payable to ${supplier.company_name} - Slip: ${createFuelingDto.fuel_slip_number}`,
        })
      );
      
      // Credit line: Accrued Liabilities (tax amount - if tax > 0)
      if (tax > 0 && accruedLiabilitiesAccount) {
        journalEntryLines.push(
          queryRunner.manager.create(JournalEntryLine, {
            journal_entry_id: savedJournalEntry.id,
            account_id: accruedLiabilitiesAccount.id,
            debit_amount: 0,
            credit_amount: tax,
            description: `Tax liability - Fueling - ${flightSeries.flt} - Slip: ${createFuelingDto.fuel_slip_number}`,
          })
        );
      }
      
      await queryRunner.manager.save(JournalEntryLine, journalEntryLines);
      
      // Get supplier ledger balance (optimized query)
      const latestSupplierLedger = await queryRunner.manager.findOne(SupplierLedger, {
        where: { supplierId: supplier.id },
        order: { date: 'DESC', createdAt: 'DESC' },
      });
      
      const currentSupplierBalance = latestSupplierLedger ? Number(latestSupplierLedger.runningBalance) : 0;
      const updatedSupplierBalance = currentSupplierBalance + totalAmount;
      
      // Create supplier ledger entry
      const supplierLedgerEntry = queryRunner.manager.create(SupplierLedger, {
        supplierId: supplier.id,
        date: new Date(createFuelingDto.fueling_date),
        description: `Fueling - ${flightSeries.flt} - Slip: ${createFuelingDto.fuel_slip_number}`,
        debit: 0,
        credit: totalAmount,
        runningBalance: updatedSupplierBalance,
        referenceType: 'FUELING',
        referenceId: null, // Will be updated after fueling is saved
      });
      
      await queryRunner.manager.save(SupplierLedger, supplierLedgerEntry);
      
      // Create fueling record
      const fueling = queryRunner.manager.create(Fueling, {
        flight_series_id: createFuelingDto.flight_series_id,
        supplier_id: createFuelingDto.supplier_id,
        fuel_quantity: createFuelingDto.fuel_quantity,
        fuel_slip_number: createFuelingDto.fuel_slip_number,
        price_per_liter: createFuelingDto.price_per_liter,
        location: createFuelingDto.location,
        additional_fees: additionalFees,
        additional_fees_explanation: createFuelingDto.additional_fees_explanation || null,
        tax: tax,
        total_amount: totalAmount,
        fueling_date: new Date(createFuelingDto.fueling_date),
        journal_entry_id: savedJournalEntry.id,
      });
      
      const savedFueling = await queryRunner.manager.save(Fueling, fueling);
      
      // Update supplier ledger reference_id
      supplierLedgerEntry.referenceId = savedFueling.id;
      await queryRunner.manager.save(SupplierLedger, supplierLedgerEntry);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      // Return fueling with minimal relations (faster)
      return this.fuelingRepository.findOne({
        where: { id: savedFueling.id },
        relations: ['flightSeries', 'supplier'],
      }) as Promise<Fueling>;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
