import { PartialType } from '@nestjs/mapped-types';
import { CreatePavilionDto } from './create-pavilion.dto';

export class UpdatePavilionDto extends PartialType(CreatePavilionDto) {}
