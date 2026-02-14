import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaperType } from '../../domain/entities/paper.entity';
import { PaperAuthorType } from '../../domain/entities/paper-author.entity';

export class CreateAuthorDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsEnum(PaperAuthorType)
  type: PaperAuthorType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  middle?: string;

  @IsString()
  @IsOptional()
  last?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  other?:string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  professionalDesignation?: string;

  @IsString()
  @IsOptional()
  remissive?: string | null;

  @IsString()
  @IsOptional()
  institution?: string | null;

  @IsString()
  @IsOptional()
  countryCode?: string | null;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  emailCorp?: string;

  @IsString()
  @IsOptional()
  cellphone?: string;
}

export class CreatePaperDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsString()
  @IsOptional()
  resume: string | null;

  @IsString()
  @IsOptional()
  authorBiography: string | null;

  @IsString()
  @IsOptional()
  abstractText: string | null;

  @IsString()
  @IsOptional()
  proposalSignificance: string | null;

  @IsBoolean()
  @IsNotEmpty()
  agreeTerms?: boolean;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  file: string | null;

 @IsString()
  @IsOptional()
  copyrightForm?: string | null;

  @IsNumber()
  topicId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAuthorDto)
  @IsOptional()
  authors: CreateAuthorDto[];

  @IsNumber()
  categoryId: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  keywords: string[];

  @IsBoolean()
  @IsOptional()
  flagEvent?: boolean;

  @IsString()
  @IsOptional()
  eventWhere?: string;

  @IsNumber()
  @IsOptional()
  webUserId?: number;

  @IsString()
  @IsOptional()
  eventWhich?: string;

  @IsString()
  @IsOptional()
  eventDate?: Date;

  @IsEnum(PaperType)
  @IsOptional()
  type?: PaperType;
}
