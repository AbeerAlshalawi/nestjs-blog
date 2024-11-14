import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { PageService } from 'src/common/page.service';
import { FilterDto } from 'src/common/filter.dto';

@Injectable()
export class ArticleService extends PageService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }

  async create(createArticleDto: CreateArticleDto, userId: number) {
    const { title, body } = createArticleDto;

    if (!title || !body) {
      throw new HttpException(
        'Title and body are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const article = new Article();
    article.title = title;
    article.body = body;
    article.user = { id: userId } as User;
    await this.articleRepository.save(article);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, userId: number) {
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
        HttpStatus.FORBIDDEN,
      );
    }

    await this.articleRepository.remove(article);
  }

  async getAll(filter: FilterDto) {
    const where = {};

    if (filter.title) {
      where['title'] = Like(`%${filter.title}%`);
    }

    const [articles, count] = await this.paginate(
      this.articleRepository,
      filter,
      where,
    );

    return {
      data: articles,
      count: count,
      currentPage: filter.page,
      pageSize: filter.pageSize,
    };
  }

  async fillArticles() {
    const articlesRepo = this.articleRepository;
    const users = await this.userRepository.find();

    const article = Array.from({ length: 1000 }, () => ({
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      user: users[Math.floor(Math.random() * users.length)],
    }));
    await articlesRepo.save(article);
  }
}
