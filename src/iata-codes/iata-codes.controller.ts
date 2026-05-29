import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
    UseGuards
} from '@nestjs/common';
import { IataCodesService } from './iata-codes.service';
import { IataCode } from '../entities/iata-code.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIataCodeDto } from './dto/create-iata-code.dto';
import { UpdateIataCodeDto } from './dto/update-iata-code.dto';

@Controller('admin/iata-codes')
@UseGuards(JwtAuthGuard)
export class IataCodesController {
    constructor(private readonly iataCodesService: IataCodesService) { }

    @Get()
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 50,
        @Query('search') search?: string,
    ): Promise<{ iataCodes: IataCode[], total: number }> {
        try {
            console.log('✈️  [IataCodesController] GET /admin/iata-codes', { page, limit, search, types: { page: typeof page, limit: typeof limit } });
            const result = await this.iataCodesService.findAll(page, limit, search);
            console.log('✅ [IataCodesController] Successfully fetched IATA codes:', { total: result.total, returned: result.iataCodes.length });
            return result;
        } catch (error) {
            console.error('❌ [IataCodesController] Error in findAll:', error);
            console.error('❌ [IataCodesController] Error message:', error.message);
            console.error('❌ [IataCodesController] Error stack:', error.stack);
            throw error;
        }
    }

    @Get('code/:code')
    async findByCode(@Param('code') code: string): Promise<IataCode> {
        console.log(`✈️  [IataCodesController] GET /admin/iata-codes/code/${code}`);
        return this.iataCodesService.findByCode(code);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IataCode> {
        console.log(`✈️  [IataCodesController] GET /admin/iata-codes/${id}`);
        return this.iataCodesService.findOne(id);
    }

    @Post()
    async create(@Body() createIataCodeDto: CreateIataCodeDto): Promise<IataCode> {
        console.log('✈️  [IataCodesController] POST /admin/iata-codes');
        console.log('✈️  [IataCodesController] Create IATA code data:', JSON.stringify(createIataCodeDto, null, 2));
        try {
            const result = await this.iataCodesService.create(createIataCodeDto);
            console.log('✅ [IataCodesController] IATA code created successfully:', result.id);
            return result;
        } catch (error) {
            console.error('❌ [IataCodesController] Error in create:', error);
            throw error;
        }
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateIataCodeDto: UpdateIataCodeDto
    ): Promise<IataCode> {
        console.log(`✈️  [IataCodesController] PUT /admin/iata-codes/${id}`);
        console.log('✈️  [IataCodesController] Update IATA code data:', updateIataCodeDto);
        return this.iataCodesService.update(id, updateIataCodeDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        console.log(`✈️  [IataCodesController] DELETE /admin/iata-codes/${id}`);
        await this.iataCodesService.remove(id);
        return { message: 'IATA code deleted successfully' };
    }

    @Post('bulk')
    async bulkInsert(@Body() iataCodes: CreateIataCodeDto[]): Promise<{ inserted: number, skipped: number }> {
        console.log('✈️  [IataCodesController] POST /admin/iata-codes/bulk');
        console.log('✈️  [IataCodesController] Bulk insert IATA codes:', iataCodes.length);
        try {
            const result = await this.iataCodesService.bulkInsert(iataCodes);
            console.log('✅ [IataCodesController] Bulk insert completed:', result);
            return result;
        } catch (error) {
            console.error('❌ [IataCodesController] Error in bulk insert:', error);
            throw error;
        }
    }

    @Post('fetch-from-internet')
    async fetchFromInternet(): Promise<{ inserted: number, skipped: number, total: number }> {
        console.log('✈️  [IataCodesController] POST /admin/iata-codes/fetch-from-internet');
        try {
            const result = await this.iataCodesService.fetchFromInternet();
            console.log('✅ [IataCodesController] Internet fetch completed:', result);
            return result;
        } catch (error) {
            console.error('❌ [IataCodesController] Error fetching from internet:', error);
            throw error;
        }
    }
}
