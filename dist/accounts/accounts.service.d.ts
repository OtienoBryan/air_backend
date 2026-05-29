import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountsService {
    private accountRepository;
    private accountLedgerRepository;
    private chartOfAccountRepository;
    constructor(accountRepository: Repository<Account>, accountLedgerRepository: Repository<AccountLedger>, chartOfAccountRepository: Repository<ChartOfAccount>);
    findAll(page?: number, limit?: number): Promise<{
        accounts: Account[];
        total: number;
    }>;
    findOne(id: number): Promise<Account>;
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account>;
    remove(id: number): Promise<void>;
    getAccountBalance(accountId: number): Promise<number>;
    getAccountLedger(accountId: number): Promise<AccountLedger[]>;
}
