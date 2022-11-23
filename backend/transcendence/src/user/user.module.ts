import { Module } from '@nestjs/common';
import { UserController } from './controller/user/user.controller';

@Module({
  controllers: [UserController]
})
export class UserModule {}
