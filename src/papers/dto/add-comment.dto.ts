import { IsNotEmpty, IsNumber, isNumber, IsString } from "class-validator";

export class AddCommentDto {
    @IsString()
    @IsNotEmpty()
    comentary?: string;

    @IsString()
    @IsNotEmpty()
    fileUrl?: string;
}