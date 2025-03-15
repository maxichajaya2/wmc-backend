import { Module } from '@nestjs/common';
import { PaperAuthorsService } from './paper-authors.service';
import { PaperAuthorsController } from './paper-authors.controller';

@Module({
  controllers: [PaperAuthorsController],
  providers: [PaperAuthorsService],
})
export class PaperAuthorsModule {}
