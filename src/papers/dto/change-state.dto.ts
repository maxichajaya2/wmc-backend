import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { PaperState, PaperType } from "../../domain/entities/paper.entity";

export class ChangeStateDto{
    @IsEnum(PaperState)
    state: PaperState;

    @IsNumber()
    @IsOptional()
    reviewerUserId?: number;

    @IsNumber()
    @IsOptional()
    leaderId?: number;

    @IsEnum(PaperType)
    @IsOptional()
    type?: PaperType;
}