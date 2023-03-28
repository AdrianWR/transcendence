import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            cb(null, configService.get<string>('USER_PICTURE_PATH'));
          },
          filename: function (req, file, cb) {
            const uniqueSuffix = `${Date.now()}_${Math.round(
              Math.random() * 1e9,
            )}`;
            const [fileOriginalName, extension] = file.originalname.split('.');
            cb(null, `${fileOriginalName}_${uniqueSuffix}.${extension}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
