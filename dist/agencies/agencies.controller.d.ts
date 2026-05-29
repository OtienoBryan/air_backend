import { AgenciesService } from './agencies.service';
import { Agency } from '../entities/agency.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';
export declare class AgenciesController {
    private readonly agenciesService;
    constructor(agenciesService: AgenciesService);
    findAll(page?: number, limit?: number): Promise<{
        agencies: Agency[];
        total: number;
    }>;
    findOne(id: number): Promise<Agency>;
    create(createAgencyDto: CreateAgencyDto): Promise<Agency>;
    update(id: number, updateAgencyDto: UpdateAgencyDto): Promise<Agency>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getBalance(id: number): Promise<{
        balance: number;
    }>;
    getLedger(id: number): Promise<any[]>;
    findAllWithBalance(): Promise<any[]>;
    createDeposit(id: number, createDepositDto: CreateDepositDto): Promise<{
        agency: Agency;
        account: any;
    }>;
    findAllDeposits(page?: number, limit?: number): Promise<{
        deposits: any[];
        total: number;
    }>;
}
