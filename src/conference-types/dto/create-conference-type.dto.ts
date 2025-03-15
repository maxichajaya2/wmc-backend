import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateConferenceTypeDto {
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
