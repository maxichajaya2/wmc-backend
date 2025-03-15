import { IsEnum } from "class-validator";
import { PaymentStatus } from "../../domain/entities/enrollment.entity";

export class ChangePaymentStatusDto{
    @IsEnum(PaymentStatus)
    status: PaymentStatus;
}