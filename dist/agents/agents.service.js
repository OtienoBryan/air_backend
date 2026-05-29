"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agent_entity_1 = require("../entities/agent.entity");
let AgentsService = class AgentsService {
    agentRepository;
    constructor(agentRepository) {
        this.agentRepository = agentRepository;
    }
    async findAll(page = 1, limit = 50) {
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
    async findOne(id) {
        console.log(`👤 [AgentsService] Finding agent by ID: ${id}`);
        const agent = await this.agentRepository.findOne({
            where: { id },
            relations: ['agency'],
        });
        if (!agent) {
            console.log(`❌ [AgentsService] Agent with ID ${id} not found`);
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        console.log(`✅ [AgentsService] Agent found: ${agent.name}`);
        return agent;
    }
    async create(createAgentDto) {
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
    async update(id, updateAgentDto) {
        console.log(`👤 [AgentsService] Updating agent ID: ${id}`);
        const agent = await this.findOne(id);
        if (updateAgentDto.name !== undefined)
            agent.name = updateAgentDto.name;
        if (updateAgentDto.email !== undefined)
            agent.email = updateAgentDto.email ?? null;
        if (updateAgentDto.country !== undefined)
            agent.country = updateAgentDto.country ?? null;
        if (updateAgentDto.contact !== undefined)
            agent.contact = updateAgentDto.contact ?? null;
        if (updateAgentDto.agency_id !== undefined)
            agent.agency_id = updateAgentDto.agency_id ?? null;
        if (updateAgentDto.use_deposit !== undefined)
            agent.use_deposit = updateAgentDto.use_deposit;
        const updatedAgent = await this.agentRepository.save(agent);
        console.log(`✅ [AgentsService] Agent updated: ${updatedAgent.name}`);
        return this.findOne(updatedAgent.id);
    }
    async remove(id) {
        console.log(`👤 [AgentsService] Deleting agent ID: ${id}`);
        const agent = await this.findOne(id);
        await this.agentRepository.remove(agent);
        console.log(`✅ [AgentsService] Agent deleted: ${agent.name}`);
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AgentsService);
//# sourceMappingURL=agents.service.js.map