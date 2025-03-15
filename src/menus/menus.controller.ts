import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  findAll(@Query('onlyParents') onlyParents: string, @Query('onlyActive') onlyActive: string) {
    return this.menusService.findAll({onlyParents: onlyParents === 'true', onlyActive: onlyActive === 'true'});
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Query('onlyActive') onlyActive: string) {
    return this.menusService.findOne(id, {onlyActive: onlyActive === 'true'});
  }

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.menusService.remove(id);
  }
}