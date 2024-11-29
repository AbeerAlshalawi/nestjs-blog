import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV;
const typeORMConfig: DataSourceOptions =
  env === 'test'
    ? {
        type: 'postgres',
        host: process.env.TEST_DB_HOST,
        port: 5432,
        username: process.env.TEST_DB_USERNAME,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_NAME,
        synchronize: false,
        entities: ['src/**/*.entity{.ts,.js}'],
        migrations: ['src/migration/*{.ts,.js}'],
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        entities: ['src/**/*.entity{.ts,.js}'],
        migrations: ['src/migration/*{.ts,.js}'],
      };

export const dataSourceOptions: DataSourceOptions = typeORMConfig;

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();

export default dataSource;

// import { DataSource, DataSourceOptions } from 'typeorm';
// import * as dotenv from 'dotenv';
// dotenv.config();

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: '',
//   database: 'masar-blog',
//   synchronize: false,
//   logging: true,
//   migrations: ['src/migration/*{.ts,.js}'],
//   entities: ['src/**/*.entity{.ts,.js}'],
// };

// const dataSource = new DataSource(dataSourceOptions);
// dataSource.initialize();

// export default dataSource;
