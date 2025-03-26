import { Controller, Get, Body, Patch, Param, Delete, HttpCode, Post, Query } from '@nestjs/common';
import { WebUsersService } from './web-users.service';
import { UpdateWebUserDto } from './dto/update-web-user.dto';
import { paperMapper } from '../papers/mappers/paper.mapper';

@Controller('web-users')
export class WebUsersController {
  constructor(private readonly webUsersService: WebUsersService) {}

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.webUsersService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Post()
  create(@Body() createWebUserDto: any) {
    return this.webUsersService.create(createWebUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.webUsersService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebUserDto: UpdateWebUserDto) {
    return this.webUsersService.update(+id, updateWebUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webUsersService.remove(+id);
  }

  // @Get(':id/enrollments')
  // findEnrollments(@Param('id') id: string) {
  //   return this.webUsersService.findEnrollments(+id);
  // }

  @Get(':id/papers')
  async findEnrollments(@Param('id') id: string) {
    const papers = await this.webUsersService.getPapers(+id);
    return papers.map(p => paperMapper(p))
  }
}
