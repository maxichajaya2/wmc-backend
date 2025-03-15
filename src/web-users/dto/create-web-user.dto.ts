import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { DocumentType, WebUserType } from "../../domain/entities/web-user.entity";

export class CreateWebUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEnum(DocumentType)
    documentType: DocumentType;

    @IsEnum(WebUserType)
    @IsOptional()
    webUserType: WebUserType;

    @IsString()
    @IsNotEmpty()
    documentNumber: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}