import { IsNumber } from "class-validator";

export class RateDto{
    @IsNumber()
    score1: number;

    @IsNumber()
    score2: number;

    @IsNumber()
    score3: number;
}