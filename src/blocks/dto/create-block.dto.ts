import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBlockDto {
    @IsString()
    @IsNotEmpty()
    titleEn: string;

    @IsString()
    @IsNotEmpty()
    titleEs: string;

    @IsString()
    @IsNotEmpty()
    urlKey: string;

    @IsString()
    @IsOptional()
    contentEn: string;

    @IsString()
    @IsOptional()
    contentEs: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}