import { Article } from 'src/article/entities/article.entity';

export class CreateUserDto {
  readonly username: string;
  readonly password: string;
  articles: Article[];
}
