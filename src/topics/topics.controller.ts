import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.topicsService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.topicsService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Post()
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }

  @Post(':id/users/:userId')
  addUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.topicsService.addUser(+id, +userId);
  }

  @Delete(':id/users/:userId')
  removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.topicsService.removeUser(+id, +userId);
  }

  @Get(':id/users')
  findUsers(@Param('id') id: string) {
    return this.topicsService.getUsers(+id);
  }

}
