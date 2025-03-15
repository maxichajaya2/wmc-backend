import { IsUUID } from "class-validator";

export class RegisterDto {
    @IsUUID()
    token: string;
}