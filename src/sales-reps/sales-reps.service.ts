import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { Country } from '../entities/country.entity';
import { Region } from '../entities/region.entity';
import { Route } from '../entities/route.entity';

@Injectable()
export class SalesRepsService {
  constructor(
    @InjectRepository(SalesRep)
    private salesRepRepository: Repository<SalesRep>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  async findAll(): Promise<SalesRep[]> {
    return this.salesRepRepository.find({
      select: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'countryId',
        'country',
        'region_id',
        'region',
        'route_id',
        'route',
        'route_id_update',
        'route_name_update',
        'visits_targets',
        'new_clients',
        'vapes_targets',
        'pouches_targets',
        'role',
        'manager_type',
        'status',
        'createdAt'
      ]
    });
  }

  async findOne(id: number): Promise<SalesRep | null> {
    return this.salesRepRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'countryId',
        'country',
        'region_id',
        'region',
        'route_id',
        'route',
        'route_id_update',
        'route_name_update',
        'visits_targets',
        'new_clients',
        'vapes_targets',
        'pouches_targets',
        'role',
        'manager_type',
        'status',
        'createdAt'
      ]
    });
  }

  async create(salesRepData: Partial<SalesRep>): Promise<SalesRep> {
    const salesRep = this.salesRepRepository.create(salesRepData);
    return this.salesRepRepository.save(salesRep);
  }

  async update(id: number, salesRepData: Partial<SalesRep>): Promise<SalesRep> {
    await this.salesRepRepository.update(id, salesRepData);
    const updatedSalesRep = await this.findOne(id);
    if (!updatedSalesRep) {
      throw new Error('Sales representative not found');
    }
    return updatedSalesRep;
  }

  async remove(id: number): Promise<void> {
    await this.salesRepRepository.delete(id);
  }

  async getSalesRepStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCountry: Record<string, number>;
    byRegion: Record<string, number>;
  }> {
    const salesReps = await this.findAll();
    
    const total = salesReps.length;
    const active = salesReps.filter(rep => rep.status === 1).length;
    const inactive = total - active;
    
    const byCountry = salesReps.reduce((acc, rep) => {
      acc[rep.country] = (acc[rep.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byRegion = salesReps.reduce((acc, rep) => {
      acc[rep.region] = (acc[rep.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      byCountry,
      byRegion
    };
  }

  async getCountries(): Promise<Country[]> {
    try {
      console.log('🌍 [SalesRepsService] Fetching countries...');
      
      // First, let's try to get all countries without filtering to see what's in the table
      const allCountries = await this.countryRepository.find();
      console.log('🌍 [SalesRepsService] All countries found:', allCountries);
      
      // Now try with status filter - but let's also try without filter to see all countries
      const activeCountries = await this.countryRepository.find({
        where: { status: 1 }, // Only active countries
        select: ['id', 'name', 'status']
      });
      
      // If no active countries found, get all countries
      if (activeCountries.length === 0) {
        console.log('⚠️ [SalesRepsService] No active countries found, fetching all countries');
        const allCountriesForSelect = await this.countryRepository.find({
          select: ['id', 'name', 'status']
        });
        console.log('🌍 [SalesRepsService] All countries for selection:', allCountriesForSelect);
        return allCountriesForSelect;
      }
      
      console.log('🌍 [SalesRepsService] Active countries found:', activeCountries);
      
      return activeCountries;
    } catch (error) {
      console.error('❌ [SalesRepsService] Error fetching countries:', error);
      throw error;
    }
  }

  async getRegions(countryId?: number): Promise<Region[]> {
    try {
      console.log('🌍 [SalesRepsService] Fetching regions...', { countryId });
      
      const whereCondition = countryId ? { countryId, status: 1 } : { status: 1 };
      
      const regions = await this.regionRepository.find({
        where: whereCondition,
        select: ['id', 'name', 'countryId', 'status']
      });
      
      console.log('🌍 [SalesRepsService] Regions found:', regions);
      
      // If no active regions found, get all regions
      if (regions.length === 0) {
        console.log('⚠️ [SalesRepsService] No active regions found, fetching all regions');
        const allRegions = await this.regionRepository.find({
          select: ['id', 'name', 'countryId', 'status']
        });
        console.log('🌍 [SalesRepsService] All regions:', allRegions);
        return allRegions;
      }
      
      return regions;
    } catch (error) {
      console.error('❌ [SalesRepsService] Error fetching regions:', error);
      throw error;
    }
  }

  async getRoutes(regionId?: number): Promise<Route[]> {
    try {
      console.log('🛣️ [SalesRepsService] Fetching routes...', { regionId });
      
      const whereCondition = regionId ? { region: regionId, status: 1 } : { status: 1 };
      
      const routes = await this.routeRepository.find({
        where: whereCondition,
        select: ['id', 'name', 'region', 'region_name', 'country_id', 'country_name', 'status']
      });
      
      console.log('🛣️ [SalesRepsService] Routes found:', routes);
      
      // If no active routes found, get all routes
      if (routes.length === 0) {
        console.log('⚠️ [SalesRepsService] No active routes found, fetching all routes');
        const allRoutes = await this.routeRepository.find({
          select: ['id', 'name', 'region', 'region_name', 'country_id', 'country_name', 'status']
        });
        console.log('🛣️ [SalesRepsService] All routes:', allRoutes);
        return allRoutes;
      }
      
      return routes;
    } catch (error) {
      console.error('❌ [SalesRepsService] Error fetching routes:', error);
      throw error;
    }
  }
}
