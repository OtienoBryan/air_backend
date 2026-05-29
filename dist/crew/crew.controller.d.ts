import { CrewService } from './crew.service';
import { Crew } from '../entities/crew.entity';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
export declare class CrewController {
    private readonly crewService;
    constructor(crewService: CrewService);
    findAll(page?: number, limit?: number): Promise<{
        crew: Crew[];
        total: number;
    }>;
    findOne(id: number): Promise<Crew>;
    create(createCrewDto: CreateCrewDto): Promise<Crew>;
    update(id: number, updateCrewDto: UpdateCrewDto): Promise<Crew>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
