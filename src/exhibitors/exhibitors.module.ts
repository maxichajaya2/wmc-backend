import { Module } from '@nestjs/common';
import { ExhibitorsService } from './exhibitors.service';
import { ExhibitorsController } from './exhibitors.controller';

@Module({
  controllers: [ExhibitorsController],
  providers: [ExhibitorsService],
})
export class ExhibitorsModule {}
