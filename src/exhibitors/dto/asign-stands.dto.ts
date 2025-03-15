import { IsArray } from "class-validator";

export class AssignStandsDto {
    @IsArray()
    standIds: number[];
}