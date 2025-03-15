import { Injectable } from "@nestjs/common";
import { SendOTPDto } from "./dtos/send-otp.dto";
import { OtpService } from "./services/otp.service";

@Injectable()
export class CommonService {
    constructor(
        private readonly otpService: OtpService,
    ) {
    }

    async sendOtp(sendOTPDto: SendOTPDto) {
        return this.otpService.sendOtp(sendOTPDto);
    }
}