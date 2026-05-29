import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { SalesRep } from '../entities/sales-rep.entity';

export interface AttendanceRecord {
  id: number;
  userId: number;
  salesRepName: string;
  salesRepEmail: string;
  timezone: string;
  duration: number;
  status: number;
  sessionStart: string;
  sessionEnd: string;
  country: string;
  region: string;
  route: string;
}

export interface AttendanceStats {
  totalSessions: number;
  totalDuration: number;
  averageSessionDuration: number;
  activeSalesReps: number;
  byStatus: Record<number, number>;
  byCountry: Record<string, number>;
  byRegion: Record<string, number>;
}

@Injectable()
export class SalesRepAttendanceService {
  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    @InjectRepository(SalesRep)
    private salesRepRepository: Repository<SalesRep>,
  ) {}

  async getAttendanceRecords(
    salesRepId?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<AttendanceRecord[]> {
    try {
      console.log('📊 [SalesRepAttendanceService] Fetching attendance records...', {
        salesRepId,
        startDate,
        endDate,
        status,
        limit,
        offset
      });

      let query = this.loginHistoryRepository
        .createQueryBuilder('lh')
        .leftJoinAndSelect('lh.salesRep', 'sr')
        .select([
          'lh.id',
          'lh.userId',
          'lh.timezone',
          'lh.duration',
          'lh.status',
          'lh.sessionStart',
          'lh.sessionEnd',
          'sr.name',
          'sr.email',
          'sr.country',
          'sr.region',
          'sr.route'
        ]);

      // Apply filters
      if (salesRepId) {
        query = query.andWhere('lh.userId = :salesRepId', { salesRepId });
      }

      if (startDate) {
        // Use DATE() function to extract date part for comparison
        query = query.andWhere('DATE(lh.sessionStart) >= :startDate', { startDate });
        console.log('📊 [SalesRepAttendanceService] Added startDate filter:', startDate);
      }

      if (endDate) {
        // Use DATE() function to extract date part for comparison
        query = query.andWhere('DATE(lh.sessionStart) <= :endDate', { endDate });
        console.log('📊 [SalesRepAttendanceService] Added endDate filter:', endDate);
      }

      if (status !== undefined) {
        query = query.andWhere('lh.status = :status', { status });
      }

      // Order by session start date (most recent first)
      query = query.orderBy('lh.sessionStart', 'DESC');

      // Apply pagination
      query = query.limit(limit).offset(offset);

      console.log('📊 [SalesRepAttendanceService] Generated SQL query:', query.getSql());
      console.log('📊 [SalesRepAttendanceService] Query parameters:', query.getParameters());

      const records = await query.getMany();

      console.log('📊 [SalesRepAttendanceService] Records found:', records.length);
      console.log('📊 [SalesRepAttendanceService] Raw records:', records);

      const mappedRecords = records.map(record => ({
        id: record.id,
        userId: record.userId,
        salesRepName: record.salesRep?.name || 'Unknown',
        salesRepEmail: record.salesRep?.email || 'Unknown',
        timezone: record.timezone,
        duration: record.duration,
        status: record.status,
        sessionStart: record.sessionStart,
        sessionEnd: record.sessionEnd,
        country: record.salesRep?.country || 'Unknown',
        region: record.salesRep?.region || 'Unknown',
        route: record.salesRep?.route || 'Unknown'
      }));

      console.log('📊 [SalesRepAttendanceService] Mapped records:', mappedRecords.map(r => ({
        id: r.id,
        sessionStart: r.sessionStart,
        sessionEnd: r.sessionEnd,
        duration: r.duration
      })));

      return mappedRecords;
    } catch (error) {
      console.error('❌ [SalesRepAttendanceService] Error fetching attendance records:', error);
      throw error;
    }
  }

  async getAttendanceStats(
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceStats> {
    try {
      console.log('📊 [SalesRepAttendanceService] Fetching attendance stats...', {
        startDate,
        endDate
      });

      let query = this.loginHistoryRepository.createQueryBuilder('lh');

      // Apply date filters
      if (startDate) {
        // Use DATE() function to extract date part for comparison
        query = query.andWhere('DATE(lh.sessionStart) >= :startDate', { startDate });
        console.log('📊 [SalesRepAttendanceService] Stats - Added startDate filter:', startDate);
      }

      if (endDate) {
        // Use DATE() function to extract date part for comparison
        query = query.andWhere('DATE(lh.sessionStart) <= :endDate', { endDate });
        console.log('📊 [SalesRepAttendanceService] Stats - Added endDate filter:', endDate);
      }

      const records = await query.getMany();

      // Calculate stats
      const totalSessions = records.length;
      const totalDuration = records.reduce((sum, record) => sum + (record.duration || 0), 0);
      const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

      // Get unique active sales reps
      const uniqueUserIds = new Set(records.map(record => record.userId).filter(id => id !== null));
      const activeSalesReps = uniqueUserIds.size;

      // Group by status
      const byStatus = records.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Get sales rep details for grouping by country/region
      const salesRepIds = Array.from(uniqueUserIds);
      const salesReps = await this.salesRepRepository.findByIds(salesRepIds);

      // Group by country
      const byCountry = salesReps.reduce((acc, rep) => {
        acc[rep.country] = (acc[rep.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by region
      const byRegion = salesReps.reduce((acc, rep) => {
        acc[rep.region] = (acc[rep.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const stats: AttendanceStats = {
        totalSessions,
        totalDuration,
        averageSessionDuration: Math.round(averageSessionDuration),
        activeSalesReps,
        byStatus,
        byCountry,
        byRegion
      };

      console.log('📊 [SalesRepAttendanceService] Stats calculated:', stats);

      return stats;
    } catch (error) {
      console.error('❌ [SalesRepAttendanceService] Error fetching attendance stats:', error);
      throw error;
    }
  }

  async getSalesReps(): Promise<SalesRep[]> {
    try {
      console.log('👥 [SalesRepAttendanceService] Fetching sales reps...');
      
      const salesReps = await this.salesRepRepository.find({
        select: ['id', 'name', 'email', 'country', 'region', 'route', 'status'],
        where: { status: 1 } // Only active sales reps
      });

      console.log('👥 [SalesRepAttendanceService] Sales reps found:', salesReps.length);
      
      return salesReps;
    } catch (error) {
      console.error('❌ [SalesRepAttendanceService] Error fetching sales reps:', error);
      throw error;
    }
  }
}
