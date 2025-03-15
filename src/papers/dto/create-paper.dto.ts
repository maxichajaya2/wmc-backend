import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { DocumentType } from "../../domain/entities/web-user.entity";

export class CreateAuthorDto{

    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    middle: string;

    @IsString()
    @IsNotEmpty()
    last: string;

    @IsString()
    @IsOptional()
    remissive: string | null;

    @IsString()
    @IsOptional()
    institution: string | null;

    @IsString()
    @IsOptional()
    countryCode: string | null;

    @IsString()
    @IsOptional()
    city: string | null;

    @IsBoolean()
    flagpotential: boolean;

    @IsBoolean()
    flagcorrespon: boolean;

    @IsString()
    email: string;
}

export class CreatePaperDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    resume: string | null;

    @IsString()
    @IsOptional()
    file: string | null;

    @IsString()
    @IsOptional()
    userName: string | null;

    @IsString()
    @IsOptional()
    userLastName: string | null;

    @IsString()
    @IsOptional()
    userEmail: string | null;

    @IsEnum(DocumentType)
    userDocumentType: DocumentType;

    @IsString()
    @IsOptional()
    userDocumentNumber: string | null;

    @IsNumber()
    topicId: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAuthorDto)
    @IsOptional()
    authors: CreateAuthorDto[];
}


