import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsOptional()
    permissionIds?: number[];

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}