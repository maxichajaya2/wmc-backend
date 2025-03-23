import { Response } from 'express';

import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('papers')
  async getPapersReport(@Res() res: Response) {
    const buffer = await this.reportsService.getPapersReport();

    // Configurar headers para la descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=trabajos-tecnicos.xlsx');

    res.send(buffer);
  }
}
