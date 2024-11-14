import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateArticleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  user: User;
}
