import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { GameModule } from './game/game.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, authConfig]
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
        autoLoadEntities: true
      }),
      inject: [databaseConfig.KEY],
    }),
    UsersModule,
    ChannelsModule,
    GameModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
