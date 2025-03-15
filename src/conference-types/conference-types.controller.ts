import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConferenceTypesService } from './conference-types.service';
import { CreateConferenceTypeDto } from './dto/create-conference-type.dto';
import { UpdateConferenceTypeDto } from './dto/update-conference-type.dto';

@Controller('conference-types')
export class ConferenceTypesController {
  constructor(private readonly conferenceTypesService: ConferenceTypesService) { }

  @Post()
  create(@Body() createConferenceTypeDto: CreateConferenceTypeDto) {
    return this.conferenceTypesService.create(createConferenceTypeDto);
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.conferenceTypesService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.conferenceTypesService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConferenceTypeDto: UpdateConferenceTypeDto) {
    return this.conferenceTypesService.update(+id, updateConferenceTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conferenceTypesService.remove(+id);
  }
}
