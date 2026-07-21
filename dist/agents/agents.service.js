"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcryptjs"));
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
    async updateProfile(id, dto) {
        console.log(`👤 [AgentsService] Updating own profile for agent ID: ${id}`);
        const agent = await this.findOne(id);
        if (dto.name !== undefined)
            agent.name = dto.name;
        if (dto.email !== undefined)
            agent.email = dto.email ?? null;
        if (dto.country !== undefined)
            agent.country = dto.country ?? null;
        if (dto.contact !== undefined)
            agent.contact = dto.contact ?? null;
        await this.agentRepository.save(agent);
        console.log(`✅ [AgentsService] Profile updated for agent ID: ${id}`);
        return this.findOne(id);
    }
    async changePassword(id, dto) {
        console.log(`👤 [AgentsService] Changing password for agent ID: ${id}`);
        const agent = await this.agentRepository.findOne({ where: { id } });
        if (!agent)
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        const storedHash = agent.password_hash || null;
        const storedPlain = agent.password || null;
        if (!storedHash && !storedPlain) {
            throw new common_1.BadRequestException('No password is set for this account yet — contact your administrator.');
        }
        let valid = false;
        if (storedHash) {
            try {
                valid = await bcrypt.compare(dto.current_password, storedHash);
            }
            catch {
                valid = false;
            }
        }
        if (!valid && storedPlain) {
            valid = storedPlain === dto.current_password;
            if (!valid) {
                try {
                    valid = await bcrypt.compare(dto.current_password, storedPlain);
                }
                catch {
                    valid = false;
                }
            }
        }
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect.');
        agent.password_hash = await bcrypt.hash(dto.new_password, 10);
        agent.password = null;
        await this.agentRepository.save(agent);
        console.log(`✅ [AgentsService] Password changed for agent ID: ${id}`);
        return { message: 'Password changed successfully.' };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agent_entity_1.Agent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AgentsService);
//# sourceMappingURL=agents.service.js.map