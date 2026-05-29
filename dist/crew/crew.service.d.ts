import { Repository } from 'typeorm';
import { Crew } from '../entities/crew.entity';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
export declare class CrewService {
    private crewRepository;
    constructor(crewRepository: Repository<Crew>);
    findAll(page?: number, limit?: number): Promise<{
        crew: Crew[];
        total: number;
    }>;
    findOne(id: number): Promise<Crew>;
    create(createCrewDto: CreateCrewDto): Promise<Crew>;
    update(id: number, updateCrewDto: UpdateCrewDto): Promise<Crew>;
    remove(id: number): Promise<void>;
}
