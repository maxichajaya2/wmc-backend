import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMenuDto{
    @IsString()
    @IsNotEmpty()
    titleEs: string;

    @IsString()
    @IsNotEmpty()
    titleEn: string;

    @IsNumber()
    @IsOptional()
    parentId: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsNumber()
    sort: number;

    @IsBoolean()
    isExternalUrl: boolean;

    @IsString()
    @IsOptional()
    url: string;

    @IsNumber()
    @IsOptional()
    pageId: number;

    @IsString()
    @IsOptional()
    icon: string;
}