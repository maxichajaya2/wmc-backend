import { Module } from '@nestjs/common';
import { AbstractsService } from './abstracts.service';
import { AbstractsController } from './abstracts.controller';

@Module({
  controllers: [AbstractsController],
  providers: [AbstractsService],
})
export class AbstractsModule {}
