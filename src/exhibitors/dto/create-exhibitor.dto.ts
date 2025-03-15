import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateExhibitorDto {
    @IsString()
    @IsNotEmpty()
    ruc: string;

    @IsString()
    @IsNotEmpty()
    enterprise: string;

    @IsString()
    @IsOptional()
    web?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}