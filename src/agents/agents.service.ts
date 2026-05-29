import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ agents: Agent[], total: number }> {
    console.log('👤 [AgentsService] Finding all agents');
    
    const [agents, total] = await this.agentRepository.findAndCount({
      relations: ['agency'],
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [AgentsService] Found ${agents.length} agents`);
    return { agents, total };
  }

  async findOne(id: number): Promise<Agent> {
    console.log(`👤 [AgentsService] Finding agent by ID: ${id}`);
    
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['agency'],
    });
    
    if (!agent) {
      console.log(`❌ [AgentsService] Agent with ID ${id} not found`);
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    
    console.log(`✅ [AgentsService] Agent found: ${agent.name}`);
    return agent;
  }

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    console.log('👤 [AgentsService] Creating new agent:', createAgentDto.name);
    
    const agent = this.agentRepository.create({
      name: createAgentDto.name,
      email: createAgentDto.email ?? null,
      country: createAgentDto.country ?? null,
      contact: createAgentDto.contact ?? null,
      agency_id: createAgentDto.agency_id ?? null,
      use_deposit: createAgentDto.use_deposit ?? false,
    });
    
    const savedAgent = await this.agentRepository.save(agent);
    console.log(`✅ [AgentsService] Agent created with ID: ${savedAgent.id}`);
    return this.findOne(savedAgent.id);
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    console.log(`👤 [AgentsService] Updating agent ID: ${id}`);
    
    const agent = await this.findOne(id);
    
    if (updateAgentDto.name !== undefined) agent.name = updateAgentDto.name;
    if (updateAgentDto.email !== undefined) agent.email = updateAgentDto.email ?? null;
    if (updateAgentDto.country !== undefined) agent.country = updateAgentDto.country ?? null;
    if (updateAgentDto.contact !== undefined) agent.contact = updateAgentDto.contact ?? null;
    if (updateAgentDto.agency_id !== undefined) agent.agency_id = updateAgentDto.agency_id ?? null;
    if (updateAgentDto.use_deposit !== undefined) agent.use_deposit = updateAgentDto.use_deposit;
    
    const updatedAgent = await this.agentRepository.save(agent);
    console.log(`✅ [AgentsService] Agent updated: ${updatedAgent.name}`);
    return this.findOne(updatedAgent.id);
  }

  async remove(id: number): Promise<void> {
    console.log(`👤 [AgentsService] Deleting agent ID: ${id}`);
    
    const agent = await this.findOne(id);
    await this.agentRepository.remove(agent);
    
    console.log(`✅ [AgentsService] Agent deleted: ${agent.name}`);
  }
}

