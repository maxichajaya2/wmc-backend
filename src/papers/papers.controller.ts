import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, UseGuards, Put, Query } from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { DashboardAuthGuard } from '../auth/guards/dashboard-auth.guard';
import { ChangeStateDto } from './dto/change-state.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GlobalGuard } from '../auth/guards/global-guard';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @UseGuards(GlobalGuard)
  @Post()
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  //TODO: Implementar el guard
  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.papersService.findAll({ onlyActive: onlyActive === 'true' });
  }

  //TODO: Implementar el guard
  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.papersService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaperDto: CreatePaperDto) {
    return this.papersService.update(+id, updatePaperDto);
  }

  //TODO: Implementar el guard
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.papersService.remove(+id);
  }

  @UseGuards(GlobalGuard)
  @Post(':id/change-state')
  changeState(@Param('id') id: string, @Body() changeStateDto: ChangeStateDto) {
    return this.papersService.changeStatus(+id, changeStateDto);
  }

  //TODO: Implementar el guard
  @UseGuards(GlobalGuard)
  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.papersService.findComments(+id);
  }

  @UseGuards(DashboardAuthGuard)
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() addCommentDto: AddCommentDto) {
    return this.papersService.addComment(+id, addCommentDto);
  }

  @UseGuards(DashboardAuthGuard)
  @Patch(':id/comments/:commentId')
  updateComment(@Param('id') id: string, @Param('commentId') commentId: string, @Body() addCommentDto: AddCommentDto) {
    return this.papersService.updateComment(+id, +commentId, addCommentDto);
  }

  @UseGuards(DashboardAuthGuard)
  @HttpCode(204)
  @Delete(':id/comments/:commentId')
  removeComment(@Param('id') id: string, @Param('commentId') commentId: string) {
    return this.papersService.deleteComment(+id, +commentId);
  }

  //TODO: Implementar el guard
  @Get(':id/authors')
  getAuthors(@Param('id') id: string) {
    return this.papersService.findAuthors(+id);
  }
}
