import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, DatabaseModule, ConfigModule.forRoot(), GameModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
