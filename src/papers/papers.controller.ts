import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, UseGuards, Put, Query } from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { DashboardAuthGuard } from '../auth/guards/dashboard-auth.guard';
import { ChangeStateDto } from './dto/change-state.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@UseGuards(DashboardAuthGuard)
@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.papersService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.papersService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaperDto: CreatePaperDto) {
    return this.papersService.update(+id, updatePaperDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.papersService.remove(+id);
  }

  @Post(':id/change-state')
  changeState(@Param('id') id: string, @Body() changeStateDto: ChangeStateDto) {
    return this.papersService.changeStatus(+id, changeStateDto);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.papersService.findComments(+id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() addCommentDto: AddCommentDto) {
    return this.papersService.addComment(+id, addCommentDto);
  }

  @Patch(':id/comments/:commentId')
  updateComment(@Param('id') id: string, @Param('commentId') commentId: string, @Body() addCommentDto: AddCommentDto) {
    return this.papersService.updateComment(+id, +commentId, addCommentDto);
  }

  @HttpCode(204)
  @Delete(':id/comments/:commentId')
  removeComment(@Param('id') id: string, @Param('commentId') commentId: string) {
    return this.papersService.deleteComment(+id, +commentId);
  }

  @Get(':id/authors')
  getAuthors(@Param('id') id: string) {
    return this.papersService.findAuthors(+id);
  }
}
