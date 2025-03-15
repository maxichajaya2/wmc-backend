import { PartialType } from '@nestjs/mapped-types';
import { CreateSpeakerTypeDto } from './create-speaker-type.dto';

export class UpdateSpeakerTypeDto extends PartialType(CreateSpeakerTypeDto) {}
