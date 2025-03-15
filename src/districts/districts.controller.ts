import { Controller, Get, Query } from '@nestjs/common';
import { DistrictsService } from './districts.service';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.districtsService.findAll(query);
  }
}
