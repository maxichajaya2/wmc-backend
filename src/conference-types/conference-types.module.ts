import { Module } from '@nestjs/common';
import { ConferenceTypesService } from './conference-types.service';
import { ConferenceTypesController } from './conference-types.controller';

@Module({
  controllers: [ConferenceTypesController],
  providers: [ConferenceTypesService],
})
export class ConferenceTypesModule {}
