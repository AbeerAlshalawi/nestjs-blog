import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { User } from '../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { PageService } from '../common/page.service';
import { FilterDto } from '../common/filter.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ArticleService extends PageService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  async create(createArticleDto: CreateArticleDTO, userId: number) {
    const { title, body } = createArticleDto;

    if (!title || !body) {
      throw new HttpException(
        'Title and body are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const article = new Article();
    article.title = title;
    article.body = body;
    article.user = user;
    await this.articleRepository.save(article);
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDTO, userId: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.user.id !== userId) {
      throw new HttpException(
        'You are not authorized to edit this article',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, updateArticleDto);
    await this.articleRepository.save(article);
    return article;
  }

  async delete(id: number, userId: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.user.id !== userId) {
      throw new HttpException(
        'You are not authorized to delete this article',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.articleRepository.remove(article);
  }

  async getAll(filter: FilterDto) {
    const cacheKey = JSON.stringify(filter);
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const where = { title: filter.filter };

    const [articles, total] = await this.paginate(
      this.articleRepository,
      filter,
      where,
    );
    console.log('------ Articles retrived from the DB');

    const result = {
      data: articles,
      count: total,
      currentPage: filter.page,
      pageSize: filter.pageSize,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 60 * 5);

    return result;
  }

  async fillArticles() {
    const articlesRepo: Repository<Article> = this.articleRepository;

    const chunkSize = 10_000;
    const totalArticles = 1_000_000;
    const articles = [];

    for (let i = 0; i < totalArticles; i++) {
      const randomTitle = faker.lorem.sentence(1);
      const randomBody = faker.lorem.text();

      articles.push({
        title: randomTitle,
        body: randomBody,
      });

      if (articles.length === chunkSize) {
        console.log('Inserting chunk Number:', Math.floor(i / chunkSize) + 1);
        console.log('Percentage done:', ((i + 1) / totalArticles) * 100 + '%');
        await articlesRepo.insert(articles);
        articles.length = 0;
      }
    }

    if (articles.length > 0) {
      await articlesRepo.insert(articles);
    }
  }
}
