import { PartialType } from '@nestjs/mapped-types';
import { CreatePaperAuthorDto } from './create-paper-author.dto';

export class UpdatePaperAuthorDto extends PartialType(CreatePaperAuthorDto) {}
