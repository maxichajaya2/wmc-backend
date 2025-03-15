import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { ConferencesService } from './conferences.service';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';

@Controller('conferences')
export class ConferencesController {
  constructor(private readonly conferencesService: ConferencesService) {}

  @Post()
  create(@Body() createConferenceDto: CreateConferenceDto) {
    return this.conferencesService.create(createConferenceDto);
  }

  @Get()
  findAll(@Query('mode') mode: string, @Query('speakerId') speakerId: string) {
    return this.conferencesService.findAll({mode, speakerId: speakerId ? +speakerId : undefined});
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.conferencesService.findOne(+id, {onlyActive: onlyActive === 'true'});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConferenceDto: UpdateConferenceDto) {
    return this.conferencesService.update(+id, updateConferenceDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conferencesService.remove(+id);
  }
}
