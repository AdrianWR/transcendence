import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'db',
        port: 5432,
        username: 'postgres',
        password: 'transcendence',
        database: 'transcendence',
        entities: [__dirname + '/../**/*.entity.js'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];