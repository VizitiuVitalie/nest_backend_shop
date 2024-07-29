import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { DatabaseProvider } from 'src/database/database.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepo, DatabaseProvider],
})
export class UserModule {}
