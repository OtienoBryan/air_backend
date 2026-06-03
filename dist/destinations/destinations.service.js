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
exports.DestinationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const destination_entity_1 = require("../entities/destination.entity");
const country_entity_1 = require("../entities/country.entity");
let DestinationsService = class DestinationsService {
    destinationRepository;
    countryRepository;
    constructor(destinationRepository, countryRepository) {
        this.destinationRepository = destinationRepository;
        this.countryRepository = countryRepository;
    }
    async findAll(page = 1, limit = 50) {
        console.log('🌍 [DestinationsService] Finding all destinations');
        const [destinations, total] = await this.destinationRepository.findAndCount({
            relations: ['country'],
            order: { name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        console.log(`✅ [DestinationsService] Found ${destinations.length} destinations`);
        return { destinations, total };
    }
    async findOne(id) {
        console.log(`🌍 [DestinationsService] Finding destination by ID: ${id}`);
        const destination = await this.destinationRepository.findOne({
            where: { id },
            relations: ['country']
        });
        if (!destination) {
            console.log(`❌ [DestinationsService] Destination with ID ${id} not found`);
            throw new common_1.NotFoundException(`Destination with ID ${id} not found`);
        }
        console.log(`✅ [DestinationsService] Destination found: ${destination.name}`);
        return destination;
    }
    async create(createDestinationDto) {
        console.log('🌍 [DestinationsService] Creating new destination:', createDestinationDto.name);
        console.log('🌍 [DestinationsService] DTO data:', JSON.stringify(createDestinationDto, null, 2));
        try {
            const destination = this.destinationRepository.create({
                code: createDestinationDto.code,
                name: createDestinationDto.name,
                country_id: createDestinationDto.country_id,
                longitude: createDestinationDto.longitude,
                latitude: createDestinationDto.latitude,
                timezone: createDestinationDto.timezone,
                status: createDestinationDto.status || 'active',
                father_code: createDestinationDto.father_code,
                destination: createDestinationDto.destination,
                destination_type: createDestinationDto.destination_type || 'domestic',
                icao_code: createDestinationDto.icao_code || null,
            });
            const savedDestination = await this.destinationRepository.save(destination);
            console.log(`✅ [DestinationsService] Destination created with ID: ${savedDestination.id}`);
            const destinationWithRelations = await this.destinationRepository.findOne({
                where: { id: savedDestination.id },
                relations: ['country']
            });
            if (destinationWithRelations) {
                return destinationWithRelations;
            }
            return savedDestination;
        }
        catch (error) {
            console.error('❌ [DestinationsService] Error creating destination:', error);
            throw error;
        }
    }
    async update(id, updateDestinationDto) {
        console.log(`🌍 [DestinationsService] Updating destination ID: ${id}`);
        console.log(`🌍 [DestinationsService] Update DTO received:`, JSON.stringify(updateDestinationDto, null, 2));
        const destination = await this.findOne(id);
        console.log(`🌍 [DestinationsService] Current destination before update:`, {
            id: destination.id,
            country_id: destination.country_id
        });
        if (updateDestinationDto.country_id !== undefined) {
            destination.country_id = updateDestinationDto.country_id;
            destination.country = undefined;
            console.log(`🌍 [DestinationsService] Setting country_id to:`, updateDestinationDto.country_id);
        }
        if (updateDestinationDto.code !== undefined)
            destination.code = updateDestinationDto.code;
        if (updateDestinationDto.name !== undefined)
            destination.name = updateDestinationDto.name;
        if (updateDestinationDto.longitude !== undefined)
            destination.longitude = updateDestinationDto.longitude;
        if (updateDestinationDto.latitude !== undefined)
            destination.latitude = updateDestinationDto.latitude;
        if (updateDestinationDto.timezone !== undefined)
            destination.timezone = updateDestinationDto.timezone;
        if (updateDestinationDto.status !== undefined)
            destination.status = updateDestinationDto.status;
        if (updateDestinationDto.father_code !== undefined)
            destination.father_code = updateDestinationDto.father_code;
        if (updateDestinationDto.destination !== undefined)
            destination.destination = updateDestinationDto.destination;
        if (updateDestinationDto.destination_type !== undefined)
            destination.destination_type = updateDestinationDto.destination_type;
        if (updateDestinationDto.icao_code !== undefined)
            destination.icao_code = updateDestinationDto.icao_code || null;
        console.log(`🌍 [DestinationsService] Destination object before save:`, {
            id: destination.id,
            country_id: destination.country_id
        });
        const updatedDestination = await this.destinationRepository.save(destination);
        console.log(`✅ [DestinationsService] Destination updated: ${updatedDestination.name}`);
        console.log(`✅ [DestinationsService] Updated destination country_id:`, updatedDestination.country_id);
        const destinationWithRelations = await this.destinationRepository.findOne({
            where: { id: updatedDestination.id },
            relations: ['country']
        });
        if (destinationWithRelations) {
            return destinationWithRelations;
        }
        return updatedDestination;
    }
    async remove(id) {
        console.log(`🌍 [DestinationsService] Deleting destination ID: ${id}`);
        const destination = await this.findOne(id);
        await this.destinationRepository.remove(destination);
        console.log(`✅ [DestinationsService] Destination deleted: ${destination.name}`);
    }
};
exports.DestinationsService = DestinationsService;
exports.DestinationsService = DestinationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(destination_entity_1.Destination)),
    __param(1, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DestinationsService);
//# sourceMappingURL=destinations.service.js.map