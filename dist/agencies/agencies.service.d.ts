import { Repository } from 'typeorm';
import { Agency } from '../entities/agency.entity';
import { AgencyLedger } from '../entities/agency-ledger.entity';
import { AgencyDeposit } from '../entities/agency-deposit.entity';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';
export declare class AgenciesService {
    private agencyRepository;
    private agencyLedgerRepository;
    private agencyDepositRepository;
    private accountRepository;
    private accountLedgerRepository;
    constructor(agencyRepository: Repository<Agency>, agencyLedgerRepository: Repository<AgencyLedger>, agencyDepositRepository: Repository<AgencyDeposit>, accountRepository: Repository<Account>, accountLedgerRepository: Repository<AccountLedger>);
    findAll(page?: number, limit?: number): Promise<{
        agencies: Agency[];
        total: number;
    }>;
    findOne(id: number): Promise<Agency>;
    create(createAgencyDto: CreateAgencyDto): Promise<Agency>;
    update(id: number, updateAgencyDto: UpdateAgencyDto): Promise<Agency>;
    remove(id: number): Promise<void>;
    getAgencyBalance(agencyId: number): Promise<number>;
    getAgencyLedger(agencyId: number): Promise<AgencyLedger[]>;
    findAllWithBalance(): Promise<Array<Agency & {
        current_balance: number;
    }>>;
    createDeposit(agencyId: number, createDepositDto: CreateDepositDto): Promise<{
        agency: Agency;
        account: Account;
    }>;
    deductForBooking(agencyId: number, amount: number, reference: string, description: string, transactionDate: Date): Promise<Agency>;
    findAllDeposits(page?: number, limit?: number): Promise<{
        deposits: any[];
        total: number;
    }>;
}
