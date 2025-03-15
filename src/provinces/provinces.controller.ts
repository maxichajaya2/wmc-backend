import { Controller, Get, Query } from '@nestjs/common';
import { ProvincesService } from './provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.provincesService.findAll(query);
  }
}
