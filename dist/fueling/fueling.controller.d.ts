import { FuelingService } from './fueling.service';
import { Fueling } from '../entities/fueling.entity';
import { CreateFuelingDto } from './dto/create-fueling.dto';
export declare class FuelingController {
    private readonly fuelingService;
    constructor(fuelingService: FuelingService);
    findAll(page?: number, limit?: number): Promise<{
        fuelings: Fueling[];
        total: number;
    }>;
    findOne(id: number): Promise<Fueling>;
    create(createFuelingDto: CreateFuelingDto, req: any): Promise<Fueling>;
}
