import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountriesService {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
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
    console.log('🌍 [CountriesService] Finding country by name:', name);
    
    const country = await this.countryRepository.findOne({
      where: { name: name, status: 1 }
    });
    
    console.log('🌍 [CountriesService] Country found by name:', country ? 'Yes' : 'No');
    return country;
  }
}
