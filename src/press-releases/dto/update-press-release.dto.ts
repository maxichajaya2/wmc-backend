import { PartialType } from '@nestjs/mapped-types';
import { CreatePressReleaseDto } from './create-press-release.dto';

export class UpdatePressReleaseDto extends PartialType(CreatePressReleaseDto) {}
