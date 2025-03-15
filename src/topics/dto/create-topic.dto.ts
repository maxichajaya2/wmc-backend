import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTopicDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}