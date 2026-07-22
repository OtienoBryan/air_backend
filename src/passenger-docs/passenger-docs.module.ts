import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerMedicalForm } from '../entities/passenger-medical-form.entity';
import { PassengerTravelDocument } from '../entities/passenger-travel-document.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PassengerDocsService } from './passenger-docs.service';
import { PassengerDocsController } from './passenger-docs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PassengerMedicalForm, PassengerTravelDocument]),
    CloudinaryModule,
  ],
  providers: [PassengerDocsService],
  controllers: [PassengerDocsController],
  exports: [PassengerDocsService],
})
export class PassengerDocsModule {}
