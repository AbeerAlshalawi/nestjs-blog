import { ArticleDto } from 'src/article/dto/article.dto';

export class UserDto {
  username: string;
  articles: ArticleDto[];
}
