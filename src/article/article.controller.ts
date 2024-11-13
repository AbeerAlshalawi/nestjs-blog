import { Controller, Post, Body } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller({ path: 'articles', version: '1.0' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('')
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }
}
