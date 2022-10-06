import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AyrshareService } from 'src/common/service/ayrshare.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AyrshareService]
})
export class UsersModule {}
