import { Module } from '@nestjs/common';
import { SpeakerTypesService } from './speaker-types.service';
import { SpeakerTypesController } from './speaker-types.controller';

@Module({
  controllers: [SpeakerTypesController],
  providers: [SpeakerTypesService],
})
export class SpeakerTypesModule {}
