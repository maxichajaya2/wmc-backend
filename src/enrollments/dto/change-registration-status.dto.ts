import { IsEnum } from "class-validator";
import { RegistrationStatus } from "../../domain/entities/enrollment.entity";

export class ChangeRegistrationStatusDto{
    @IsEnum(RegistrationStatus)
    status: RegistrationStatus;
}