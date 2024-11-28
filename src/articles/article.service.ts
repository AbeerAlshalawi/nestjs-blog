import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { User } from 'src/users/entities/user.entity';
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

  async create(createArticleDto: CreateArticleDTO, userId: number) {
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
        HttpStatus.FORBIDDEN,
      );
    }

    await this.articleRepository.remove(article);
  }

  async getAll(filter: FilterDto) {
    const where = { title: filter.filter };

    //  where['title'] = Like(`%${filter.title}%`);

    const [articles, total] = await this.paginate(
      this.articleRepository,
      filter,
      where,
    );

    return {
      data: articles,
      count: total,
      currentPage: filter.page,
      pageSize: filter.pageSize,
    };
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
