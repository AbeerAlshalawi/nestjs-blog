import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './articles/article.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.startegy';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { RedisModule } from './redis/redis.module';

const entitiesPath = __dirname + '/**/*.entity{.ts,.js}';

//let typeOrmConfig = {};

const env = process.env.NODE_ENV;

console.log('✅ env', env);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
      env === 'test'
        ? {
            type: 'postgres',
            host: process.env.TEST_DB_HOST,
            port: 5432,
            username: process.env.TEST_DB_USERNAME, //'postgres',
            password: process.env.TEST_DB_PASSWORD,
            database: process.env.TEST_DB_NAME,
            autoLoadEntities: true,
            entities: [entitiesPath],
            synchronize: false,
            migrationsRun: true,
            logging: false,
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME, //'postgres',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            entities: [entitiesPath],
            synchronize: true,
            migrationsRun: true,
            logging: false,
          },
    ),
    ArticleModule,
    UserModule,
    AuthModule,
    CommentsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
