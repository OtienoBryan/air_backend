import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Luggage } from '../entities/luggage.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { Booking } from '../entities/booking.entity';
import { CreateLuggageDto } from './dto/create-luggage.dto';
import { UpdateLuggageDto } from './dto/update-luggage.dto';

@Injectable()
export class LuggageService {
  constructor(
    @InjectRepository(Luggage)
    private luggageRepository: Repository<Luggage>,
    @InjectRepository(BookingPassenger)
    private bookingPassengerRepository: Repository<BookingPassenger>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(createLuggageDto: CreateLuggageDto): Promise<Luggage> {
    console.log('🧳 [LuggageService] Creating new luggage:', createLuggageDto);
    
    // Check if tag_number is unique (if provided)
    if (createLuggageDto.tag_number && createLuggageDto.tag_number.trim() !== '') {
      const existingLuggage = await this.luggageRepository.findOne({
        where: { tag_number: createLuggageDto.tag_number.trim() },
      });

      if (existingLuggage) {
        throw new ConflictException(`Tag number "${createLuggageDto.tag_number}" already exists`);
      }
    }
    
    // If flight_series_id or booking_id not provided, try to find them from passenger's booking
    if (!createLuggageDto.flight_series_id || !createLuggageDto.booking_id) {
      const bookingPassenger = await this.bookingPassengerRepository.findOne({
        where: { passenger_id: createLuggageDto.passenger_id },
        relations: ['booking'],
        order: { created_at: 'DESC' },
      });

      if (bookingPassenger?.booking) {
        if (!createLuggageDto.flight_series_id) {
          createLuggageDto.flight_series_id = bookingPassenger.booking.flight_series_id;
        }
        if (!createLuggageDto.booking_id) {
          createLuggageDto.booking_id = bookingPassenger.booking.id;
        }
      }
    }

    const luggage = this.luggageRepository.create({
      ...createLuggageDto,
      tag_number: createLuggageDto.tag_number?.trim() || null,
    });
    const savedLuggage = await this.luggageRepository.save(luggage);
    console.log(`✅ [LuggageService] Luggage created: ${savedLuggage.id}`);
    return savedLuggage;
  }

  async findAllByPassenger(passengerId: number): Promise<Luggage[]> {
    console.log(`🧳 [LuggageService] Finding all luggage for passenger: ${passengerId}`);
    return this.luggageRepository.find({
      where: { passenger_id: passengerId },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Luggage> {
    const luggage = await this.luggageRepository.findOne({ where: { id } });
    if (!luggage) {
      throw new NotFoundException(`Luggage with ID ${id} not found`);
    }
    return luggage;
  }

  async update(id: number, updateLuggageDto: UpdateLuggageDto, updatedBy?: number | null): Promise<Luggage> {
    console.log(`🧳 [LuggageService] Updating luggage ID: ${id}`);
    const luggage = await this.findOne(id);

    // Check if tag_number is unique (if being updated and not empty)
    if (updateLuggageDto.tag_number !== undefined) {
      const trimmedTagNumber = updateLuggageDto.tag_number?.trim() || null;
      
      if (trimmedTagNumber && trimmedTagNumber !== '') {
        // Check if another luggage already has this tag number
        const existingLuggage = await this.luggageRepository.findOne({
          where: { tag_number: trimmedTagNumber },
        });

        if (existingLuggage && existingLuggage.id !== id) {
          throw new ConflictException(`Tag number "${trimmedTagNumber}" already exists`);
        }
      }
      
      luggage.tag_number = trimmedTagNumber;
    }
    if (updateLuggageDto.weight !== undefined) {
      luggage.weight = updateLuggageDto.weight ?? null;
    }
    if (updateLuggageDto.excess_kg !== undefined) {
      luggage.excess_kg = updateLuggageDto.excess_kg ?? 0;
    }
    if (updateLuggageDto.excess_charge !== undefined) {
      luggage.excess_charge = updateLuggageDto.excess_charge ?? 0;
    }
    if (updateLuggageDto.collected !== undefined) {
      luggage.collected = updateLuggageDto.collected;
    }
    if (updatedBy !== undefined) {
      luggage.updated_by = updatedBy ?? null;
    }

    const updatedLuggage = await this.luggageRepository.save(luggage);
    console.log(`✅ [LuggageService] Luggage updated: ${updatedLuggage.id}`);
    return updatedLuggage;
  }

  async remove(id: number): Promise<void> {
    console.log(`🧳 [LuggageService] Deleting luggage ID: ${id}`);
    const luggage = await this.findOne(id);
    await this.luggageRepository.remove(luggage);
    console.log(`✅ [LuggageService] Luggage deleted: ${id}`);
  }

  async removeAllByPassenger(passengerId: number): Promise<void> {
    console.log(`🧳 [LuggageService] Deleting all luggage for passenger: ${passengerId}`);
    await this.luggageRepository.delete({ passenger_id: passengerId });
    console.log(`✅ [LuggageService] All luggage deleted for passenger: ${passengerId}`);
  }

  async findAllWithDetails(flightSeriesId?: number): Promise<any[]> {
    console.log(`🧳 [LuggageService] Finding all luggage with details${flightSeriesId ? ` for flight: ${flightSeriesId}` : ''}`);
    
    const query = this.luggageRepository
      .createQueryBuilder('luggage')
      .leftJoinAndSelect('luggage.passenger', 'passenger')
      .leftJoinAndSelect('luggage.flightSeries', 'flightSeries')
      .leftJoinAndSelect('luggage.booking', 'booking')
      .leftJoinAndSelect('flightSeries.fromDestination', 'fromDestination')
      .leftJoinAndSelect('flightSeries.toDestination', 'toDestination')
      .leftJoinAndSelect('flightSeries.viaDestination', 'viaDestination')
      .orderBy('luggage.created_at', 'ASC');

    if (flightSeriesId) {
      query.andWhere('luggage.flight_series_id = :flightSeriesId', { flightSeriesId });
    }

    const luggages = await query.getMany();

    // Enrich with booking reference
    const enrichedLuggages = luggages.map((luggage) => {
      return {
        ...luggage,
        booking_reference: (luggage as any).booking_reference || luggage.booking?.booking_reference || null,
        flight_series_id: luggage.flight_series_id || null,
        flightSeries: luggage.flightSeries || null,
      };
    });

    return enrichedLuggages;
  }
}

