import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PressReleaseType } from "../../domain/entities/press-release.entity";

export class CreatePressReleaseDto {
    @IsEnum(PressReleaseType)
    type: PressReleaseType;

    @IsString()
    @IsNotEmpty() 
    titleEs: string;

    @IsString()
    @IsNotEmpty()
    titleEn: string;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    photo?: string;

    @IsString()
    @IsOptional()
    textEs?: string;

    @IsString()
    @IsOptional()
    textEn?: string;

    @IsString()
    @IsOptional()
    video?: string;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsOptional()
    subtitleEs?: string;

    @IsString()
    @IsOptional()
    subtitleEn?: string;
}