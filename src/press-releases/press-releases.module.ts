import { Module } from '@nestjs/common';
import { PressReleasesService } from './press-releases.service';
import { PressReleasesController } from './press-releases.controller';

@Module({
  controllers: [PressReleasesController],
  providers: [PressReleasesService],
})
export class PressReleasesModule {}
