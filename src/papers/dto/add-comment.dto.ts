import { IsNotEmpty, IsNumber, isNumber, IsOptional, IsString } from "class-validator";

export class AddCommentDto {
    @IsString()
    @IsNotEmpty()
    comentary?: string;

    @IsString()
    @IsOptional()
    fileUrl?: string;
}