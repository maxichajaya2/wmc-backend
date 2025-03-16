import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsNumber()
    roleId: number;

    @IsNumber()
    categoryId: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}