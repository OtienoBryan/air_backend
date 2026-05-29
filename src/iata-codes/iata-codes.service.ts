import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { IataCode } from '../entities/iata-code.entity';
import { CreateIataCodeDto } from './dto/create-iata-code.dto';
import { UpdateIataCodeDto } from './dto/update-iata-code.dto';
import * as https from 'https';

@Injectable()
export class IataCodesService {
    constructor(
        @InjectRepository(IataCode)
        private iataCodesRepository: Repository<IataCode>,
    ) { }

    async findAll(page: number = 1, limit: number = 50, search?: string): Promise<{ iataCodes: IataCode[], total: number }> {
        try {
            // Ensure page and limit are numbers
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 50;

            console.log('🔍 [IataCodesService] findAll called with:', { page, limit, search, converted: { pageNum, limitNum } });
            const skip = (pageNum - 1) * limitNum;

            let whereCondition = {};
            if (search) {
                whereCondition = [
                    { code: Like(`%${search}%`) },
                    { icao: Like(`%${search}%`) },
                    { airport: Like(`%${search}%`) },
                    { city: Like(`%${search}%`) },
                    { country_code: Like(`%${search}%`) },
                    { region_name: Like(`%${search}%`) },
                ];
            }

            console.log('🔍 [IataCodesService] Query params:', { skip, limit: limitNum, whereCondition });

            const [iataCodes, total] = await this.iataCodesRepository.findAndCount({
                where: whereCondition,
                skip,
                take: limitNum,
                order: { code: 'ASC' },
            });

            console.log('✅ [IataCodesService] Query successful:', { total, returned: iataCodes.length });
            return { iataCodes, total };
        } catch (error) {
            console.error('❌ [IataCodesService] Error in findAll:', error);
            console.error('❌ [IataCodesService] Error stack:', error.stack);
            throw error;
        }
    }

    async findOne(id: number): Promise<IataCode> {
        const iataCode = await this.iataCodesRepository.findOne({ where: { id } });
        if (!iataCode) {
            throw new NotFoundException(`IATA code with ID ${id} not found`);
        }
        return iataCode;
    }

    async findByCode(code: string): Promise<IataCode> {
        const iataCode = await this.iataCodesRepository.findOne({ where: { code } });
        if (!iataCode) {
            throw new NotFoundException(`IATA code ${code} not found`);
        }
        return iataCode;
    }

    async create(createIataCodeDto: CreateIataCodeDto): Promise<IataCode> {
        const existing = await this.iataCodesRepository.findOne({
            where: { code: createIataCodeDto.code }
        });

        if (existing) {
            throw new ConflictException(`IATA code ${createIataCodeDto.code} already exists`);
        }

        const iataCode = this.iataCodesRepository.create(createIataCodeDto);
        return await this.iataCodesRepository.save(iataCode);
    }

    async update(id: number, updateIataCodeDto: UpdateIataCodeDto): Promise<IataCode> {
        const iataCode = await this.findOne(id);

        if (updateIataCodeDto.code && updateIataCodeDto.code !== iataCode.code) {
            const existing = await this.iataCodesRepository.findOne({
                where: { code: updateIataCodeDto.code }
            });
            if (existing) {
                throw new ConflictException(`IATA code ${updateIataCodeDto.code} already exists`);
            }
        }

        Object.assign(iataCode, updateIataCodeDto);
        return await this.iataCodesRepository.save(iataCode);
    }

    async remove(id: number): Promise<void> {
        const iataCode = await this.findOne(id);
        await this.iataCodesRepository.remove(iataCode);
    }

    async bulkInsert(iataCodes: CreateIataCodeDto[]): Promise<{ inserted: number, skipped: number }> {
        let inserted = 0;
        let skipped = 0;

        // Process in batches to avoid overwhelming the database
        const batchSize = 100;
        for (let i = 0; i < iataCodes.length; i += batchSize) {
            const batch = iataCodes.slice(i, i + batchSize);
            
            for (const iataCodeDto of batch) {
                try {
                    // Check if code already exists
                    const existing = await this.iataCodesRepository.findOne({
                        where: { code: iataCodeDto.code }
                    });

                    if (!existing) {
                        const iataCode = this.iataCodesRepository.create(iataCodeDto);
                        await this.iataCodesRepository.save(iataCode);
                        inserted++;
                    } else {
                        skipped++;
                    }
                } catch (error: any) {
                    // Handle specific error types
                    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('duplicate')) {
                        skipped++;
                    } else {
                        console.error(`Error inserting IATA code ${iataCodeDto.code}:`, error.message || error);
                        skipped++;
                    }
                }
            }

            // Log progress for large batches
            if (iataCodes.length > batchSize && (i + batchSize) % 500 === 0) {
                console.log(`   Processed ${Math.min(i + batchSize, iataCodes.length)} of ${iataCodes.length} codes...`);
            }
        }

        return { inserted, skipped };
    }

    async fetchFromInternet(): Promise<{ inserted: number, skipped: number, total: number }> {
        const CSV_URL = 'https://raw.githubusercontent.com/ip2location/ip2location-iata-icao/master/iata-icao.csv';
        
        console.log('🌍 [IataCodesService] Fetching IATA codes from internet...');
        console.log('📥 [IataCodesService] Downloading from:', CSV_URL);

        try {
            // Download CSV
            const csvData = await new Promise<string>((resolve, reject) => {
                const request = https.get(CSV_URL, (res) => {
                    // Check for redirects
                    if (res.statusCode === 301 || res.statusCode === 302) {
                        console.log('🔄 [IataCodesService] Redirect detected:', res.headers.location);
                        return reject(new Error(`Redirect to: ${res.headers.location}`));
                    }

                    if (res.statusCode !== 200) {
                        return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }

                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        if (!data || data.length === 0) {
                            return reject(new Error('Empty response from server'));
                        }
                        resolve(data);
                    });
                });

                request.on('error', (err) => {
                    console.error('❌ [IataCodesService] Network error:', err);
                    reject(new Error(`Network error: ${err.message}`));
                });

                request.setTimeout(30000, () => {
                    request.destroy();
                    reject(new Error('Request timeout after 30 seconds'));
                });
            });

            console.log('✅ [IataCodesService] CSV data downloaded successfully, size:', csvData.length, 'bytes');

            // Parse CSV - handle different line endings
            const lines = csvData.split(/\r\n|\r|\n/).filter(line => line.trim());
            const iataCodes: CreateIataCodeDto[] = [];
            
            if (lines.length === 0) {
                throw new Error('No data found in CSV file');
            }

            console.log(`📊 [IataCodesService] CSV has ${lines.length} lines (including header)`);

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Parse CSV line (handling quoted fields)
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!matches || matches.length < 7) continue;

            const cleanValue = (val: string) => val ? val.replace(/^"|"$/g, '').trim() : null;

            const countryCode = cleanValue(matches[0]);
            const regionName = cleanValue(matches[1]);
            const iata = cleanValue(matches[2]);
            const icao = cleanValue(matches[3]);
            const airport = cleanValue(matches[4]);
            const latitudeStr = matches[5] ? cleanValue(matches[5]) : null;
            const longitudeStr = matches[6] ? cleanValue(matches[6]) : null;
            const latitude = latitudeStr ? parseFloat(latitudeStr) || undefined : undefined;
            const longitude = longitudeStr ? parseFloat(longitudeStr) || undefined : undefined;

            // Only include entries with valid IATA codes
            if (iata && iata.length === 3 && airport && countryCode && countryCode.length === 2) {
                iataCodes.push({
                    code: iata.toUpperCase(),
                    icao: icao ? icao.toUpperCase() : undefined,
                    airport: airport,
                    city: undefined,
                    country_code: countryCode.toUpperCase(),
                    region_name: regionName || undefined,
                    latitude: latitude,
                    longitude: longitude,
                    status: 'active'
                });
            }
        }

            console.log(`✅ [IataCodesService] Parsed ${iataCodes.length} IATA codes from internet`);

            if (iataCodes.length === 0) {
                throw new Error('No valid IATA codes found in CSV file');
            }

            // Bulk insert
            const result = await this.bulkInsert(iataCodes);
            
            console.log('✅ [IataCodesService] Internet fetch completed:', result);
            return { ...result, total: iataCodes.length };
        } catch (error) {
            console.error('❌ [IataCodesService] Error in fetchFromInternet:', error);
            console.error('❌ [IataCodesService] Error message:', error.message);
            console.error('❌ [IataCodesService] Error stack:', error.stack);
            throw new Error(`Failed to fetch IATA codes from internet: ${error.message}`);
        }
    }
}
