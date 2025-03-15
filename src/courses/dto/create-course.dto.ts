import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    nameEs: string;

    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsNumber()
    conferenceTypeId: number;
}
