import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { GallerySize, GalleryType } from "../../domain/entities/gallery.entity";
import { Type } from "class-transformer";

export class CreateGalleryDto {
    @IsString()
    @IsNotEmpty()
    urlKey: string;

    @IsString()
    @IsNotEmpty()
    titleEn: string;

    @IsString()
    @IsNotEmpty()
    titleEs: string;

    @IsString()
    @IsOptional()
    contentEn: string;

    @IsString()
    @IsOptional()
    contentEs: string;

    @IsString()
    @IsOptional()
    descriptionEn: string;

    @IsString()
    @IsOptional()
    descriptionEs: string;

    @IsEnum(GallerySize)
    @IsOptional()
    size?: GallerySize;

    @IsEnum(GalleryType)
    type: GalleryType;

    @IsArray()
    @Type(() => ImageDto)
    @ValidateNested({
        each: true,
    })
    images: ImageDto[];

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    url?: string;

    @IsBoolean()
    @IsOptional()
    isTargetBlank?: boolean;
}

class ImageDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @IsOptional()
    valueEs: string;

    @IsString()
    @IsOptional()
    valueEn: string;

    @IsNumber()
    @IsNotEmpty()
    sort: number;

    @IsString()
    @IsOptional()
    urlEn?: string;

    @IsString()
    @IsOptional()
    urlEs?: string;

    @IsBoolean()
    @IsOptional()
    isTargetBlank?: boolean;
}