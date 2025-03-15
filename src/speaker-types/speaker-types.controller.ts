import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SpeakerTypesService } from './speaker-types.service';
import { CreateSpeakerTypeDto } from './dto/create-speaker-type.dto';
import { UpdateSpeakerTypeDto } from './dto/update-speaker-type.dto';

@Controller('speaker-types')
export class SpeakerTypesController {
  constructor(private readonly speakerTypesService: SpeakerTypesService) { }

  @Post()
  create(@Body() createSpeakerTypeDto: CreateSpeakerTypeDto) {
    return this.speakerTypesService.create(createSpeakerTypeDto);
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.speakerTypesService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.speakerTypesService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpeakerTypeDto: UpdateSpeakerTypeDto) {
    return this.speakerTypesService.update(+id, updateSpeakerTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.speakerTypesService.remove(+id);
  }
}
