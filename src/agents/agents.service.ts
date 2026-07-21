import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  // Self-service profile update — deliberately only touches the fields
  // UpdateAgentProfileDto exposes (name/email/country/contact), never
  // agency_id/use_deposit, regardless of what the admin-only update() above allows.
  async updateProfile(id: number, dto: UpdateAgentProfileDto): Promise<Agent> {
    console.log(`👤 [AgentsService] Updating own profile for agent ID: ${id}`);

    const agent = await this.findOne(id);

    if (dto.name !== undefined) agent.name = dto.name;
    if (dto.email !== undefined) agent.email = dto.email ?? null;
    if (dto.country !== undefined) agent.country = dto.country ?? null;
    if (dto.contact !== undefined) agent.contact = dto.contact ?? null;

    await this.agentRepository.save(agent);
    console.log(`✅ [AgentsService] Profile updated for agent ID: ${id}`);
    return this.findOne(id);
  }

  // Mirrors the dual bcrypt-hash/legacy-plaintext check in AuthService.loginAgent
  // so a self-service change works no matter which form the agent's current
  // password is stored in — but always WRITES the new one as a bcrypt hash into
  // password_hash, and clears the legacy plaintext `password` column, so the
  // account is migrated off plaintext storage the moment it changes its password.
  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    console.log(`👤 [AgentsService] Changing password for agent ID: ${id}`);

    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) throw new NotFoundException(`Agent with ID ${id} not found`);

    const storedHash = agent.password_hash || null;
    const storedPlain = agent.password || null;

    if (!storedHash && !storedPlain) {
      throw new BadRequestException('No password is set for this account yet — contact your administrator.');
    }

    let valid = false;
    if (storedHash) {
      try { valid = await bcrypt.compare(dto.current_password, storedHash); } catch { valid = false; }
    }
    if (!valid && storedPlain) {
      valid = storedPlain === dto.current_password;
      if (!valid) {
        try { valid = await bcrypt.compare(dto.current_password, storedPlain); } catch { valid = false; }
      }
    }
    if (!valid) throw new UnauthorizedException('Current password is incorrect.');

    agent.password_hash = await bcrypt.hash(dto.new_password, 10);
    agent.password = null;
    await this.agentRepository.save(agent);

    console.log(`✅ [AgentsService] Password changed for agent ID: ${id}`);
    return { message: 'Password changed successfully.' };
  }
}

