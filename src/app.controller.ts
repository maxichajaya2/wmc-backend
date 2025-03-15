import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CountriesService } from './common/services/countries.service';
import { SendContactEmailDto } from './common/dtos/send-contact-email.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly countriesService: CountriesService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('countries')
  getCountries(){
    return this.countriesService.findAll();
  }

  @Post('send-contact-email')
  sendContactEmail(@Body() sendContactEmailDto: SendContactEmailDto){
    return this.appService.sendContactEmail(sendContactEmailDto);
  }
}
