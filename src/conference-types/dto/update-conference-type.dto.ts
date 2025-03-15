import { PartialType } from '@nestjs/mapped-types';
import { CreateConferenceTypeDto } from './create-conference-type.dto';

export class UpdateConferenceTypeDto extends PartialType(CreateConferenceTypeDto) {}
