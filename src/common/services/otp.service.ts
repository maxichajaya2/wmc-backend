import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendOTPDto } from '../dtos/send-otp.dto';
import { Generator } from '../helpers/generator.helper';
import { APP_ERRORS, ERROR_CODES } from '../constants/errors.constants';
// const Redis = require('ioredis');

const OTP_CODE_LENGTH = 6;
const OTP_CACHE = {};

@Injectable()
export class OtpService {

    otpExpirationTime = process.env.OTP_EXPIRATION_TIME_IN_SECONDS || 300;

    constructor(
        private readonly mailService: MailService,
    ) {}

    async sendOtp(sendOTPDto: SendOTPDto) {
        const { email } = sendOTPDto;
        console.log(`Sending OTP to ${email}`);
        const code = Generator.code(OTP_CODE_LENGTH);
        console.log(`Generated OTP: ${code}`);
        try {
            this.mailService.sendVerificationCode({
                to: email,
                code,
            });
            console.log(`storing OTP ${code} ${email} in cache for ${this.otpExpirationTime} seconds`);
            OTP_CACHE[code] = email;
            return {
                email,
                ttl: this.otpExpirationTime,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error sending OTP');
        }
    }

    async verifyOtp({ code, email }: { code: string, email: string }) {
        const verificationOtpIsActive = (process.env.OTP_VERIFICATION_IS_ACTIVE || 'true') === 'true';
        console.log(`verifying otp code ${code} for email ${email}`);
        console.log(OTP_CACHE);
        const verifiedEmail = OTP_CACHE[code];
        console.log(`Verified email: ${verifiedEmail}`);
        console.log(`Verification Otp is active: ${verificationOtpIsActive}`);
        const isValid = (email === verifiedEmail || !verificationOtpIsActive);
        if (!isValid) {
            throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
        }
        return isValid;
    }
}
