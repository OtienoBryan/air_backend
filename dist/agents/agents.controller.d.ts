import { AgentsService } from './agents.service';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    findAll(page?: number, limit?: number): Promise<{
        agents: Agent[];
        total: number;
    }>;
    findMe(req: any): Promise<Agent>;
    updateMe(req: any, dto: UpdateAgentProfileDto): Promise<Agent>;
    changeMyPassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findOne(id: number): Promise<Agent>;
    create(createAgentDto: CreateAgentDto): Promise<Agent>;
    update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
