import { IsNotEmpty, IsString } from 'class-validator';
import { Article } from 'src/article/entities/article.entity';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  articles: Article[];
}
