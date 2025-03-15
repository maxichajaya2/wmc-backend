import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddPermissionDto{
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsNotEmpty()
    module: string;
}