import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageService } from 'src/common/page.service';

@Injectable()
export class ArticleService extends PageService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {
    super();
  }

  async create(createArticleDto: CreateArticleDto) {
    const { title, body } = createArticleDto;

    if (!title || !body) {
      throw new HttpException(
        'Title and body are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const article = this.articleRepository.create(createArticleDto);
    this.articleRepository.save(article);
  }
}
