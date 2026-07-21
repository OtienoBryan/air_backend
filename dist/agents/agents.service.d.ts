import { Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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
    updateProfile(id: number, dto: UpdateAgentProfileDto): Promise<Agent>;
    changePassword(id: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
