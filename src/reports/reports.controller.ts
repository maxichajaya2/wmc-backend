import { Response } from 'express';

import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PaperState, Process } from '../domain/entities/paper.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('papers')
  async getPapersReport(
    @Res() res: Response,
    @Query('state') state?: PaperState,
    @Query('reviewerUserId') reviewerUserId?: number,
    @Query('leaderId') leaderId?: number,
    @Query('topicId') topicId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('process') process?: Process,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const buffer = await this.reportsService.getPapersReport({
      state,
      reviewerUserId,
      leaderId,
      topicId,
      categoryId,
      process,
      startDate,
      endDate,
    });

    // Configurar headers para la descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=trabajos-tecnicos.xlsx');

    res.send(buffer);
  }
}
