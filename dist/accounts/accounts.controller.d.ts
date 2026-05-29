import { AccountsService } from './accounts.service';
import { Account } from '../entities/account.entity';
import { AccountLedger } from '../entities/account-ledger.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    findAll(page?: number, limit?: number): Promise<{
        accounts: Account[];
        total: number;
    }>;
    findOne(id: number): Promise<Account>;
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getBalance(id: number): Promise<{
        balance: number;
    }>;
    getLedger(id: number): Promise<AccountLedger[]>;
}
