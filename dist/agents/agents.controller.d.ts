import { AgentsService } from './agents.service';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    findAll(page?: number, limit?: number): Promise<{
        agents: Agent[];
        total: number;
    }>;
    findMe(req: any): Promise<Agent>;
    findOne(id: number): Promise<Agent>;
    create(createAgentDto: CreateAgentDto): Promise<Agent>;
    update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
