import { IsNotEmpty, IsString } from "class-validator";

export class CreateParameterDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}
