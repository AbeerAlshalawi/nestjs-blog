import { IsNotEmpty, IsString } from 'class-validator';
import { ArticleDTO } from 'src/article/dto/article.dto';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  articles: ArticleDTO[];
}
