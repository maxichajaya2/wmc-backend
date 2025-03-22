import { IsNotEmpty, IsString } from "class-validator";

export class UploadFullFileDto {
    @IsString()
    @IsNotEmpty()
    fullFileUrl?: string;
}