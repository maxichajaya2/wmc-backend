import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { ExhibitorsService } from './exhibitors.service';
import { CreateExhibitorDto } from './dto/create-exhibitor.dto';
import { UpdateExhibitorDto } from './dto/update-exhibitor.dto';
import { AssignStandsDto } from './dto/asign-stands.dto';

@Controller('exhibitors')
export class ExhibitorsController {
  constructor(private readonly exhibitorsService: ExhibitorsService) {}

  @Post()
  create(@Body() createExhibitorDto: CreateExhibitorDto) {
    return this.exhibitorsService.create(createExhibitorDto);
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.exhibitorsService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExhibitorDto: UpdateExhibitorDto) {
    return this.exhibitorsService.update(+id, updateExhibitorDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitorsService.remove(+id);
  }

  @HttpCode(200)
  @Post(':id/stands')
  setStands(@Param('id') id: string, @Body() assignStandsDto: AssignStandsDto) {
    return this.exhibitorsService.setStands(+id, assignStandsDto);
  }
}
