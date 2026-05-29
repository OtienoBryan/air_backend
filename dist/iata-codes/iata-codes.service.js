"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IataCodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const iata_code_entity_1 = require("../entities/iata-code.entity");
const https = __importStar(require("https"));
let IataCodesService = class IataCodesService {
    iataCodesRepository;
    constructor(iataCodesRepository) {
        this.iataCodesRepository = iataCodesRepository;
    }
    async findAll(page = 1, limit = 50, search) {
        try {
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 50;
            console.log('🔍 [IataCodesService] findAll called with:', { page, limit, search, converted: { pageNum, limitNum } });
            const skip = (pageNum - 1) * limitNum;
            let whereCondition = {};
            if (search) {
                whereCondition = [
                    { code: (0, typeorm_2.Like)(`%${search}%`) },
                    { icao: (0, typeorm_2.Like)(`%${search}%`) },
                    { airport: (0, typeorm_2.Like)(`%${search}%`) },
                    { city: (0, typeorm_2.Like)(`%${search}%`) },
                    { country_code: (0, typeorm_2.Like)(`%${search}%`) },
                    { region_name: (0, typeorm_2.Like)(`%${search}%`) },
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
        }
        catch (error) {
            console.error('❌ [IataCodesService] Error in findAll:', error);
            console.error('❌ [IataCodesService] Error stack:', error.stack);
            throw error;
        }
    }
    async findOne(id) {
        const iataCode = await this.iataCodesRepository.findOne({ where: { id } });
        if (!iataCode) {
            throw new common_1.NotFoundException(`IATA code with ID ${id} not found`);
        }
        return iataCode;
    }
    async findByCode(code) {
        const iataCode = await this.iataCodesRepository.findOne({ where: { code } });
        if (!iataCode) {
            throw new common_1.NotFoundException(`IATA code ${code} not found`);
        }
        return iataCode;
    }
    async create(createIataCodeDto) {
        const existing = await this.iataCodesRepository.findOne({
            where: { code: createIataCodeDto.code }
        });
        if (existing) {
            throw new common_1.ConflictException(`IATA code ${createIataCodeDto.code} already exists`);
        }
        const iataCode = this.iataCodesRepository.create(createIataCodeDto);
        return await this.iataCodesRepository.save(iataCode);
    }
    async update(id, updateIataCodeDto) {
        const iataCode = await this.findOne(id);
        if (updateIataCodeDto.code && updateIataCodeDto.code !== iataCode.code) {
            const existing = await this.iataCodesRepository.findOne({
                where: { code: updateIataCodeDto.code }
            });
            if (existing) {
                throw new common_1.ConflictException(`IATA code ${updateIataCodeDto.code} already exists`);
            }
        }
        Object.assign(iataCode, updateIataCodeDto);
        return await this.iataCodesRepository.save(iataCode);
    }
    async remove(id) {
        const iataCode = await this.findOne(id);
        await this.iataCodesRepository.remove(iataCode);
    }
    async bulkInsert(iataCodes) {
        let inserted = 0;
        let skipped = 0;
        const batchSize = 100;
        for (let i = 0; i < iataCodes.length; i += batchSize) {
            const batch = iataCodes.slice(i, i + batchSize);
            for (const iataCodeDto of batch) {
                try {
                    const existing = await this.iataCodesRepository.findOne({
                        where: { code: iataCodeDto.code }
                    });
                    if (!existing) {
                        const iataCode = this.iataCodesRepository.create(iataCodeDto);
                        await this.iataCodesRepository.save(iataCode);
                        inserted++;
                    }
                    else {
                        skipped++;
                    }
                }
                catch (error) {
                    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('duplicate')) {
                        skipped++;
                    }
                    else {
                        console.error(`Error inserting IATA code ${iataCodeDto.code}:`, error.message || error);
                        skipped++;
                    }
                }
            }
            if (iataCodes.length > batchSize && (i + batchSize) % 500 === 0) {
                console.log(`   Processed ${Math.min(i + batchSize, iataCodes.length)} of ${iataCodes.length} codes...`);
            }
        }
        return { inserted, skipped };
    }
    async fetchFromInternet() {
        const CSV_URL = 'https://raw.githubusercontent.com/ip2location/ip2location-iata-icao/master/iata-icao.csv';
        console.log('🌍 [IataCodesService] Fetching IATA codes from internet...');
        console.log('📥 [IataCodesService] Downloading from:', CSV_URL);
        try {
            const csvData = await new Promise((resolve, reject) => {
                const request = https.get(CSV_URL, (res) => {
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
            const lines = csvData.split(/\r\n|\r|\n/).filter(line => line.trim());
            const iataCodes = [];
            if (lines.length === 0) {
                throw new Error('No data found in CSV file');
            }
            console.log(`📊 [IataCodesService] CSV has ${lines.length} lines (including header)`);
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line)
                    continue;
                const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (!matches || matches.length < 7)
                    continue;
                const cleanValue = (val) => val ? val.replace(/^"|"$/g, '').trim() : null;
                const countryCode = cleanValue(matches[0]);
                const regionName = cleanValue(matches[1]);
                const iata = cleanValue(matches[2]);
                const icao = cleanValue(matches[3]);
                const airport = cleanValue(matches[4]);
                const latitudeStr = matches[5] ? cleanValue(matches[5]) : null;
                const longitudeStr = matches[6] ? cleanValue(matches[6]) : null;
                const latitude = latitudeStr ? parseFloat(latitudeStr) || undefined : undefined;
                const longitude = longitudeStr ? parseFloat(longitudeStr) || undefined : undefined;
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
            const result = await this.bulkInsert(iataCodes);
            console.log('✅ [IataCodesService] Internet fetch completed:', result);
            return { ...result, total: iataCodes.length };
        }
        catch (error) {
            console.error('❌ [IataCodesService] Error in fetchFromInternet:', error);
            console.error('❌ [IataCodesService] Error message:', error.message);
            console.error('❌ [IataCodesService] Error stack:', error.stack);
            throw new Error(`Failed to fetch IATA codes from internet: ${error.message}`);
        }
    }
};
exports.IataCodesService = IataCodesService;
exports.IataCodesService = IataCodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(iata_code_entity_1.IataCode)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IataCodesService);
//# sourceMappingURL=iata-codes.service.js.map