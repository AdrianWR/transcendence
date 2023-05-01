import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './game/game.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: dbConfig.postgres.host,
        port: +dbConfig.postgres.port,
        username: dbConfig.postgres.username,
        password: dbConfig.postgres.password,
        database: dbConfig.postgres.database,
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    UsersModule,
    GameModule,
    ChatModule,
    AuthModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
