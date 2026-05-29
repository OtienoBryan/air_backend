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
exports.AircraftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aircraft_entity_1 = require("../entities/aircraft.entity");
let AircraftsService = class AircraftsService {
    aircraftRepository;
    constructor(aircraftRepository) {
        this.aircraftRepository = aircraftRepository;
    }
    async findAll(page = 1, limit = 50) {
        console.log('✈️ [AircraftsService] Finding all aircrafts');
        const [aircrafts, total] = await this.aircraftRepository.findAndCount({
            relations: ['category', 'createdByStaff'],
            order: { name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        console.log(`✅ [AircraftsService] Found ${aircrafts.length} aircrafts`);
        if (aircrafts.length > 0) {
            const sample = aircrafts[0];
            console.log('✈️ [AircraftsService] Sample aircraft:', {
                id: sample.id,
                name: sample.name,
                created_by: sample.created_by,
                createdByStaff: sample.createdByStaff ? {
                    id: sample.createdByStaff.id,
                    name: sample.createdByStaff.name
                } : null
            });
        }
        return { aircrafts, total };
    }
    async findOne(id) {
        console.log(`✈️ [AircraftsService] Finding aircraft by ID: ${id}`);
        const aircraft = await this.aircraftRepository.findOne({
            where: { id },
            relations: ['category', 'createdByStaff']
        });
        if (!aircraft) {
            console.log(`❌ [AircraftsService] Aircraft with ID ${id} not found`);
            throw new common_1.NotFoundException(`Aircraft with ID ${id} not found`);
        }
        console.log(`✅ [AircraftsService] Aircraft found: ${aircraft.name}`);
        return aircraft;
    }
    async create(createAircraftDto) {
        console.log('✈️ [AircraftsService] Creating new aircraft:', createAircraftDto.name);
        console.log('✈️ [AircraftsService] DTO data:', JSON.stringify(createAircraftDto, null, 2));
        try {
            const aircraft = this.aircraftRepository.create({
                name: createAircraftDto.name,
                registration: createAircraftDto.registration,
                capacity: createAircraftDto.capacity !== undefined && createAircraftDto.capacity !== null
                    ? Number(createAircraftDto.capacity)
                    : null,
                max_cargo_weight: createAircraftDto.max_cargo_weight !== undefined && createAircraftDto.max_cargo_weight !== null
                    ? Number(createAircraftDto.max_cargo_weight)
                    : null,
                category_id: createAircraftDto.category_id !== undefined && createAircraftDto.category_id !== null
                    ? Number(createAircraftDto.category_id)
                    : null,
                created_by: createAircraftDto.created_by !== undefined && createAircraftDto.created_by !== null
                    ? Number(createAircraftDto.created_by)
                    : null,
                status: createAircraftDto.status || 'active',
                calendar_color: createAircraftDto.calendar_color || '#3B82F6',
            });
            const savedAircraft = await this.aircraftRepository.save(aircraft);
            console.log(`✅ [AircraftsService] Aircraft created with ID: ${savedAircraft.id}`);
            const aircraftWithRelations = await this.aircraftRepository.findOne({
                where: { id: savedAircraft.id },
                relations: ['category', 'createdByStaff']
            });
            return aircraftWithRelations || savedAircraft;
        }
        catch (error) {
            console.error('❌ [AircraftsService] Error creating aircraft:', error);
            console.error('❌ [AircraftsService] Error details:', {
                message: error.message,
                code: error.code,
                sqlMessage: error.sqlMessage,
                stack: error.stack
            });
            throw error;
        }
    }
    async update(id, updateAircraftDto) {
        console.log(`✈️ [AircraftsService] Updating aircraft ID: ${id}`);
        console.log(`✈️ [AircraftsService] Update DTO received:`, JSON.stringify(updateAircraftDto, null, 2));
        const aircraft = await this.findOne(id);
        console.log(`✈️ [AircraftsService] Current aircraft calendar_color:`, aircraft.calendar_color);
        const newCategoryId = updateAircraftDto.category_id !== undefined
            ? (updateAircraftDto.category_id !== null ? Number(updateAircraftDto.category_id) : null)
            : aircraft.category_id;
        Object.assign(aircraft, {
            name: updateAircraftDto.name ?? aircraft.name,
            registration: updateAircraftDto.registration ?? aircraft.registration,
            capacity: updateAircraftDto.capacity !== undefined
                ? (updateAircraftDto.capacity !== null ? Number(updateAircraftDto.capacity) : null)
                : aircraft.capacity,
            max_cargo_weight: updateAircraftDto.max_cargo_weight !== undefined
                ? (updateAircraftDto.max_cargo_weight !== null ? Number(updateAircraftDto.max_cargo_weight) : null)
                : aircraft.max_cargo_weight,
            category_id: newCategoryId,
            category: undefined,
            created_by: updateAircraftDto.created_by !== undefined
                ? (updateAircraftDto.created_by !== null ? Number(updateAircraftDto.created_by) : null)
                : aircraft.created_by,
            status: updateAircraftDto.status ?? aircraft.status,
            calendar_color: updateAircraftDto.calendar_color !== undefined
                ? updateAircraftDto.calendar_color
                : aircraft.calendar_color,
        });
        console.log(`✈️ [AircraftsService] Aircraft after assign - calendar_color:`, aircraft.calendar_color);
        const updatedAircraft = await this.aircraftRepository.save(aircraft);
        console.log(`✅ [AircraftsService] Aircraft updated: ${updatedAircraft.name}`);
        console.log(`✅ [AircraftsService] Updated aircraft calendar_color:`, updatedAircraft.calendar_color);
        const aircraftWithRelations = await this.aircraftRepository.findOne({
            where: { id: updatedAircraft.id },
            relations: ['category', 'createdByStaff']
        });
        return aircraftWithRelations || updatedAircraft;
    }
    async remove(id) {
        console.log(`✈️ [AircraftsService] Deleting aircraft ID: ${id}`);
        const aircraft = await this.findOne(id);
        await this.aircraftRepository.remove(aircraft);
        console.log(`✅ [AircraftsService] Aircraft deleted: ${aircraft.name}`);
    }
};
exports.AircraftsService = AircraftsService;
exports.AircraftsService = AircraftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(aircraft_entity_1.Aircraft)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AircraftsService);
//# sourceMappingURL=aircrafts.service.js.map