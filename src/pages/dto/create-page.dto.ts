import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    titleEn: string;

    @IsString()
    @IsNotEmpty()
    titleEs: string;

    @IsString()
    @IsNotEmpty()
    urlKeyEn: string;

    @IsString()
    @IsNotEmpty()
    urlKeyEs: string;

    @IsString()
    contentEn: string;

    @IsString()
    contentEs: string;

    @IsString()
    decriptionEn: string;

    @IsString()
    decriptionEs: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
