import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaperAuthorsService } from './paper-authors.service';
import { CreatePaperAuthorDto } from './dto/create-paper-author.dto';
import { UpdatePaperAuthorDto } from './dto/update-paper-author.dto';

@Controller('paper-authors')
export class PaperAuthorsController {
  constructor(private readonly paperAuthorsService: PaperAuthorsService) {}

  @Post()
  create(@Body() createPaperAuthorDto: CreatePaperAuthorDto) {
    return this.paperAuthorsService.create(createPaperAuthorDto);
  }

  @Get()
  findAll() {
    return this.paperAuthorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paperAuthorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaperAuthorDto: UpdatePaperAuthorDto) {
    return this.paperAuthorsService.update(+id, updatePaperAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paperAuthorsService.remove(+id);
  }
}
