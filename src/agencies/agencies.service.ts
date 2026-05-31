import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from '../entities/agency.entity';
import { AgencyLedger } from '../entities/agency-ledger.entity';
import { AgencyDeposit } from '../entities/agency-deposit.entity';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(AgencyLedger)
    private agencyLedgerRepository: Repository<AgencyLedger>,
    @InjectRepository(AgencyDeposit)
    private agencyDepositRepository: Repository<AgencyDeposit>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(AccountLedger)
    private accountLedgerRepository: Repository<AccountLedger>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ agencies: Agency[], total: number }> {
    console.log('🏢 [AgenciesService] Finding all agencies');
    
    const [agencies, total] = await this.agencyRepository.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [AgenciesService] Found ${agencies.length} agencies`);
    return { agencies, total };
  }

  async findOne(id: number): Promise<Agency> {
    console.log(`🏢 [AgenciesService] Finding agency by ID: ${id}`);
    
    const agency = await this.agencyRepository.findOne({
      where: { id }
    });
    
    if (!agency) {
      console.log(`❌ [AgenciesService] Agency with ID ${id} not found`);
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }
    
    console.log(`✅ [AgenciesService] Agency found: ${agency.name}`);
    return agency;
  }

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    console.log('🏢 [AgenciesService] Creating new agency:', createAgencyDto.name);
    console.log('🏢 [AgenciesService] Currency received:', createAgencyDto.default_currency);
    
    const initialBalance = createAgencyDto.balance ?? 0;
    
    const agency = this.agencyRepository.create({
      name: createAgencyDto.name,
      contact: createAgencyDto.contact ?? null,
      city: createAgencyDto.city ?? null,
      country: createAgencyDto.country ?? null,
      booking_limit: createAgencyDto.booking_limit ?? null,
      credit_limit: createAgencyDto.credit_limit ?? null,
      max_pax_per_booking: createAgencyDto.max_pax_per_booking ?? null,
      default_currency: createAgencyDto.default_currency && createAgencyDto.default_currency.trim() !== '' 
        ? createAgencyDto.default_currency.trim() 
        : null,
      credit_days: createAgencyDto.credit_days ?? null,
      payment_limit: createAgencyDto.payment_limit ?? null,
      commission_percentage: createAgencyDto.commission_percentage ?? null,
      balance: initialBalance,
    });
    
    console.log('🏢 [AgenciesService] Agency entity before save:', JSON.stringify(agency, null, 2));
    const savedAgency = await this.agencyRepository.save(agency);
    
    // Create initial ledger entry if balance is not zero
    if (initialBalance !== 0) {
      const ledgerEntry = this.agencyLedgerRepository.create({
        agencyId: savedAgency.id,
        transactionDate: new Date(),
        description: 'Initial balance',
        debit: initialBalance > 0 ? initialBalance : 0,
        credit: initialBalance < 0 ? Math.abs(initialBalance) : 0,
        balance: initialBalance,
        reference: 'INITIAL',
      });
      
      await this.agencyLedgerRepository.save(ledgerEntry);
      console.log(`✅ [AgenciesService] Created initial ledger entry with balance: ${initialBalance}`);
    }
    
    console.log(`✅ [AgenciesService] Agency created with ID: ${savedAgency.id}, Currency: ${savedAgency.default_currency}`);
    return savedAgency;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    console.log(`🏢 [AgenciesService] Updating agency ID: ${id}`);
    console.log('🏢 [AgenciesService] Update data received:', JSON.stringify(updateAgencyDto, null, 2));
    console.log('🏢 [AgenciesService] Currency in update:', updateAgencyDto.default_currency);
    
    const agency = await this.findOne(id);
    const oldBalance = agency.balance;
    
    if (updateAgencyDto.name !== undefined) agency.name = updateAgencyDto.name;
    if (updateAgencyDto.contact !== undefined) agency.contact = updateAgencyDto.contact ?? null;
    if (updateAgencyDto.city !== undefined) agency.city = updateAgencyDto.city ?? null;
    if (updateAgencyDto.country !== undefined) agency.country = updateAgencyDto.country ?? null;
    if (updateAgencyDto.booking_limit !== undefined) agency.booking_limit = updateAgencyDto.booking_limit ?? null;
    if (updateAgencyDto.credit_limit !== undefined) agency.credit_limit = updateAgencyDto.credit_limit ?? null;
    if (updateAgencyDto.max_pax_per_booking !== undefined) agency.max_pax_per_booking = updateAgencyDto.max_pax_per_booking ?? null;
    if (updateAgencyDto.default_currency !== undefined) {
      agency.default_currency = updateAgencyDto.default_currency && updateAgencyDto.default_currency.trim() !== '' 
        ? updateAgencyDto.default_currency.trim() 
        : null;
      console.log('🏢 [AgenciesService] Setting currency to:', agency.default_currency);
    }
    if (updateAgencyDto.credit_days !== undefined) agency.credit_days = updateAgencyDto.credit_days ?? null;
    if (updateAgencyDto.payment_limit !== undefined) agency.payment_limit = updateAgencyDto.payment_limit ?? null;
    if (updateAgencyDto.commission_percentage !== undefined) agency.commission_percentage = updateAgencyDto.commission_percentage ?? null;
    
    // Handle balance update and create ledger entry if balance changed
    if (updateAgencyDto.balance !== undefined) {
      const newBalance = updateAgencyDto.balance ?? 0;
      const balanceDifference = newBalance - oldBalance;
      
      agency.balance = newBalance;
      
      // Create ledger entry if balance changed
      if (balanceDifference !== 0) {
        // Get current balance from latest ledger entry
        const latestLedger = await this.agencyLedgerRepository.findOne({
          where: { agencyId: id },
          order: { transactionDate: 'DESC', createdAt: 'DESC' },
        });
        
        const currentLedgerBalance = latestLedger ? Number(latestLedger.balance) : oldBalance;
        const updatedLedgerBalance = currentLedgerBalance + balanceDifference;
        
        const ledgerEntry = this.agencyLedgerRepository.create({
          agencyId: id,
          transactionDate: new Date(),
          description: balanceDifference > 0 
            ? `Balance adjustment - Added ${Math.abs(balanceDifference).toFixed(2)}` 
            : `Balance adjustment - Deducted ${Math.abs(balanceDifference).toFixed(2)}`,
          debit: balanceDifference > 0 ? Math.abs(balanceDifference) : 0,
          credit: balanceDifference < 0 ? Math.abs(balanceDifference) : 0,
          balance: updatedLedgerBalance,
          reference: 'BALANCE_ADJUSTMENT',
        });
        
        await this.agencyLedgerRepository.save(ledgerEntry);
        console.log(`✅ [AgenciesService] Created ledger entry for balance adjustment: ${balanceDifference > 0 ? '+' : ''}${balanceDifference.toFixed(2)}`);
      }
    }
    
    console.log('🏢 [AgenciesService] Agency entity before save:', JSON.stringify(agency, null, 2));
    const updatedAgency = await this.agencyRepository.save(agency);
    console.log(`✅ [AgenciesService] Agency updated: ${updatedAgency.name}, Currency: ${updatedAgency.default_currency}`);
    return updatedAgency;
  }

  async remove(id: number): Promise<void> {
    console.log(`🏢 [AgenciesService] Deleting agency ID: ${id}`);
    
    const agency = await this.findOne(id);
    await this.agencyRepository.remove(agency);
    
    console.log(`✅ [AgenciesService] Agency deleted: ${agency.name}`);
  }

  async getAgencyBalance(agencyId: number): Promise<number> {
    console.log(`💰 [AgenciesService] Getting balance for agency ID: ${agencyId}`);
    
    const latestLedger = await this.agencyLedgerRepository.findOne({
      where: { agencyId },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
    
    const balance = latestLedger ? Number(latestLedger.balance) : 0;
    console.log(`✅ [AgenciesService] Agency ${agencyId} balance: ${balance}`);
    return balance;
  }

  async getAgencyLedger(agencyId: number): Promise<AgencyLedger[]> {
    console.log(`📋 [AgenciesService] Getting ledger for agency ID: ${agencyId}`);
    
    const ledger = await this.agencyLedgerRepository.find({
      where: { agencyId },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
    
    console.log(`✅ [AgenciesService] Found ${ledger.length} ledger entries for agency ${agencyId}`);
    return ledger;
  }

  async findAllWithBalance(): Promise<Array<Agency & { current_balance: number }>> {
    console.log('🏢 [AgenciesService] Finding all agencies with balance');
    
    const agencies = await this.agencyRepository.find({
      order: { name: 'ASC' },
    });
    
    const agenciesWithBalance = await Promise.all(
      agencies.map(async (agency) => {
        const balance = await this.getAgencyBalance(agency.id);
        return {
          ...agency,
          current_balance: balance,
        };
      })
    );
    
    console.log(`✅ [AgenciesService] Found ${agenciesWithBalance.length} agencies with balance`);
    return agenciesWithBalance;
  }

  async createDeposit(agencyId: number, createDepositDto: CreateDepositDto): Promise<{ agency: Agency; account: Account }> {
    console.log(`💰 [AgenciesService] Creating deposit for agency ID: ${agencyId}`, createDepositDto);
    
    // Find agency
    const agency = await this.findOne(agencyId);
    
    // Find account
    const account = await this.accountRepository.findOne({
      where: { id: createDepositDto.account_id }
    });
    
    if (!account) {
      throw new NotFoundException(`Account with ID ${createDepositDto.account_id} not found`);
    }
    
    // Check currency match
    if (agency.default_currency && account.currency && agency.default_currency !== account.currency) {
      throw new BadRequestException(
        `Currency mismatch. Agency uses ${agency.default_currency} but account uses ${account.currency}.`
      );
    }
    
    const depositAmount = Number(createDepositDto.amount);
    const transactionDate = new Date(createDepositDto.date_paid);
    const accountBalance = Number(account.balance);
    
    // Update agency balance (increase)
    const currentAgencyBalance = Number(agency.balance);
    const newAgencyBalance = currentAgencyBalance + depositAmount;
    agency.balance = newAgencyBalance;
    await this.agencyRepository.save(agency);
    
    // Get current agency ledger balance
    const latestAgencyLedger = await this.agencyLedgerRepository.findOne({
      where: { agencyId: agency.id },
      order: { transactionDate: 'DESC', createdAt: 'DESC' }
    });
    
    const currentAgencyLedgerBalance = latestAgencyLedger ? Number(latestAgencyLedger.balance) : currentAgencyBalance;
    const updatedAgencyLedgerBalance = currentAgencyLedgerBalance + depositAmount;
    
    // Create agency ledger entry (debit for deposit)
    const agencyLedgerEntry = this.agencyLedgerRepository.create({
      agencyId: agency.id,
      transactionDate: transactionDate,
      description: createDepositDto.description,
      debit: depositAmount,
      credit: 0,
      balance: updatedAgencyLedgerBalance,
      reference: createDepositDto.reference,
    });
    await this.agencyLedgerRepository.save(agencyLedgerEntry);
    
    // Update account balance — non-blocking if accounts/account_ledger tables missing
    try {
      account.balance = accountBalance + depositAmount;
      await this.accountRepository.save(account);
    } catch (e) {
      console.warn('⚠️ [AgenciesService] Skipping account balance update (table may not exist):', (e as Error).message);
    }

    try {
      const latestAccountLedger = await this.accountLedgerRepository.findOne({
        where: { account_id: account.id },
        order: { transactionDate: 'DESC', createdAt: 'DESC' }
      });
      const currentAccountLedgerBalance = latestAccountLedger ? Number(latestAccountLedger.balance) : accountBalance;
      const accountLedgerEntry = this.accountLedgerRepository.create({
        account_id: account.id,
        transactionDate: transactionDate,
        description: createDepositDto.description,
        debit: depositAmount,
        credit: 0,
        balance: currentAccountLedgerBalance + depositAmount,
        reference: createDepositDto.reference,
        payment_method: createDepositDto.payment_method,
      });
      await this.accountLedgerRepository.save(accountLedgerEntry);
    } catch (e) {
      console.warn('⚠️ [AgenciesService] Skipping account_ledger write (table may not exist):', (e as Error).message);
    }
    
    // Create agency deposit record
    console.log(`💰 [AgenciesService] Creating agency deposit record...`, {
      agencyId: agency.id,
      accountId: account.id,
      amount: depositAmount,
      datePaid: transactionDate,
      description: createDepositDto.description,
      paymentMethod: createDepositDto.payment_method,
      reference: createDepositDto.reference,
    });
    
    try {
      const agencyDeposit = this.agencyDepositRepository.create({
        agencyId: agency.id,
        accountId: account.id,
        amount: depositAmount,
        datePaid: transactionDate,
        description: createDepositDto.description,
        paymentMethod: createDepositDto.payment_method,
        reference: createDepositDto.reference,
      });
      
      console.log(`💰 [AgenciesService] Agency deposit entity created:`, JSON.stringify(agencyDeposit, null, 2));
      
      const savedDeposit = await this.agencyDepositRepository.save(agencyDeposit);
      console.log(`✅ [AgenciesService] Deposit record saved with ID: ${savedDeposit.id}`);
    } catch (error: any) {
      console.error(`❌ [AgenciesService] Error saving deposit record:`, error);
      console.error(`❌ [AgenciesService] Error message:`, error?.message);
      console.error(`❌ [AgenciesService] Error stack:`, error?.stack);
      console.error(`❌ [AgenciesService] Error details:`, JSON.stringify(error, null, 2));
      // Re-throw the error so it's visible to the client
      throw new BadRequestException(`Failed to save deposit record: ${error?.message || 'Unknown error'}`);
    }
    
    console.log(`✅ [AgenciesService] Deposit created successfully. Agency balance: ${newAgencyBalance.toFixed(2)}, Account balance: ${(accountBalance + depositAmount).toFixed(2)}`);
    
    return { agency, account };
  }

  async deductForBooking(
    agencyId: number,
    amount: number,
    reference: string,
    description: string,
    transactionDate: Date,
  ): Promise<Agency> {
    const agency = await this.findOne(agencyId);
    const currentBalance = Number(agency.balance);

    if (currentBalance < amount) {
      throw new BadRequestException(
        `Insufficient agency balance. Available: ${currentBalance.toFixed(2)}, Required: ${amount.toFixed(2)}`
      );
    }

    // Deduct from agency balance
    agency.balance = currentBalance - amount;
    await this.agencyRepository.save(agency);

    // Get latest ledger balance
    const latestLedger = await this.agencyLedgerRepository.findOne({
      where: { agencyId: agency.id },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
    const ledgerBalance = latestLedger ? Number(latestLedger.balance) : currentBalance;

    // Create ledger entry (credit = money leaving agency account)
    const entry = this.agencyLedgerRepository.create({
      agencyId: agency.id,
      transactionDate,
      description,
      debit: 0,
      credit: amount,
      balance: ledgerBalance - amount,
      reference,
    });
    await this.agencyLedgerRepository.save(entry);

    console.log(`✅ [AgenciesService] Deducted ${amount} from agency ${agency.id}, new balance: ${agency.balance}`);
    return agency;
  }

  async findAllDeposits(page: number = 1, limit: number = 50): Promise<{ deposits: any[], total: number }> {
    console.log('💰 [AgenciesService] Finding all deposits', { page, limit });
    
    const [deposits, total] = await this.agencyDepositRepository.findAndCount({
      relations: ['agency', 'account'],
      order: { datePaid: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [AgenciesService] Found ${deposits.length} deposits`);
    return { deposits, total };
  }
}

