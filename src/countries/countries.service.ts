import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { CountryTax } from '../entities/country-tax.entity';
import { ChartOfAccount } from '../entities/chart-of-account.entity';

@Injectable()
export class CountriesService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(CountryTax)
    private countryTaxRepository: Repository<CountryTax>,
    @InjectRepository(ChartOfAccount)
    private chartOfAccountRepository: Repository<ChartOfAccount>,
  ) {}

  // Simple cache helper methods
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  async findAll(): Promise<Country[]> {
    console.log('🌍 [CountriesService] Finding all countries');
    
    // Check cache first
    const cacheKey = 'all_countries';
    const cachedCountries = this.getFromCache<Country[]>(cacheKey);
    if (cachedCountries) {
      console.log('🌍 [CountriesService] Returning cached countries:', cachedCountries.length);
      return cachedCountries;
    }

    const countries = await this.countryRepository
      .createQueryBuilder('country')
      .where('country.status = :status', { status: 1 })
      .orderBy('country.name', 'ASC')
      .getMany();

    // Cache for 10 minutes
    this.setCache(cacheKey, countries, 600000);
    
    console.log('🌍 [CountriesService] Countries found:', countries.length);
    return countries;
  }

  async findOne(id: number): Promise<Country | null> {
    console.log('🌍 [CountriesService] Finding country by ID:', id);
    
    // Check cache first
    const cacheKey = `country_${id}`;
    const cachedCountry = this.getFromCache<Country>(cacheKey);
    if (cachedCountry) {
      console.log('🌍 [CountriesService] Returning cached country');
      return cachedCountry;
    }

    const country = await this.countryRepository.findOne({
      where: { id, status: 1 }
    });

    if (country) {
      // Cache for 10 minutes
      this.setCache(cacheKey, country, 600000);
    }
    
    console.log('🌍 [CountriesService] Country found:', country ? 'Yes' : 'No');
    return country;
  }

  async findByName(name: string): Promise<Country | null> {
    const country = await this.countryRepository.findOne({ where: { name, status: 1 } });
    return country;
  }

  async findAllAdmin(): Promise<Country[]> {
    return this.countryRepository.find({ order: { name: 'ASC' } });
  }

  async create(data: { name: string; status: number; tax_percentage?: number | null }): Promise<Country> {
    const country = this.countryRepository.create(data);
    const saved = await this.countryRepository.save(country);
    this.cache.delete('all_countries');
    return saved;
  }

  async update(id: number, data: { name?: string; status?: number; tax_percentage?: number | null }): Promise<Country> {
    await this.countryRepository.update(id, data);
    this.cache.delete('all_countries');
    this.cache.delete(`country_${id}`);
    return this.countryRepository.findOne({ where: { id } }) as Promise<Country>;
  }

  async remove(id: number): Promise<void> {
    await this.countryRepository.delete(id);
    this.cache.delete('all_countries');
    this.cache.delete(`country_${id}`);
  }

  // ── Country Taxes ──────────────────────────────────────────────────────────

  async getTaxes(countryId: number): Promise<CountryTax[]> {
    return this.countryTaxRepository.find({
      where: { country_id: countryId },
      relations: ['account'],
      order: { id: 'ASC' },
    });
  }

  async addTax(countryId: number, data: { account_id: number; amount: number; currency: string }): Promise<CountryTax> {
    const country = await this.countryRepository.findOne({ where: { id: countryId } });
    if (!country) throw new NotFoundException('Country not found');
    const account = await this.chartOfAccountRepository.findOne({ where: { id: data.account_id } });
    if (!account) throw new NotFoundException('Account not found');
    const tax = this.countryTaxRepository.create({ country_id: countryId, account_id: data.account_id, amount: data.amount, currency: data.currency });
    const saved = await this.countryTaxRepository.save(tax);
    return this.countryTaxRepository.findOne({ where: { id: saved.id }, relations: ['account'] }) as Promise<CountryTax>;
  }

  async updateTax(countryId: number, taxId: number, data: { account_id?: number; amount?: number; currency?: string }): Promise<CountryTax> {
    const tax = await this.countryTaxRepository.findOne({ where: { id: taxId, country_id: countryId } });
    if (!tax) throw new NotFoundException('Tax not found');
    await this.countryTaxRepository.update(taxId, data);
    return this.countryTaxRepository.findOne({ where: { id: taxId }, relations: ['account'] }) as Promise<CountryTax>;
  }

  async removeTax(countryId: number, taxId: number): Promise<void> {
    const tax = await this.countryTaxRepository.findOne({ where: { id: taxId, country_id: countryId } });
    if (!tax) throw new NotFoundException('Tax not found');
    await this.countryTaxRepository.delete(taxId);
  }

  async getTaxAccounts(): Promise<ChartOfAccount[]> {
    return this.chartOfAccountRepository.find({ where: { account_type: 16 }, order: { name: 'ASC' } });
  }
}
