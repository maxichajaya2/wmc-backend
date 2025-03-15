import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  findAll(@Query('short') short: string, @Query('onlyActive') onlyActive: string, @Query('keys') keys: string) {
    return this.pagesService.findAll({short: short === 'true', onlyActive: onlyActive === 'true', keys});
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.pagesService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(+id, updatePageDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(+id);
  }
}
