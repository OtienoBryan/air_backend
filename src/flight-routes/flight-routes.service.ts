import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightRoute } from '../entities/flight-route.entity';
import { FareHistory } from '../entities/fare-history.entity';

@Injectable()
export class FlightRoutesService {
  constructor(
    @InjectRepository(FlightRoute)
    private routeRepository: Repository<FlightRoute>,
    @InjectRepository(FareHistory)
    private fareHistoryRepository: Repository<FareHistory>,
  ) {}

  async findAll(): Promise<FlightRoute[]> {
    return this.routeRepository.find({
      relations: ['fromDestination', 'toDestination'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<FlightRoute> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['fromDestination', 'toDestination'],
    });
    if (!route) throw new NotFoundException(`Route #${id} not found`);
    return route;
  }

  async create(data: Partial<FlightRoute>): Promise<FlightRoute> {
    const route = this.routeRepository.create(data);
    const saved = await this.routeRepository.save(route);
    return this.findOne(saved.id);
  }

  async update(id: number, data: Partial<FlightRoute>): Promise<FlightRoute> {
    const existing = await this.findOne(id);

    // If any fare is changing, snapshot the current fares to history
    const fareKeys: (keyof FlightRoute)[] = ['adult_fare', 'child_fare', 'infant_fare', 'adult_return_fare', 'child_return_fare', 'infant_return_fare', 'fare_valid_from', 'fare_valid_to'];
    const fareChanging = fareKeys.some(k => k in data && data[k] !== existing[k]);

    if (fareChanging) {
      await this.fareHistoryRepository.save(
        this.fareHistoryRepository.create({
          route_id: id,
          adult_fare: existing.adult_fare,
          child_fare: existing.child_fare,
          infant_fare: existing.infant_fare,
          adult_return_fare: existing.adult_return_fare,
          child_return_fare: existing.child_return_fare,
          infant_return_fare: existing.infant_return_fare,
          fare_valid_from: existing.fare_valid_from,
          fare_valid_to: existing.fare_valid_to,
        }),
      );
    }

    await this.routeRepository.update(id, {
      ...data,
      fromDestination: undefined,
      toDestination: undefined,
    });
    return this.findOne(id);
  }

  async getFareHistory(routeId: number): Promise<FareHistory[]> {
    return this.fareHistoryRepository.find({
      where: { route_id: routeId },
      order: { changed_at: 'DESC' },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.routeRepository.delete(id);
    return { message: 'Route deleted successfully' };
  }
}
