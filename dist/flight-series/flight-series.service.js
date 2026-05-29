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
exports.FlightSeriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const aircraft_entity_1 = require("../entities/aircraft.entity");
const flight_crew_entity_1 = require("../entities/flight-crew.entity");
const crew_entity_1 = require("../entities/crew.entity");
let FlightSeriesService = class FlightSeriesService {
    flightSeriesRepository;
    aircraftRepository;
    flightCrewRepository;
    crewRepository;
    constructor(flightSeriesRepository, aircraftRepository, flightCrewRepository, crewRepository) {
        this.flightSeriesRepository = flightSeriesRepository;
        this.aircraftRepository = aircraftRepository;
        this.flightCrewRepository = flightCrewRepository;
        this.crewRepository = crewRepository;
    }
    async findAll(page = 1, limit = 50) {
        console.log('✈️ [FlightSeriesService] Finding all flight series');
        const [flightSeries, total] = await this.flightSeriesRepository.findAndCount({
            relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew'],
            order: { start_date: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        console.log(`✅ [FlightSeriesService] Found ${flightSeries.length} flight series`);
        return { flightSeries, total };
    }
    async findOne(id) {
        console.log(`✈️ [FlightSeriesService] Finding flight series by ID: ${id}`);
        const flightSeries = await this.flightSeriesRepository.findOne({
            where: { id },
            relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew']
        });
        if (!flightSeries) {
            console.log(`❌ [FlightSeriesService] Flight series with ID ${id} not found`);
            throw new common_1.NotFoundException(`Flight series with ID ${id} not found`);
        }
        console.log(`✅ [FlightSeriesService] Flight series found: ${flightSeries.flt}`);
        return flightSeries;
    }
    async create(createFlightSeriesDto) {
        console.log('✈️ [FlightSeriesService] Creating new flight series:', createFlightSeriesDto.flt);
        console.log('✈️ [FlightSeriesService] DTO data:', JSON.stringify(createFlightSeriesDto, null, 2));
        try {
            const flightSeries = this.flightSeriesRepository.create({
                flt: createFlightSeriesDto.flt,
                aircraft_id: createFlightSeriesDto.aircraft_id ?? null,
                flight_type: createFlightSeriesDto.flight_type,
                start_date: new Date(createFlightSeriesDto.start_date),
                end_date: new Date(createFlightSeriesDto.end_date),
                std: createFlightSeriesDto.std ?? null,
                sta: createFlightSeriesDto.sta ?? null,
                number_of_seats: createFlightSeriesDto.number_of_seats ?? null,
                from_destination_id: createFlightSeriesDto.from_destination_id ?? null,
                from_terminal: createFlightSeriesDto.from_terminal ?? null,
                to_terminal: createFlightSeriesDto.to_terminal ?? null,
                via_destination_id: createFlightSeriesDto.via_destination_id ?? null,
                via_std: createFlightSeriesDto.via_std ?? null,
                via_sta: createFlightSeriesDto.via_sta ?? null,
                to_destination_id: createFlightSeriesDto.to_destination_id ?? null,
                adult_fare: createFlightSeriesDto.adult_fare ?? null,
                child_fare: createFlightSeriesDto.child_fare ?? null,
                infant_fare: createFlightSeriesDto.infant_fare ?? null,
            });
            const savedFlightSeries = await this.flightSeriesRepository.save(flightSeries);
            console.log(`✅ [FlightSeriesService] Flight series created with ID: ${savedFlightSeries.id}`);
            const flightSeriesWithRelations = await this.flightSeriesRepository.findOne({
                where: { id: savedFlightSeries.id },
                relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew']
            });
            if (flightSeriesWithRelations) {
                return flightSeriesWithRelations;
            }
            return savedFlightSeries;
        }
        catch (error) {
            console.error('❌ [FlightSeriesService] Error creating flight series:', error);
            throw error;
        }
    }
    async update(id, updateFlightSeriesDto) {
        console.log(`✈️ [FlightSeriesService] Updating flight series ID: ${id}`);
        console.log(`✈️ [FlightSeriesService] Update DTO received:`, JSON.stringify(updateFlightSeriesDto, null, 2));
        const flightSeries = await this.findOne(id);
        console.log(`✈️ [FlightSeriesService] Current flight series before update:`, {
            id: flightSeries.id,
            flt: flightSeries.flt,
            aircraft_id: flightSeries.aircraft_id
        });
        if (updateFlightSeriesDto.flt !== undefined)
            flightSeries.flt = updateFlightSeriesDto.flt;
        if (updateFlightSeriesDto.aircraft_id !== undefined)
            flightSeries.aircraft_id = updateFlightSeriesDto.aircraft_id;
        if (updateFlightSeriesDto.flight_type !== undefined)
            flightSeries.flight_type = updateFlightSeriesDto.flight_type;
        if (updateFlightSeriesDto.start_date !== undefined)
            flightSeries.start_date = new Date(updateFlightSeriesDto.start_date);
        if (updateFlightSeriesDto.end_date !== undefined)
            flightSeries.end_date = new Date(updateFlightSeriesDto.end_date);
        if (updateFlightSeriesDto.std !== undefined)
            flightSeries.std = updateFlightSeriesDto.std ?? null;
        if (updateFlightSeriesDto.sta !== undefined)
            flightSeries.sta = updateFlightSeriesDto.sta ?? null;
        if (updateFlightSeriesDto.number_of_seats !== undefined)
            flightSeries.number_of_seats = updateFlightSeriesDto.number_of_seats ?? null;
        if (updateFlightSeriesDto.from_destination_id !== undefined)
            flightSeries.from_destination_id = updateFlightSeriesDto.from_destination_id ?? null;
        if (updateFlightSeriesDto.from_terminal !== undefined)
            flightSeries.from_terminal = updateFlightSeriesDto.from_terminal ?? null;
        if (updateFlightSeriesDto.to_terminal !== undefined)
            flightSeries.to_terminal = updateFlightSeriesDto.to_terminal ?? null;
        if (updateFlightSeriesDto.via_destination_id !== undefined)
            flightSeries.via_destination_id = updateFlightSeriesDto.via_destination_id ?? null;
        if (updateFlightSeriesDto.via_std !== undefined)
            flightSeries.via_std = updateFlightSeriesDto.via_std ?? null;
        if (updateFlightSeriesDto.via_sta !== undefined)
            flightSeries.via_sta = updateFlightSeriesDto.via_sta ?? null;
        if (updateFlightSeriesDto.to_destination_id !== undefined)
            flightSeries.to_destination_id = updateFlightSeriesDto.to_destination_id ?? null;
        if ('adult_fare' in updateFlightSeriesDto) {
            flightSeries.adult_fare = updateFlightSeriesDto.adult_fare ?? null;
            console.log(`✈️ [FlightSeriesService] Setting adult_fare:`, updateFlightSeriesDto.adult_fare);
        }
        if ('child_fare' in updateFlightSeriesDto) {
            flightSeries.child_fare = updateFlightSeriesDto.child_fare ?? null;
            console.log(`✈️ [FlightSeriesService] Setting child_fare:`, updateFlightSeriesDto.child_fare);
        }
        if ('infant_fare' in updateFlightSeriesDto) {
            flightSeries.infant_fare = updateFlightSeriesDto.infant_fare ?? null;
            console.log(`✈️ [FlightSeriesService] Setting infant_fare:`, updateFlightSeriesDto.infant_fare);
        }
        console.log(`✈️ [FlightSeriesService] Flight series object before save:`, {
            id: flightSeries.id,
            flt: flightSeries.flt,
            aircraft_id: flightSeries.aircraft_id,
            adult_fare: flightSeries.adult_fare,
            child_fare: flightSeries.child_fare,
            infant_fare: flightSeries.infant_fare
        });
        const updatedFlightSeries = await this.flightSeriesRepository.save(flightSeries);
        console.log(`✅ [FlightSeriesService] Flight series updated: ${updatedFlightSeries.flt}`);
        console.log(`✅ [FlightSeriesService] Updated flight series aircraft_id:`, updatedFlightSeries.aircraft_id);
        console.log(`✅ [FlightSeriesService] Updated fare prices:`, {
            adult_fare: updatedFlightSeries.adult_fare,
            child_fare: updatedFlightSeries.child_fare,
            infant_fare: updatedFlightSeries.infant_fare
        });
        const flightSeriesWithRelations = await this.flightSeriesRepository.findOne({
            where: { id: updatedFlightSeries.id },
            relations: ['aircraft', 'fromDestination', 'viaDestination', 'toDestination', 'flightCrew', 'flightCrew.crew']
        });
        if (flightSeriesWithRelations) {
            return flightSeriesWithRelations;
        }
        return updatedFlightSeries;
    }
    async remove(id) {
        console.log(`✈️ [FlightSeriesService] Deleting flight series ID: ${id}`);
        const flightSeries = await this.findOne(id);
        await this.flightSeriesRepository.remove(flightSeries);
        console.log(`✅ [FlightSeriesService] Flight series deleted: ${flightSeries.flt}`);
    }
    async assignCrew(flightSeriesId, crewId) {
        console.log(`✈️ [FlightSeriesService] Assigning crew ${crewId} to flight series ${flightSeriesId}`);
        const flightSeries = await this.findOne(flightSeriesId);
        const crew = await this.crewRepository.findOne({ where: { id: crewId } });
        if (!crew) {
            throw new common_1.NotFoundException(`Crew with ID ${crewId} not found`);
        }
        const existingAssignment = await this.flightCrewRepository.findOne({
            where: { flight_series_id: flightSeriesId, crew_id: crewId }
        });
        if (existingAssignment) {
            console.log(`⚠️ [FlightSeriesService] Crew ${crewId} already assigned to flight series ${flightSeriesId}`);
            return existingAssignment;
        }
        const flightCrew = this.flightCrewRepository.create({
            flight_series_id: flightSeriesId,
            crew_id: crewId
        });
        const savedFlightCrew = await this.flightCrewRepository.save(flightCrew);
        console.log(`✅ [FlightSeriesService] Crew assigned successfully`);
        return savedFlightCrew;
    }
    async removeCrew(flightSeriesId, crewId) {
        console.log(`✈️ [FlightSeriesService] Removing crew ${crewId} from flight series ${flightSeriesId}`);
        const flightCrew = await this.flightCrewRepository.findOne({
            where: { flight_series_id: flightSeriesId, crew_id: crewId }
        });
        if (!flightCrew) {
            throw new common_1.NotFoundException(`Crew assignment not found`);
        }
        await this.flightCrewRepository.remove(flightCrew);
        console.log(`✅ [FlightSeriesService] Crew removed successfully`);
    }
    async getCrewAssignments(flightSeriesId) {
        console.log(`✈️ [FlightSeriesService] Getting crew assignments for flight series ${flightSeriesId}`);
        const flightCrew = await this.flightCrewRepository.find({
            where: { flight_series_id: flightSeriesId },
            relations: ['crew']
        });
        return flightCrew;
    }
};
exports.FlightSeriesService = FlightSeriesService;
exports.FlightSeriesService = FlightSeriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flight_series_entity_1.FlightSeries)),
    __param(1, (0, typeorm_1.InjectRepository)(aircraft_entity_1.Aircraft)),
    __param(2, (0, typeorm_1.InjectRepository)(flight_crew_entity_1.FlightCrew)),
    __param(3, (0, typeorm_1.InjectRepository)(crew_entity_1.Crew)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FlightSeriesService);
//# sourceMappingURL=flight-series.service.js.map