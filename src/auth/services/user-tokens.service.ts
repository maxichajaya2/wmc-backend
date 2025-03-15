import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { getResetPasswordTemplate } from '../templates/reset-password.template';
import { MailService } from '../../common/services/mail.service';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { APP_ERRORS, ERROR_CODES } from '../../common/constants/errors.constants';

const EXPIRATION_TIME_IN_SECONDS = process.env.OTP_EXPIRATION_TIME_IN_SECONDS ? Number(process.env.OTP_EXPIRATION_TIME_IN_SECONDS) : 300;

const CACHE = new Map<string, { email: string, expiresAt: Date }>();

@Injectable()
export class UserTokensService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly mailService: MailService,
    ) { }

    async sendResetPasswordOtp(email: string) {
        console.debug(`Sending reset password OTP to ${email}`);
        const token = uuidv4();
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 1000 * EXPIRATION_TIME_IN_SECONDS);
        CACHE.set(token, { email, expiresAt });
        this.mailService.sendMail({
            subject: 'Recuperación de contraseña',
            to: email,
            template: getResetPasswordTemplate(token),
        });
        return {
            message: 'OTP sent successfully'
        }
    }

    async validateAndGetUserToken({ token }: { token: string }) {
        const item = CACHE.get(token);
        if(!item){
            console.debug(`Token ${token} not found`);
            throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
        }
        const now = new Date();
        if (item.expiresAt < now) {
            console.debug(`Token ${token} expired`);
            throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
        }
        return item;
    }
}
