import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aircraft } from '../entities/aircraft.entity';
import { Category } from '../entities/category.entity';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';

@Injectable()
export class AircraftsService {
  constructor(
    @InjectRepository(Aircraft)
    private aircraftRepository: Repository<Aircraft>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ aircrafts: Aircraft[], total: number }> {
    console.log('✈️ [AircraftsService] Finding all aircrafts');
    
    const [aircrafts, total] = await this.aircraftRepository.findAndCount({
      relations: ['category', 'createdByStaff'],
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log(`✅ [AircraftsService] Found ${aircrafts.length} aircrafts`);
    
    // Log sample aircraft to verify relations are loaded
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

  async findOne(id: number): Promise<Aircraft> {
    console.log(`✈️ [AircraftsService] Finding aircraft by ID: ${id}`);
    
    const aircraft = await this.aircraftRepository.findOne({
      where: { id },
      relations: ['category', 'createdByStaff']
    });
    
    if (!aircraft) {
      console.log(`❌ [AircraftsService] Aircraft with ID ${id} not found`);
      throw new NotFoundException(`Aircraft with ID ${id} not found`);
    }
    
    console.log(`✅ [AircraftsService] Aircraft found: ${aircraft.name}`);
    return aircraft;
  }

  async create(createAircraftDto: CreateAircraftDto): Promise<Aircraft> {
    console.log('✈️ [AircraftsService] Creating new aircraft:', createAircraftDto.name);
    console.log('✈️ [AircraftsService] DTO data:', JSON.stringify(createAircraftDto, null, 2));
    
    try {
      const aircraft = this.aircraftRepository.create({
        name: createAircraftDto.name!,
        registration: createAircraftDto.registration!,
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
      } as Aircraft);
      
      const savedAircraft = await this.aircraftRepository.save(aircraft);
      console.log(`✅ [AircraftsService] Aircraft created with ID: ${savedAircraft.id}`);
      // Reload with category and staff relations
      const aircraftWithRelations = await this.aircraftRepository.findOne({
        where: { id: savedAircraft.id },
        relations: ['category', 'createdByStaff']
      });
      return aircraftWithRelations || savedAircraft;
    } catch (error) {
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

  async update(id: number, updateAircraftDto: UpdateAircraftDto): Promise<Aircraft> {
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
      category: undefined, // clear stale relation so TypeORM uses the FK column value
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
    // Reload with category and staff relations
    const aircraftWithRelations = await this.aircraftRepository.findOne({
      where: { id: updatedAircraft.id },
      relations: ['category', 'createdByStaff']
    });
    return aircraftWithRelations || updatedAircraft;
  }

  async remove(id: number): Promise<void> {
    console.log(`✈️ [AircraftsService] Deleting aircraft ID: ${id}`);
    
    const aircraft = await this.findOne(id);
    await this.aircraftRepository.remove(aircraft);
    
    console.log(`✅ [AircraftsService] Aircraft deleted: ${aircraft.name}`);
  }
}

