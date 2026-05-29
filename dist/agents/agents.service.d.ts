import { Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsService {
    private agentRepository;
    constructor(agentRepository: Repository<Agent>);
    findAll(page?: number, limit?: number): Promise<{
        agents: Agent[];
        total: number;
    }>;
    findOne(id: number): Promise<Agent>;
    create(createAgentDto: CreateAgentDto): Promise<Agent>;
    update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent>;
    remove(id: number): Promise<void>;
}
