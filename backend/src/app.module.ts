import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    DatabaseModule,
    GameModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
