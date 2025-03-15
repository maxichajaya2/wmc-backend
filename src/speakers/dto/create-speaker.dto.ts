import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSpeakerDto {
    @IsNumber()
    @IsOptional()
    speakerTypeId?: number;

    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    jobEn?: string;

    @IsString()
    @IsOptional()
    jobEs?: string;

    @IsString()
    @IsOptional()
    cvEs?: string;
    @IsString()

    @IsOptional()
    cvEn?: string;
    @IsString()

    @IsOptional()
    photoUrl?: string;

    @IsString()
    @IsOptional()
    countryCode?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}