import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsNotEmpty()
    module: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
