import { Module } from '@nestjs/common';
import { WebUsersService } from './web-users.service';
import { WebUsersController } from './web-users.controller';

@Module({
  controllers: [WebUsersController],
  providers: [WebUsersService],
})
export class WebUsersModule {}

