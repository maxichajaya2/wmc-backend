import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { SieService } from './services/sie.service';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, SieService],
})
export class EnrollmentsModule {}
