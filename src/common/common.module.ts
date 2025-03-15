import { Global, Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { MailService } from './services/mail.service';
import { CommonService } from './common.service';
import { OtpService } from './services/otp.service';
import { CountriesService } from './services/countries.service';

@Global()
@Module({
  providers: [
    MailService,
    CommonService,
    OtpService,
    CountriesService
  ],
  controllers: [CommonController],
  imports: [],
  exports: [
    MailService,
    CountriesService
  ],
})
export class CommonModule { }
