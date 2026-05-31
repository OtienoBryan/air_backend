import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from '../entities/passenger.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ passengers: Passenger[], total: number }> {
    console.log('👤 [PassengersService] Finding all passengers');
    
    const [passengers, total] = await this.passengerRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [PassengersService] Found ${passengers.length} passengers`);
    return { passengers, total };
  }

  async findOne(id: number): Promise<Passenger> {
    console.log(`👤 [PassengersService] Finding passenger by ID: ${id}`);
    
    const passenger = await this.passengerRepository.findOne({
      where: { id }
    });
    
    if (!passenger) {
      console.log(`❌ [PassengersService] Passenger with ID ${id} not found`);
      throw new NotFoundException(`Passenger with ID ${id} not found`);
    }
    
    console.log(`✅ [PassengersService] Passenger found`);
    return passenger;
  }

  async create(createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    console.log('👤 [PassengersService] Creating new passenger');
    
    // Generate unique PNR (10 characters)
    const pnr = await this.generatePNR();
    
    const passenger = this.passengerRepository.create({
      ...createPassengerDto,
      pnr: pnr,
    });
    
    const savedPassenger = await this.passengerRepository.save(passenger);
    console.log(`✅ [PassengersService] Passenger created with ID: ${savedPassenger.id}, PNR: ${savedPassenger.pnr}`);
    
    return savedPassenger;
  }

  async update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<Passenger> {
    console.log(`👤 [PassengersService] Updating passenger ID: ${id}`);
    
    const passenger = await this.findOne(id);

    // Update fields (pnr is never updated - always auto-generated)
    if (updatePassengerDto.name !== undefined) passenger.name = updatePassengerDto.name;
    if (updatePassengerDto.email !== undefined) passenger.email = updatePassengerDto.email ?? null;
    if (updatePassengerDto.contact !== undefined) passenger.contact = updatePassengerDto.contact ?? null;
    if (updatePassengerDto.nationality !== undefined) passenger.nationality = updatePassengerDto.nationality ?? null;
    if (updatePassengerDto.id_type !== undefined) passenger.id_type = updatePassengerDto.id_type ?? null;
    if (updatePassengerDto.identification !== undefined) passenger.identification = updatePassengerDto.identification ?? null;
    if (updatePassengerDto.age !== undefined) passenger.age = updatePassengerDto.age ?? null;
    if (updatePassengerDto.title !== undefined) passenger.title = updatePassengerDto.title ?? null;
    if (updatePassengerDto.booking_status !== undefined) passenger.booking_status = updatePassengerDto.booking_status ?? null;
    
    const updatedPassenger = await this.passengerRepository.save(passenger);
    console.log(`✅ [PassengersService] Passenger updated: ${updatedPassenger.id}`);
    
    return updatedPassenger;
  }

  async remove(id: number): Promise<void> {
    console.log(`👤 [PassengersService] Deleting passenger ID: ${id}`);
    const passenger = await this.findOne(id);
    await this.passengerRepository.remove(passenger);
    console.log(`✅ [PassengersService] Passenger deleted: ${passenger.id}`);
  }

  private async generatePNR(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    let isUnique = false;
    
    while (!isUnique) {
      // Generate 10-character PNR
      pnr = '';
      for (let i = 0; i < 10; i++) {
        pnr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Check if PNR already exists
      const existing = await this.passengerRepository.findOne({ where: { pnr } });
      if (!existing) {
        isUnique = true;
      }
    }
    
    return pnr;
  }
}

