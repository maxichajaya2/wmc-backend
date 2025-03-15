import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStandDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsOptional()
    positionX?: number;

    @IsNumber()
    @IsOptional()
    positionY?: number;

    @IsNumber()
    @IsOptional()
    exhibitorId?: number;

    @IsNumber()
    pavilionId: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}