import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';


export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: +config.get<number>('POSTGRES_PORT', 5432),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity.js'],
        synchronize: true,
      });
      return dataSource.initialize(
      );
    },
    inject: [ConfigService],
  },
];