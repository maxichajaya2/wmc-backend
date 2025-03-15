import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class SpeakerDto{
    @IsNumber()
    id: number;

    @IsNumber()
    speakerTypeId: number;
}
export class CreateConferenceDto {
    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsString()
    @IsNotEmpty()
    nameEs: string;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsNotEmpty()
    endDate: string;

    @IsNumber()
    roomId: number;

    @IsString()
    @IsOptional()
    resumeEn?: string;

    @IsString()
    @IsOptional()
    resumeEs?: string;

    @IsString()
    @IsOptional()
    liveLink?: string;

    @IsString()
    @IsOptional()
    liveImage?: string;

    @IsString()
    @IsOptional()
    googleLink?: string;

    @IsString()
    @IsOptional()
    outlookLink?: string;

    @IsString()
    @IsOptional()
    calendarLink?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsArray()
    @Type(() => SpeakerDto)
    @ValidateNested({
        each: true,
    })
    speakers?: SpeakerDto[];
}