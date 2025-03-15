import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSpeakerTypeDto {
    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsString()
    @IsNotEmpty()
    nameEs: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
