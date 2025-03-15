import { Body, Controller, Post } from '@nestjs/common';
import { SendOTPDto } from './dtos/send-otp.dto';
import { OtpService } from './services/otp.service';

@Controller('common')
export class CommonController {
    constructor(
        private readonly otpService: OtpService,
    ) {}

    @Post('send-otp')
    sendOtp(@Body() sendOtpDto: SendOTPDto){
        return this.otpService.sendOtp(sendOtpDto);
    }
}
