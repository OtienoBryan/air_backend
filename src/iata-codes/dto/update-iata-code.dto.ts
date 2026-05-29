import { PartialType } from '@nestjs/mapped-types';
import { CreateIataCodeDto } from './create-iata-code.dto';

export class UpdateIataCodeDto extends PartialType(CreateIataCodeDto) { }
