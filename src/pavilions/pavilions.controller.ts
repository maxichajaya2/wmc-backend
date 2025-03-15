import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { PavilionsService } from './pavilions.service';
import { CreatePavilionDto } from './dto/create-pavilion.dto';
import { UpdatePavilionDto } from './dto/update-pavilion.dto';

@Controller('pavilions')
export class PavilionsController {
  constructor(private readonly pavilionsService: PavilionsService) {}

  @Post()
  create(@Body() createPavilionDto: CreatePavilionDto) {
    return this.pavilionsService.create(createPavilionDto);
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.pavilionsService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pavilionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePavilionDto: UpdatePavilionDto) {
    return this.pavilionsService.update(+id, updatePavilionDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pavilionsService.remove(+id);
  }
}
