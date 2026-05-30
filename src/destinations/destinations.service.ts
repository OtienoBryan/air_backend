import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { Country } from '../entities/country.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<{ destinations: Destination[], total: number }> {
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

  async findOne(id: number): Promise<Destination> {
    console.log(`🌍 [DestinationsService] Finding destination by ID: ${id}`);
    
    const destination = await this.destinationRepository.findOne({
      where: { id },
      relations: ['country']
    });
    
    if (!destination) {
      console.log(`❌ [DestinationsService] Destination with ID ${id} not found`);
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    
    console.log(`✅ [DestinationsService] Destination found: ${destination.name}`);
    return destination;
  }

  async create(createDestinationDto: CreateDestinationDto): Promise<Destination> {
    console.log('🌍 [DestinationsService] Creating new destination:', createDestinationDto.name);
    console.log('🌍 [DestinationsService] DTO data:', JSON.stringify(createDestinationDto, null, 2));
    
    try {
      const destination = this.destinationRepository.create({
        code: createDestinationDto.code!,
        name: createDestinationDto.name!,
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
      
      // Reload with country relation
      const destinationWithRelations = await this.destinationRepository.findOne({
        where: { id: savedDestination.id },
        relations: ['country']
      });
      
      if (destinationWithRelations) {
        return destinationWithRelations;
      }
      return savedDestination;
    } catch (error) {
      console.error('❌ [DestinationsService] Error creating destination:', error);
      throw error;
    }
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto): Promise<Destination> {
    console.log(`🌍 [DestinationsService] Updating destination ID: ${id}`);
    console.log(`🌍 [DestinationsService] Update DTO received:`, JSON.stringify(updateDestinationDto, null, 2));
    
    const destination = await this.findOne(id);
    console.log(`🌍 [DestinationsService] Current destination before update:`, {
      id: destination.id,
      country_id: destination.country_id
    });
    
    // Handle country_id explicitly - allow null values
    if (updateDestinationDto.country_id !== undefined) {
      destination.country_id = updateDestinationDto.country_id;
      console.log(`🌍 [DestinationsService] Setting country_id to:`, updateDestinationDto.country_id);
    }
    
    // Handle other fields
    if (updateDestinationDto.code !== undefined) destination.code = updateDestinationDto.code;
    if (updateDestinationDto.name !== undefined) destination.name = updateDestinationDto.name;
    if (updateDestinationDto.longitude !== undefined) destination.longitude = updateDestinationDto.longitude;
    if (updateDestinationDto.latitude !== undefined) destination.latitude = updateDestinationDto.latitude;
    if (updateDestinationDto.timezone !== undefined) destination.timezone = updateDestinationDto.timezone;
    if (updateDestinationDto.status !== undefined) destination.status = updateDestinationDto.status;
    if (updateDestinationDto.father_code !== undefined) destination.father_code = updateDestinationDto.father_code;
    if (updateDestinationDto.destination !== undefined) destination.destination = updateDestinationDto.destination;
    if (updateDestinationDto.destination_type !== undefined) destination.destination_type = updateDestinationDto.destination_type;
    if (updateDestinationDto.icao_code !== undefined) destination.icao_code = updateDestinationDto.icao_code || null;
    
    console.log(`🌍 [DestinationsService] Destination object before save:`, {
      id: destination.id,
      country_id: destination.country_id
    });
    
    const updatedDestination = await this.destinationRepository.save(destination);
    console.log(`✅ [DestinationsService] Destination updated: ${updatedDestination.name}`);
    console.log(`✅ [DestinationsService] Updated destination country_id:`, updatedDestination.country_id);
    
    // Reload with country relation
    const destinationWithRelations = await this.destinationRepository.findOne({
      where: { id: updatedDestination.id },
      relations: ['country']
    });
    
    if (destinationWithRelations) {
      return destinationWithRelations;
    }
    return updatedDestination;
  }

  async remove(id: number): Promise<void> {
    console.log(`🌍 [DestinationsService] Deleting destination ID: ${id}`);
    
    const destination = await this.findOne(id);
    await this.destinationRepository.remove(destination);
    
    console.log(`✅ [DestinationsService] Destination deleted: ${destination.name}`);
  }
}

