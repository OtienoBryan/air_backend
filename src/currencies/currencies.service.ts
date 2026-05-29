import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../entities/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.currencyRepository.find({ order: { is_default: 'DESC', name: 'ASC' } });
  }

  async findOne(id: number): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({ where: { id } });
    if (!currency) throw new NotFoundException(`Currency #${id} not found`);
    return currency;
  }

  async create(data: Partial<Currency>): Promise<Currency> {
    const currency = this.currencyRepository.create({ ...data, is_default: 0 });
    return this.currencyRepository.save(currency);
  }

  async update(id: number, data: Partial<Currency>): Promise<Currency> {
    await this.findOne(id);
    await this.currencyRepository.update(id, data);
    return this.findOne(id);
  }

  async setDefault(id: number): Promise<Currency> {
    await this.findOne(id);
    // Clear any existing default first
    await this.currencyRepository
      .createQueryBuilder()
      .update()
      .set({ is_default: 0 })
      .where('id != :id', { id })
      .execute();
    await this.currencyRepository.update(id, { is_default: 1 });
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.currencyRepository.delete(id);
    return { message: 'Currency deleted successfully' };
  }
}
