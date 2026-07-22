import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PassengerDocsService } from './passenger-docs.service';
import type { MedicalFormInput, TravelDocumentInput } from './passenger-docs.service';
import { PassengerMedicalForm } from '../entities/passenger-medical-form.entity';
import { PassengerTravelDocument } from '../entities/passenger-travel-document.entity';
export declare class PassengerDocsController {
    private readonly passengerDocsService;
    private readonly cloudinaryService;
    constructor(passengerDocsService: PassengerDocsService, cloudinaryService: CloudinaryService);
    getMedicalFormsBulk(passengerIds?: string): Promise<PassengerMedicalForm[]>;
    getMedicalForm(passengerId: number): Promise<PassengerMedicalForm | null>;
    saveMedicalForm(passengerId: number, body: MedicalFormInput, req: any): Promise<PassengerMedicalForm>;
    getTravelDocument(passengerId: number): Promise<PassengerTravelDocument | null>;
    saveTravelDocument(passengerId: number, body: TravelDocumentInput, req: any): Promise<PassengerTravelDocument>;
    uploadDocument(file: Express.Multer.File): Promise<{
        url: string;
        public_id: string;
    }>;
}
