import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PassengerDocsService } from './passenger-docs.service';
import type { MedicalFormInput, TravelDocumentInput } from './passenger-docs.service';
import { PassengerMedicalForm } from '../entities/passenger-medical-form.entity';
import { PassengerTravelDocument } from '../entities/passenger-travel-document.entity';

@Controller('admin/passenger-docs')
@UseGuards(JwtAuthGuard)
export class PassengerDocsController {
  constructor(
    private readonly passengerDocsService: PassengerDocsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Must precede 'medical/:passengerId' — Nest matches routes in declaration
  // order and ':passengerId' would otherwise swallow the literal 'bulk' segment.
  @Get('medical/bulk')
  async getMedicalFormsBulk(@Query('passengerIds') passengerIds?: string): Promise<PassengerMedicalForm[]> {
    const ids = (passengerIds ?? '')
      .split(',')
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id));
    return this.passengerDocsService.getMedicalFormsForPassengers(ids);
  }

  @Get('medical/:passengerId')
  async getMedicalForm(@Param('passengerId', ParseIntPipe) passengerId: number): Promise<PassengerMedicalForm | null> {
    return this.passengerDocsService.getMedicalForm(passengerId);
  }

  @Put('medical/:passengerId')
  async saveMedicalForm(
    @Param('passengerId', ParseIntPipe) passengerId: number,
    @Body() body: MedicalFormInput,
    @Request() req,
  ): Promise<PassengerMedicalForm> {
    const staffId = req.user?.sub ? Number(req.user.sub) : null;
    return this.passengerDocsService.saveMedicalForm(passengerId, body, staffId);
  }

  @Get('travel/:passengerId')
  async getTravelDocument(@Param('passengerId', ParseIntPipe) passengerId: number): Promise<PassengerTravelDocument | null> {
    return this.passengerDocsService.getTravelDocument(passengerId);
  }

  @Put('travel/:passengerId')
  async saveTravelDocument(
    @Param('passengerId', ParseIntPipe) passengerId: number,
    @Body() body: TravelDocumentInput,
    @Request() req,
  ): Promise<PassengerTravelDocument> {
    const staffId = req.user?.sub ? Number(req.user.sub) : null;
    return this.passengerDocsService.saveTravelDocument(passengerId, body, staffId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    if (!file) {
      throw new Error('No file provided');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }
    return this.cloudinaryService.uploadDocument(file, 'passenger-documents');
  }
}
