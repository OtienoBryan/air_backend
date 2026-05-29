import { Repository } from 'typeorm';
import { IataCode } from '../entities/iata-code.entity';
import { CreateIataCodeDto } from './dto/create-iata-code.dto';
import { UpdateIataCodeDto } from './dto/update-iata-code.dto';
export declare class IataCodesService {
    private iataCodesRepository;
    constructor(iataCodesRepository: Repository<IataCode>);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        iataCodes: IataCode[];
        total: number;
    }>;
    findOne(id: number): Promise<IataCode>;
    findByCode(code: string): Promise<IataCode>;
    create(createIataCodeDto: CreateIataCodeDto): Promise<IataCode>;
    update(id: number, updateIataCodeDto: UpdateIataCodeDto): Promise<IataCode>;
    remove(id: number): Promise<void>;
    bulkInsert(iataCodes: CreateIataCodeDto[]): Promise<{
        inserted: number;
        skipped: number;
    }>;
    fetchFromInternet(): Promise<{
        inserted: number;
        skipped: number;
        total: number;
    }>;
}
