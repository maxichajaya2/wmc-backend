import { Module } from '@nestjs/common';
import { PavilionsService } from './pavilions.service';
import { PavilionsController } from './pavilions.controller';

@Module({
  controllers: [PavilionsController],
  providers: [PavilionsService],
})
export class PavilionsModule {}
