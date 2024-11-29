import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { UserModule } from 'src/users/user.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Article]), RedisModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
