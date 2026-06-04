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
exports.PassengersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passenger_entity_1 = require("../entities/passenger.entity");
let PassengersService = class PassengersService {
    passengerRepository;
    constructor(passengerRepository) {
        this.passengerRepository = passengerRepository;
    }
    async findAll(page = 1, limit = 50, search) {
        const where = search
            ? [
                { name: (0, typeorm_2.Like)(`%${search}%`) },
                { email: (0, typeorm_2.Like)(`%${search}%`) },
                { contact: (0, typeorm_2.Like)(`%${search}%`) },
                { identification: (0, typeorm_2.Like)(`%${search}%`) },
                { pnr: (0, typeorm_2.Like)(`%${search}%`) },
            ]
            : undefined;
        const [passengers, total] = await this.passengerRepository.findAndCount({
            where,
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { passengers, total };
    }
    async findOne(id) {
        console.log(`👤 [PassengersService] Finding passenger by ID: ${id}`);
        const passenger = await this.passengerRepository.findOne({
            where: { id }
        });
        if (!passenger) {
            console.log(`❌ [PassengersService] Passenger with ID ${id} not found`);
            throw new common_1.NotFoundException(`Passenger with ID ${id} not found`);
        }
        console.log(`✅ [PassengersService] Passenger found`);
        return passenger;
    }
    async create(createPassengerDto) {
        console.log('👤 [PassengersService] Creating new passenger');
        const pnr = await this.generatePNR();
        const passenger = this.passengerRepository.create({
            ...createPassengerDto,
            pnr: pnr,
        });
        const savedPassenger = await this.passengerRepository.save(passenger);
        console.log(`✅ [PassengersService] Passenger created with ID: ${savedPassenger.id}, PNR: ${savedPassenger.pnr}`);
        return savedPassenger;
    }
    async update(id, updatePassengerDto) {
        console.log(`👤 [PassengersService] Updating passenger ID: ${id}`);
        const passenger = await this.findOne(id);
        if (updatePassengerDto.name !== undefined)
            passenger.name = updatePassengerDto.name;
        if (updatePassengerDto.email !== undefined)
            passenger.email = updatePassengerDto.email ?? null;
        if (updatePassengerDto.contact !== undefined)
            passenger.contact = updatePassengerDto.contact ?? null;
        if (updatePassengerDto.nationality !== undefined)
            passenger.nationality = updatePassengerDto.nationality ?? null;
        if (updatePassengerDto.id_type !== undefined)
            passenger.id_type = updatePassengerDto.id_type ?? null;
        if (updatePassengerDto.identification !== undefined)
            passenger.identification = updatePassengerDto.identification ?? null;
        if (updatePassengerDto.age !== undefined)
            passenger.age = updatePassengerDto.age ?? null;
        if (updatePassengerDto.title !== undefined)
            passenger.title = updatePassengerDto.title ?? null;
        if (updatePassengerDto.booking_status !== undefined)
            passenger.booking_status = updatePassengerDto.booking_status ?? null;
        const updatedPassenger = await this.passengerRepository.save(passenger);
        console.log(`✅ [PassengersService] Passenger updated: ${updatedPassenger.id}`);
        return updatedPassenger;
    }
    async remove(id) {
        console.log(`👤 [PassengersService] Deleting passenger ID: ${id}`);
        const passenger = await this.findOne(id);
        await this.passengerRepository.remove(passenger);
        console.log(`✅ [PassengersService] Passenger deleted: ${passenger.id}`);
    }
    async generatePNR() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pnr = '';
        let isUnique = false;
        while (!isUnique) {
            pnr = '';
            for (let i = 0; i < 10; i++) {
                pnr += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const existing = await this.passengerRepository.findOne({ where: { pnr } });
            if (!existing) {
                isUnique = true;
            }
        }
        return pnr;
    }
};
exports.PassengersService = PassengersService;
exports.PassengersService = PassengersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(passenger_entity_1.Passenger)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PassengersService);
//# sourceMappingURL=passengers.service.js.map