import { Injectable } from '@nestjs/common';
import { SendContactEmailDto } from './common/dtos/send-contact-email.dto';
import { MailService } from './common/services/mail.service';

@Injectable()
export class AppService {

  constructor(
    private readonly mailService: MailService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async sendContactEmail(sendContactEmailDto: SendContactEmailDto) {
    return this.mailService.sendContactEmail(sendContactEmailDto);
  }
}
