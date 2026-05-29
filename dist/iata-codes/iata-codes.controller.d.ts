import { IataCodesService } from './iata-codes.service';
import { IataCode } from '../entities/iata-code.entity';
import { CreateIataCodeDto } from './dto/create-iata-code.dto';
import { UpdateIataCodeDto } from './dto/update-iata-code.dto';
export declare class IataCodesController {
    private readonly iataCodesService;
    constructor(iataCodesService: IataCodesService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        iataCodes: IataCode[];
        total: number;
    }>;
    findByCode(code: string): Promise<IataCode>;
    findOne(id: number): Promise<IataCode>;
    create(createIataCodeDto: CreateIataCodeDto): Promise<IataCode>;
    update(id: number, updateIataCodeDto: UpdateIataCodeDto): Promise<IataCode>;
    remove(id: number): Promise<{
        message: string;
    }>;
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
