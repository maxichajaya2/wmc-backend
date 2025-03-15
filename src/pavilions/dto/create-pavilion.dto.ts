import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePavilionDto {
    @IsString()
    @IsNotEmpty()
    nameEs: string;

    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}