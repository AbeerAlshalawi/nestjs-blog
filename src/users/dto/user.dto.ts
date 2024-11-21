import { IsNotEmpty, IsString } from 'class-validator';
import { ArticleDTO } from 'src/articles/dto/article.dto';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  articles: ArticleDTO[];
}
